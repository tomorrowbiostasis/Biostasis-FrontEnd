import API from '~/services/API.service';
import {isAndroid, isIOS} from '~/utils';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import messaging from '@react-native-firebase/messaging';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {updateNotification} from './Notification.service';
import {soundNotification, updateLocation} from './Background.service';
import {NotificationTypesEnum} from '~/constants/notification.constants';
import {AppState, Vibration} from 'react-native';
import {navigationRef} from '~/navigators';
import {Screens} from '~/models/Navigation.model';
import {logPushEvent} from './PushLogger.service';
import {isSleepPaused} from './SleepSchedule.service';
import {getTimeSettings, isPausedTime} from './Time.service';
let initialized = false;

export const listenForPushTokenAndUpdate = async () => {
  if (!initialized) {
    const currentSavedToken = await AsyncStorageService.getItem(
      AsyncStorageEnum.LastSavedPushToken,
    );
    const fcmToken = await messaging().getToken();
    console.log('Push token refreshed');
    if (currentSavedToken !== fcmToken) {
      API.updateUserToken(fcmToken)
        .then(() => {
          console.log('successfully updated push token in api');

          AsyncStorageService.setItem(
            AsyncStorageEnum.LastSavedPushToken,
            fcmToken,
          ).then(() =>
            console.log(
              'token saved locally at',
              AsyncStorageEnum.LastSavedPushToken,
            ),
          );
        })
        .catch(() => console.log('error updating push token in api'));
    } else {
      console.log('token did not change, doing nothing');
    }
    initialized = true;
  }
};

export const checkNotificationPermissions = async () => {
  try {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('User granted notification permissions');
      return true;
    }
    console.log('User declined notification permissions');
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const hasNotificationPermission = async () => {
  try {
    const settings = await notifee.getNotificationSettings();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const invokeGetToken = async () => {
  if (isAndroid) {
    messaging().registerDeviceForRemoteMessages();
  }
};

const handleForegroundState = (isRegularCheck: boolean) => {
  if (AppState.currentState === 'active') {
    let params;
    isRegularCheck
      ? (params = {regularCheck: true})
      : (params = {healthCheck: true});
    // @ts-ignore
    navigationRef.navigate(Screens.HealthConditionError as never, params);
  }
};

export const handleRemoteMessages = async (message: {
  data: any;
  notification?: any;
}) => {
  console.log('Remote push message received', message?.data?.type);
  await logPushEvent({source: 'background', ...message});
  const {data, notification} = message;
  const {type} = data || {};
  const title = notification?.title;
  const body = notification?.body;

  const isSuppressibleCheck = [
    NotificationTypesEnum.EmergencyRegularCheck,
    NotificationTypesEnum.EmergencyHealthCheck,
  ].includes(type);

  if (isSuppressibleCheck) {
    let monitoringPaused = await isSleepPaused();

    if (!monitoringPaused) {
      try {
        const timeSettings = await getTimeSettings();
        monitoringPaused = isPausedTime(
          new Date(),
          timeSettings.pausedDate,
          timeSettings.specificPausedTimes,
        );
      } catch (error) {
        // Pause lookup is fail-open: a settings/network error must never block
        // an emergency check, and EmergencyAlert never enters this branch.
        console.warn('Could not load monitoring pause settings', error);
      }
    }

    if (monitoringPaused) {
      console.log('📩 Push suppressed while monitoring is paused:', type);
      return;
    }
  }

  if (
    [
      NotificationTypesEnum.EmergencyRegularCheck,
      NotificationTypesEnum.EmergencyHealthCheck,
      NotificationTypesEnum.EmergencyAlert,
    ].includes(type)
  ) {
    const user = await AsyncStorageService.getItem(
      AsyncStorageEnum.PersistedUserSettings,
    );
    const userParsed = user && JSON.parse(user);

    if (userParsed?.regularPushNotifications) {
      await updateNotification(
        'Emergency triggered remotely',
        'Click to cancel it',
      );
    }

    await AsyncStorageService.setItem(
      AsyncStorageEnum.IsEmergencyEscalationStarted,
      'true',
    );
  }

  switch (type) {
    case NotificationTypesEnum.EmergencyAlert:
      await AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'true');
      handleForegroundState(false);
      await soundNotification();
      if (isIOS) {
        Vibration.vibrate([1300, 2000], true);
      }
      await updateLocation();
      updateNotification(title, body, type);
      break;

    case NotificationTypesEnum.EmergencyHealthCheck:
      await AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'true');
      handleForegroundState(false);
      break;

    case NotificationTypesEnum.EmergencyRegularCheck:
      await AsyncStorageService.setItem(AsyncStorageEnum.TimeTrigger, 'true');
      handleForegroundState(true);
      break;

    case NotificationTypesEnum.TimeSlotNotification:
      // ToastService.success(`${title}\n${body}`, { visibilityTime: 5000 });
      break;

    default:
      console.log(
        '📩 Notification Listener: unhandled notification type',
        type,
      );
  }
};
