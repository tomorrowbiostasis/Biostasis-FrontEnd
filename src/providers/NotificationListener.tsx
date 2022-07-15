import {useCallback, useEffect} from 'react';
import {
  Notification,
  NotificationCompletion,
  Notifications,
} from 'react-native-notifications';
import {Screens} from '~/models/Navigation.model';
import {navigate} from '~/navigators';
import SoundService from '~/services/Alert.service';
import {NotificationTypesEnum} from '~/services/Background.types';
import NotificationService from '~/services/NotificationService';
import {isIOS} from '~/utils';

const NotificationListener = () => {
  const handleNotificationClick = useCallback((type: NotificationTypesEnum) => {
    switch (type) {
      case NotificationTypesEnum.EmergencyOffline:
        navigate(Screens.LostConnection as never);
        break;
      case NotificationTypesEnum.EmergencyAreYouOk:
      case NotificationTypesEnum.EmergencyAlert:
        console.log('=============>>>> Navigate to alert');
        setTimeout(() => navigate(Screens.HealthConditionError as never), 100);
        break;
      case NotificationTypesEnum.EmergencyRegularCheck:
        // @ts-ignore
        navigate(Screens.HealthConditionError, {regular: true});
        break;
      default:
        console.log('Notification Listener: unhandled notification');
    }
  }, []);
  const foregroundSpecificHandlers = useCallback(
    (notification: Notification) => {
      switch (notification.payload.type) {
        case NotificationTypesEnum.EmergencyAlert:
          SoundService.playAlert();
          break;
        case NotificationTypesEnum.TimeSlotNotification:
          const title =
            notification.payload[isIOS ? 'title' : 'gcm.notification.title'] ||
            '';
          const body =
            notification.payload[isIOS ? 'body' : 'gcm.notification.body'] ||
            '';
          NotificationService.success(`${title}\n${body}`, {
            visibilityTime: 5000,
          });
          break;
        default:
          console.log('Notification Listener: unhandled notification');
      }
    },
    [],
  );

  useEffect(() => {
    console.log('Notification Listener: running');

    Notifications.getInitialNotification().then(notification => {
      if (notification) {
        console.log(
          '===============>>>>>  NOTIFICATIONS LISTENER: getInitialNotification',
          notification,
        );
        handleNotificationClick(
          notification.payload.payload?.type || notification.payload.type,
        );
      } else {
        console.log(
          'Notification Listener: nothing from getInitialNotification',
        );
      }
    });

    Notifications.events().registerNotificationReceivedForeground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void,
      ) => {
        console.log(
          '===============>>>>>  NOTIFICATIONS LISTENER: registerNotificationReceivedForeground',
          notification,
        );
        // Foreground specific actions - move to separate handler
        foregroundSpecificHandlers(notification);
        handleNotificationClick(notification.payload.type);
        completion({alert: true, sound: true, badge: false});
      },
    );

    Notifications.events().registerNotificationReceivedBackground(
      // @ts-ignore
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void,
      ) => {
        console.log(
          '===============>>>>>  NOTIFICATIONS LISTENER: registerNotificationReceivedBackground',
          notification,
        );
        handleNotificationClick(notification.payload.payload?.type);
        completion({alert: true, sound: true, badge: false});
      },
    );

    Notifications.events().registerNotificationOpened(
      (notification: Notification, completion: () => void) => {
        console.log(
          '===============>>>>>  NOTIFICATIONS LISTENER: registerNotificationOpened',
          notification,
        );
        handleNotificationClick(
          notification.payload.payload?.type || notification.payload?.type,
        );
        completion();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default NotificationListener;
