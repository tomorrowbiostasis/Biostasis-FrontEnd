import {AsyncStorageService} from './AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.types';

export const getUserPersistedSettings = async () => {
  const data = await AsyncStorageService.getItem(
    AsyncStorageEnum.PersistedUserSettings,
  );
  if (!data) return {};
  try {
    const fullData = JSON.parse(data);
    if (!fullData?.user) return {};
    return JSON.parse(fullData.user);
  } catch (e) {
    console.warn('getUserPersistedSettings: failed to parse data', e);
    return {};
  }
};
