import {AppState, PermissionsAndroid} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import ForegroundService from '@voximplant/react-native-foreground-service';
import DeviceInfo from 'react-native-device-info';
import {IUser} from '~/redux/user/user.slice';
import SoundService from '~/services/Alert.service';
import {Screens} from '~/models/Navigation.model';
import {navigationRef} from '~/navigators';
import EnvConfig from '~/services/Env.service';
import i18n from '~/i18n/i18n';

import {getGoogleMapsUrl, getLocation} from '~/services/Location.service';
import API from '~/services/API.service';
import {hasRecentAndCorrectPulseData} from '~/services/GoogleFit.service';
import {
  invokeGetToken,
  listenForPushTokenAndUpdate,
  pushLocalNotification,
} from '~/services/Push.service';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import {isAndroid, isIOS} from '~/utils';
import {BackgroundEventsEnum, NotificationTypesEnum} from './Background.types';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import {getTimeSettings} from '~/services/Time.service';

const notificationChannelId = 'biostasis-channel';

/**
 * Notifications (foreground service)
 */

const VIForegroundService = ForegroundService.getInstance();

export const enableForegroundService = () => {
  const channelConfig = {
    id: notificationChannelId,
    name: 'Biostasis',
    description: 'Information from the application',
    enableVibration: false,
    importance: 5,
  };
  VIForegroundService.createNotificationChannel(channelConfig)
    .then(() => {
      console.log('notification channel created');
    })
    .catch((e: any) => console.log('notification channel creation error', e));
};

export const updateNotification = (
  title: string,
  text: string,
  type?: NotificationTypesEnum,
) => {
  if (isIOS) {
    return null;
  }
  const notificationConfig = {
    channelId: notificationChannelId,
    id: 999,
    title: `${
      EnvConfig.DEV ? '[STICKY] ' : ''
    } ${title} ${new Date().toLocaleTimeString()}`,
    text,
    icon: 'ic_stat_notification',
    type,
  };
  VIForegroundService.startService(notificationConfig)
    .then(() => console.log(`notification updated with: ${title}, ${text}`))
    .catch((e: any) => console.log('update notification error', e));
};

export const stopForegroundFetch = async () => {
  try {
    await VIForegroundService.stopService();
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Background fetch and schedule tasks
 */

export const startBackgroundFetch = async () => {
  isAndroid && enableForegroundService();
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
      pulseCheck().catch(e =>
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
    const requestPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
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
      updateNotification('Finished', 'Emergency has been sent successfully');
      await stopBackgroundFetch(BackgroundEventsEnum.EmergencyRetryMechanism);
    } else {
      updateNotification('Error', 'Will retry in a minute...');
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
      updateNotification(
        i18n.t('pulseCheck.messages.unableToSendEmergency'),
        i18n.t('pulseCheck.messages.airPlaneOff'),
      );
    } else {
      updateNotification(
        i18n.t('pulseCheck.messages.networkError'),
        i18n.t('pulseCheck.messages.checkConnection'),
      );
    }
  }
};

export const pulseCheck = async () => {
  const {positiveInfoPeriod} = await getTimeSettings();
  const response = await AsyncStorageService.getItem(
    AsyncStorageEnum.PersistedUserSettings,
  );
  const responseParse = JSON.parse(response ?? '');
  const {automatedEmergency} = JSON.parse(responseParse.user);
  console.log('-> PULSE CHECK STARTED');
  if (automatedEmergency) {
    try {
      let networkError = false;
      const recentAndCorrectPulseTime = await hasRecentAndCorrectPulseData();

      if (recentAndCorrectPulseTime !== null) {
        console.log('has positive data or positive info');
        try {
          const positiveInfoResponse = await API.positiveInfo(
            positiveInfoPeriod,
          );
          const {status, data} = positiveInfoResponse;
          if (!data.success) {
            /*
              Stop foreground services while trying to send positive while emergency is already escalated
             */
            await stopBackgroundFetch();
          }
          if (status === 201) {
            console.log('positive info successfully sent');
            updateNotification(
              i18n.t('pulseCheck.messages.automatedEmergency'),
              i18n.t('pulseCheck.messages.infoSend'),
            );
          } else {
          }
        } catch (e) {
          const {status, statusText} = e.response || {
            status: 0,
            statusText: 'Network error',
          };
          networkError = true;
          console.log('error while sending positive info', status, statusText);
        }
      }
      if (networkError) {
        updateNotification(
          i18n.t('pulseCheck.messages.offline'),
          i18n.t('pulseCheck.messages.pleaseComeBackOnline'),
        );
        AppState.currentState === 'active'
          ? navigationRef.navigate(Screens.LostConnection as never)
          : pushLocalNotification({
              title: i18n.t('pulseCheck.messages.offline'),
              body: i18n.t('pulseCheck.messages.connectToSendEmergency'),
              type: NotificationTypesEnum.EmergencyOffline,
            });
      }
    } catch (e) {
      updateNotification(
        'Something went wrong',
        'Automated Emergency will retry soon',
      );
    } finally {
      await updateLocation();

      listenForPushTokenAndUpdate();
      invokeGetToken();
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

export const HandleBackgroundNotification = async (notificationData: any) => {
  const {data} = notificationData;
  const type = data?.type || notificationData.type;

  if (
    [
      'EMERGENCY_TIME_BASED_CHECK',
      'EMERGENCY_PULSE_BASED_CHECK',
      'EMERGENCY_ALERT',
    ].includes(type)
  ) {
    const user = await AsyncStorageService.getItem(
      AsyncStorageEnum.PersistedUserSettings,
    );
    const userParsed = user && (await JSON.parse(user));
    userParsed.regularPushNotifications &&
      updateNotification('Emergency triggered remotely', 'Click to cancel it');
    await AsyncStorageService.setItem(
      AsyncStorageEnum.IsEmergencyEscalationStarted,
      'true',
    );
    /*
      Workaround for handling foreground notifications
     */
    if (isAndroid) {
      AppState.currentState === 'active' &&
        navigationRef.navigate(Screens.HealthConditionError as never);
    }
    /*
      Update location for emergency call
     */
    if (isAndroid) {
      type === 'EMERGENCY_ALERT' &&
        (await scheduleEvent(BackgroundEventsEnum.AlarmBeforeEmergency, 10));
      await updateLocation();
    }
  }
};
