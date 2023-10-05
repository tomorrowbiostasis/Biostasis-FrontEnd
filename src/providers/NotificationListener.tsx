import {useCallback, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {handleNotificationEvents} from '~/services/Notification.service';
import notifee from '@notifee/react-native';
import {handleRemoteMessages} from '~/services/Push.service';
/*  Remote Notification  */

const NotificationListener = () => {
  const handlePushMessages = useCallback(async message => {
    await handleRemoteMessages(message);
  }, []);

  useEffect(() => {
    console.log('Notification Listener: running');
    messaging().onMessage(handlePushMessages);
    messaging().setBackgroundMessageHandler(handlePushMessages);

    const foreground = notifee.onForegroundEvent(handleNotificationEvents);

    return () => {
      // Clean up event listeners when the component unmounts
      foreground();
    };
  }, [handlePushMessages]);
  return null;
};

export default NotificationListener;
