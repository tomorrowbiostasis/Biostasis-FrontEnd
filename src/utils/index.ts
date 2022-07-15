import {Alert, Linking, NativeModules, Platform} from 'react-native';
import i18n from '~/i18n/i18n';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const updateDataCollectionStatus = () =>
  (!isAndroid && NativeModules.NativeManager?.updateDataCollectionStatus()) ||
  console.log('no native module ');

export const openSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert(i18n.t('location.unableToOpenSettings'));
  });
};
