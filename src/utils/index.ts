import {Alert, Linking, NativeModules, Platform, NativeEventEmitter} from 'react-native';
import i18n from '~/i18n/i18n';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
// export const healthDataEmitter = new NativeEventEmitter(NativeModules.NativeManagerEmitter);


export const updateDataCollectionStatus = () => {
  // console.log("NativeModules.NativeManagerEmitter", NativeModules.NativeManagerEmitter)
  if (!isAndroid && NativeModules.NativeManager?.updateDataCollectionStatus) {
    NativeModules.NativeManager?.updateDataCollectionStatus() 
  } else {
    console.log('no native module ');
  }
}

export const openSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert(i18n.t('location.unableToOpenSettings'));
  });
};

export const getHealthDataEmitter = () => {
  if (isIOS) {
    return new NativeEventEmitter(NativeModules.NativeManagerEmitter);
  } else {
    console.warn('Health data emitter is only available on iOS');
    return null;
  }
}
