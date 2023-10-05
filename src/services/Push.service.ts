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
let initialized = false;

export const listenForPushTokenAndUpdate = async () => {
  if (!initialized) {
    const currentSavedToken = await AsyncStorageService.getItem(
      AsyncStorageEnum.LastSavedPushToken,
    );
    const fcmToken = await messaging().getToken();
    console.log('+=========>>> Updated FCM ', fcmToken);
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
    } else {
      console.log('User declined notification permissions');
    }
  } catch (error) {
    console.log(error);
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
  notification: any;
}) => {
  const {data, notification} = message;
  const {type} = data;
  const {title, body} = notification;

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
    const userParsed = user && (await JSON.parse(user));
    userParsed.regularPushNotifications &&
      (await updateNotification(
        'Emergency triggered remotely',
        'Click to cancel it',
      ));
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
      // android to show the healthConditionScreen for the app from the lock screen of the mobile
      updateNotification(title, body, type);
      break;
    case NotificationTypesEnum.EmergencyHealthCheck:
      //@ts-ignore
      await AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'true');
      handleForegroundState(false);
      break;
    case NotificationTypesEnum.EmergencyRegularCheck:
      //@ts-ignore
      await AsyncStorageService.setItem(AsyncStorageEnum.TimeTrigger, 'true');
      handleForegroundState(true);
      break;
    case NotificationTypesEnum.TimeSlotNotification:
      // ToastService.success(`${title}\n${body}`, {
      //   visibilityTime: 5000,
      // });
      break;
    default:
      console.log('Notification Listener: unhandled notification');
  }
};
