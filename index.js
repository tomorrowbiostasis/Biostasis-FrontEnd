import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import messaging from '@react-native-firebase/messaging';
import {AppRegistry, BackHandler} from 'react-native';
import {isIOS} from '~/utils';
import App from './App';
import BackgroundFetch from 'react-native-background-fetch';
import {mainScheduledEvent} from '~/services/Background.service';
import {handleRemoteMessages} from '~/services/Push.service';
import {startLogger} from '~/services/Logger.service';
import { enableScreens } from 'react-native-screens';
import {name as appName} from './app.json';

if (typeof global.setImmediate !== 'function') {
  global.setImmediate = callback => setTimeout(callback, 0);
}

if (typeof global.clearImmediate !== 'function') {
  global.clearImmediate = timeoutId => clearTimeout(timeoutId);
}

if (typeof BackHandler.removeEventListener !== 'function') {
  const originalAddEventListener =
    BackHandler.addEventListener.bind(BackHandler);
  const backHandlerSubscriptions = new Map();

  BackHandler.addEventListener = (eventName, handler) => {
    const subscription = originalAddEventListener(eventName, handler);
    const eventSubscriptions =
      backHandlerSubscriptions.get(eventName) ?? new Map();

    eventSubscriptions.set(handler, subscription);
    backHandlerSubscriptions.set(eventName, eventSubscriptions);

    return subscription;
  };

  BackHandler.removeEventListener = (eventName, handler) => {
    const eventSubscriptions = backHandlerSubscriptions.get(eventName);
    const subscription = eventSubscriptions?.get(handler);

    subscription?.remove();
    eventSubscriptions?.delete(handler);
  };
}

enableScreens(true);
startLogger();

if (!isIOS) {
  BackgroundFetch.registerHeadlessTask(mainScheduledEvent);
}

messaging().setBackgroundMessageHandler(handleRemoteMessages);

AppRegistry.registerComponent(appName, () => App);
