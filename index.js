import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import {isIOS} from '~/utils';
import App from './App';
import BackgroundFetch from 'react-native-background-fetch';
import {mainScheduledEvent} from '~/services/Background.service';
import {handleRemoteMessages} from '~/services/Push.service';
import {startLogger} from '~/services/Logger.service';
import {name as appName} from './app.json';

startLogger();

if (!isIOS) {
  BackgroundFetch.registerHeadlessTask(mainScheduledEvent);
  messaging().setBackgroundMessageHandler(handleRemoteMessages);
}

AppRegistry.registerComponent(appName, () => App);
