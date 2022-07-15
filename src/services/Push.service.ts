import {Alert} from 'react-native';
import {
  Notification,
  Notifications,
  Registered,
  RegistrationError,
} from 'react-native-notifications';
import i18n from '~/i18n/i18n';
import API from '~/services/API.service';
import {NotificationTypesEnum} from '~/services/Background.types';
import EnvConfig from '~/services/Env.service';
import {isAndroid, isIOS, openSettings} from '~/utils';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import messaging from '@react-native-firebase/messaging';

let initialized = false;

export const listenForPushTokenAndUpdate = () => {
  if (!initialized) {
    Notifications.events().registerRemoteNotificationsRegistered(
      async (event: Registered) => {
        const currentSavedToken = await AsyncStorageService.getItem(
          AsyncStorageEnum.LastSavedPushToken,
        );
        const fcmToken = await messaging().getToken();
        console.log('+=========>>> UPDATED FCM ', fcmToken);
        if (`${currentSavedToken}` !== event.deviceToken) {
          let updatedToken = event.deviceToken;

          if (isIOS) {
            updatedToken = await messaging().getToken();
          }
          console.log('FCMTOKEN', updatedToken);

          API.updateUserToken(updatedToken)
            .then(() => {
              console.log('successfully updated push token in api');

              AsyncStorageService.setItem(
                AsyncStorageEnum.LastSavedPushToken,
                event.deviceToken,
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
      },
    );

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event: RegistrationError) => {
        console.warn('error while getting push token', event);
      },
    );

    initialized = true;
  }
};

export const checkPushPermissionsIOS = async () => {
  if (isAndroid) {
    return true;
  }
  try {
    const status = await Notifications.ios.checkPermissions();
    if (!status.notificationCenter) {
      Alert.alert(i18n.t('notifications.permissionsError'), '', [
        {
          text: i18n.t('location.goToSettings'),
          onPress: () => {
            openSettings();
          },
        },
        {text: i18n.t('common.cancel'), onPress: () => {}},
      ]);
    }
  } catch (error) {
    console.log(error);
  }
};

export const invokeGetToken = async () => {
  // Request permissions on iOS, refresh token on Android
  Notifications.registerRemoteNotifications();
};

//TODO check if we need those id's for all types , maybe we can merge some together with handlers
/*
 we can use ids for clearing notification from Notification Center
 */
const localNotificationsIDs = {
  [NotificationTypesEnum.EmergencyAreYouOk]: {
    id: 987654321,
  },
  [NotificationTypesEnum.EmergencyOffline]: {
    id: 987654322,
  },
  [NotificationTypesEnum.EmergencyRegularCheck]: {
    id: 987654323,
  },
  [NotificationTypesEnum.EmergencyAlert]: {
    id: 654456987,
  },
};

type NotificationPayload = {
  type: Exclude<
    NotificationTypesEnum,
    NotificationTypesEnum.TimeSlotNotification
  >;
  body: string;
  title: string;
  additionalPayload?: Record<string, unknown>;
};

export const pushLocalNotification = ({
  type,
  title,
  body,
  ...rest
}: NotificationPayload) => {
  const values = localNotificationsIDs[type];
  Notifications.postLocalNotification(
    {
      title: EnvConfig.DEV
        ? `[DEBUG] ${title} ${new Date().toLocaleTimeString()}`
        : title,
      body,
      payload: {
        type: type,
        ...rest,
      },
    } as Notification,
    values.id,
  );
};
