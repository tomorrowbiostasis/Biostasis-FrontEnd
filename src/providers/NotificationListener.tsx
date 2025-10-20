import {useCallback, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {handleNotificationEvents} from '~/services/Notification.service';
import notifee from '@notifee/react-native';
import {handleRemoteMessages} from '~/services/Push.service';
import { NativeModules } from 'react-native';
/*  Remote Notification  */

const NotificationListener = () => {
  const handlePushMessages = useCallback(async message => {
    // console.log("IT GOES HERE", NativeModules.NativeManager);
    // console.log("IT GOES HERE SECOND TIME", NativeModules.NativeManager.handleSilentPushNotificationWithCompletion);
    // console.log("IT GOES HERE THIRD TIME", NativeModules.NativeManager.handleSilentPushNotificationWithCompletion);
    // console.log("IT GOES HERE FORTH TIME", NativeModules.NativeManager.handleSilentPushNotificationWithCompletion);
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
