import {AsyncStorageService} from './AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.types';

export const getUserPersistedSettings = async () => {
  const data = await AsyncStorageService.getItem(
    AsyncStorageEnum.PersistedUserSettings,
  );
  const fullData = JSON.parse(data ?? '');
  return JSON.parse(fullData?.user || '{}');
};
