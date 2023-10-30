import {PermissionsAndroid} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import DeviceInfo from 'react-native-device-info';
import {IUser} from '~/redux/user/user.slice';
import SoundService from '~/services/Alert.service';
import {Screens} from '~/models/Navigation.model';
import {navigationRef} from '~/navigators';
import i18n from '~/i18n/i18n';
import {getGoogleMapsUrl, getLocation} from '~/services/Location.service';
import API from '~/services/API.service';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import {BackgroundEventsEnum} from './Background.types';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import {startBioCheck} from './BioCheck.service';
import {stopForegroundFetch, updateNotification} from './Notification.service';
import {CommonActions} from '@react-navigation/native';
import ToastService from './Toast.service';
/**
 * Background fetch and schedule tasks
 */

export const startBackgroundFetch = async () => {
  return await BackgroundFetch.configure(
    {
      minimumFetchInterval: __DEV__ ? 1 : 15,
      forceAlarmManager: true,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
      requiresCharging: false,
      requiresBatteryNotLow: false,
      requiresDeviceIdle: false,
      requiresStorageNotLow: false,
    },
    taskId => mainScheduledEvent({taskId: taskId as BackgroundEventsEnum}),
    taskId =>
      mainScheduledEvent({
        taskId: taskId as BackgroundEventsEnum,
        timeout: true,
      }),
  );
};

export const stopBackgroundFetch = async (taskId?: string) => {
  taskId
    ? await BackgroundFetch.stop(taskId)
    : await BackgroundFetch.stop().catch(error => {
        console.log(error);
      });
  await stopForegroundFetch();
};

export const scheduleEvent = async (
  taskId: BackgroundEventsEnum,
  delay: number,
) => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId,
      stopOnTerminate: false,
      enableHeadless: true,
      delay,
      forceAlarmManager: true,
      periodic: false,
    });
    console.log(`task ${taskId} scheduled to run in ${delay}ms`);
  } catch (e) {
    console.warn(`BackgroundFetch.scheduleTask(${taskId}, ${delay}) fail`, e);
  }
};

export const mainScheduledEvent = async (event: {
  timeout?: boolean;
  taskId: BackgroundEventsEnum | string;
}) => {
  if (event.timeout) {
    console.log(`task ${event.taskId} timeout`);
    BackgroundFetch.finish(event.taskId);
    if (event.taskId === BackgroundEventsEnum.EmergencyRetryMechanism) {
      scheduleEvent(
        BackgroundEventsEnum.EmergencyRetryMechanism,
        60 * 1000,
      ).then(() => console.log('rescheduled after timeout'));
    }
    return;
  }
  switch (event.taskId) {
    case BackgroundEventsEnum.EmergencyRetryMechanism:
      emergencyRetry().catch(e =>
        console.log(`error from background task ${event.taskId}`, e),
      );
      break;
    case BackgroundEventsEnum.ReactNativeBackgroundFetch:
      startBioCheck().catch(e =>
        console.log(`error from background task ${event.taskId}`, e),
      );
      break;
    case BackgroundEventsEnum.AlarmBeforeEmergency:
      soundNotification().catch(e =>
        console.log(`error from background task ${event.taskId}`, e),
      );
      break;
    default:
      console.log(`doing nothing for task ${event.taskId}`);
  }
  BackgroundFetch.finish(event.taskId);
};

/**
 * Application methods
 */

export const updateLocation = async () => {
  try {
    const requestPermission =
      (await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      )) ||
      (await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ));

    const payload: Partial<IUser> = {
      timezone: timestampToISOWithOffset().slice(-6),
    };
    if (requestPermission) {
      const location = await getLocation(5000);
      payload.location = getGoogleMapsUrl(location);
      console.log('LOCATION WILL BE UPDATED');
    }
    await API.updateUser(payload);
  } catch (e) {
    console.log('could not get location', e);
  }
};

export const emergencyRetry = async () => {
  try {
    const {status} = await API.startEmergency({});
    if (status >= 200 && status < 300) {
      await stopBackgroundFetch();
      refreshAllScreens();
      ToastService.warning(i18n.t('automatedEmergencyStatus.stop.describe'), {
        visibilityTime: 10000,
      });
    } else {
      await updateNotification('Error', 'Will retry in a minute...');
      scheduleEvent(
        BackgroundEventsEnum.EmergencyRetryMechanism,
        60 * 1000,
      ).then(() => console.log('retry scheduled...'));
    }
  } catch (e) {
    console.log('api error', e);
    scheduleEvent(BackgroundEventsEnum.EmergencyRetryMechanism, 60 * 1000).then(
      () => console.log('retry scheduled...'),
    );

    const isAirplaneMode = await DeviceInfo.isAirplaneMode();
    if (isAirplaneMode) {
      await updateNotification(
        i18n.t('bioCheck.messages.unableToSendEmergency'),
        i18n.t('bioCheck.messages.airPlaneOff'),
      );
    } else {
      await updateNotification(
        i18n.t('bioCheck.messages.networkError'),
        i18n.t('bioCheck.messages.checkConnection'),
      );
    }
  }
};

export const soundNotification = async () => {
  const response = await AsyncStorageService.getItem(
    AsyncStorageEnum.PersistedUserSettings,
  );
  const responseParse = JSON.parse(response ?? '');
  const {id} = JSON.parse(responseParse?.user ?? {id: ''});
  if (id) {
    SoundService.playAlert();
  }
};

export const refreshAllScreens = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: Screens.Home}],
      }),
    );
  }
};
