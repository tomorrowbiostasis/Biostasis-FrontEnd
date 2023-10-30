import React, {useEffect} from 'react';
import {LogBox, UIManager} from 'react-native';
import {StatusBar} from 'native-base';
import NavigationContainer from '~/navigators';
import Providers from '~/providers/Providers';
import SplashScreen from 'react-native-splash-screen';
import SoundService from '~/services/Alert.service';

import {awsInit} from '~/services/Amazon.service';
import '~/i18n/i18n';
import crashlytics from '@react-native-firebase/crashlytics';
import {isAndroid} from '~/utils';

isAndroid && SoundService.setCategory('Playback');

awsInit();

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs([
      'NativeBase: The contrast ratio of 1.4001048177026059:1 for gray.800',
      'Setting a timer for a long period of time, i.e. multiple minutes',
      'If you do not provide children, you must specify an aria-label',
      'Using an insecure random number generator',
      'Node of type rule not supported',
      'new NativeEventEmitter()',
    ]);

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    SplashScreen.hide();
  }, []);

  useEffect(() => {
    /* I need explicitly enable  this crashlytics collecting to force iOS collection in debug, still no luck with reporting
      after checking if all is working in debug , we can remove this setter
    */
    (async function () {
      await crashlytics().setCrashlyticsCollectionEnabled(true);
    })();
  }, []);

  return (
    <Providers>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <NavigationContainer />
    </Providers>
  );
};

export default App;
