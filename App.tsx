import React, {useEffect} from 'react';
import {
  LogBox,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  Text,
  Alert,
  Platform,
} from 'react-native';
import {StatusBar} from 'native-base';
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import NavigationContainer from '~/navigators';
import Providers from '~/providers/Providers';
import SplashScreen from 'react-native-splash-screen';
import SoundService from '~/services/Alert.service';

import {awsInit} from '~/services/Amazon.service';
import {getUserPersistedSettings} from '~/services/AsyncStorage.service/helpers';
import {updateNotification} from '~/services/Background.service';
import '~/i18n/i18n';
import crashlytics from '@react-native-firebase/crashlytics';
import EnvService from '~/services/Env.service';
import EnvConfig from '~/services/Env.service';
import {isAndroid, isIOS} from '~/utils';
isAndroid && SoundService.setCategory('Playback');

awsInit();

export const checkValueExplicitly = async () => {
  if (EnvConfig.PROD || isIOS) {
    return null;
  }
  const {positiveInfoPeriod} = await getUserPersistedSettings();
  if (!positiveInfoPeriod) {
    return Alert.alert(
      'No setting for checking intervals',
      'Please enable automated emergency with time range',
    );
  }
  const authResult = await GoogleFit.authorize({
    scopes: [Scopes.FITNESS_HEART_RATE_READ, Scopes.FITNESS_HEART_RATE_WRITE],
  });
  if (authResult.success) {
    const samples = await GoogleFit.getHeartRateSamples({
      startDate: new Date(
        +new Date() - 1000 * 60 * positiveInfoPeriod,
      ).toISOString(),
      endDate: new Date().toISOString(),
      bucketUnit: 'MINUTE' as BucketUnit,
      bucketInterval: 1,
    });
    if (samples.length) {
      const lastSample = samples[samples.length - 1];
      const lastValue = lastSample.value;
      const timeOfSample = new Date(lastSample.endDate).toUTCString();
      if (lastValue) {
        updateNotification(
          `${new Date().toUTCString()}: PULSE ${lastValue}`,
          `OK@${timeOfSample}`,
        );
        Alert.alert(
          'Current pulse',
          JSON.stringify({
            value: lastValue,
            time: timeOfSample,
            range: positiveInfoPeriod,
          }),
        );
      }
      return {value: lastValue, time: timeOfSample};
    }
    Alert.alert(
      'NO PULSE DATA ',
      `There was no positive data sample for ${positiveInfoPeriod} minutes`,
    );
    return null;
  }
};

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs([
      'NativeBase: The contrast ratio of 1.4001048177026059:1 for gray.800',
      'Setting a timer for a long period of time, i.e. multiple minutes',
      'If you do not provide children, you must specify an aria-label',
      'Using an insecure random number generator',
      'Node of type rule not supported',
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
      {Platform.OS === 'android' && EnvService.DEV && (
        <>
          <TouchableOpacity
            style={[styles.button, styles.right]}
            onPress={() => {
              checkValueExplicitly();
            }}>
            <Text style={styles.font}>PULSE TEST</Text>
          </TouchableOpacity>
        </>
      )}
    </Providers>
  );
};

export default App;

export const styles = StyleSheet.create({
  button: {
    height: 65,
    width: 65,
    borderRadius: 40,
    position: 'absolute',
    top: 125,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    backgroundColor: 'red',
  },
  right: {
    right: 25,
  },
  left: {
    left: 25,
  },
  font: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
  picker: {backgroundColor: 'blue', paddingHorizontal: 30},
});
