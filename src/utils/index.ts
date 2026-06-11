import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import i18n from '~/i18n/i18n';
import ToastService from '~/services/Toast.service';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const updateDataCollectionStatus = () => {
  if (!isAndroid && NativeModules.NativeManager?.updateDataCollectionStatus) {
    NativeModules.NativeManager?.updateDataCollectionStatus();
  } else {
    console.log('no native module ');
  }
};

export const requestLatestHealthData = async (): Promise<boolean> => {
  if (!isAndroid && NativeModules.NativeManager?.requestLatestHealthData) {
    const result = await NativeModules.NativeManager.requestLatestHealthData();
    return result !== false;
  } else {
    updateDataCollectionStatus();
    return true;
  }
};

export type RecentMovementData = {
  steps: number;
  hasRecentMovement: boolean;
  source: 'healthkit' | 'pedometer' | 'unavailable';
  lookbackMinutes: number;
  startDate: number;
  endDate: number;
};

export const queryRecentMovement = async (
  lookbackMinutes = 10,
): Promise<RecentMovementData | null> => {
  if (!isIOS || !NativeModules.NativeManager?.queryRecentMovement) {
    return null;
  }

  return NativeModules.NativeManager.queryRecentMovement(lookbackMinutes);
};

export const openSettings = () => {
  Linking.openSettings().catch(() => {
    ToastService.error(i18n.t('location.unableToOpenSettings'));
  });
};

export const getHealthDataEmitter = () => {
  if (isIOS) {
    return new NativeEventEmitter(NativeModules.NativeManagerEmitter);
  } else {
    console.warn('Health data emitter is only available on iOS');
    return null;
  }
};

export const getVisibleFormError = ({
  error,
  submitCount,
  touched,
  value,
}: {
  error?: string;
  submitCount: number;
  touched?: boolean;
  value?: string;
}) => {
  if (!error) {
    return undefined;
  }
  if (submitCount > 0) {
    return error;
  }
  if (touched && typeof value === 'string' && value.trim().length > 0) {
    return error;
  }
  return undefined;
};
