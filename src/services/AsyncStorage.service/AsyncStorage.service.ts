import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageEnum} from './AsyncStorage.types';

export const AsyncStorageService = {
  setItem: async (
    key: AsyncStorageEnum | string,
    value: string,
    disableLog?: boolean,
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
      if (!disableLog) {
        console.log(`AsyncStorageService: Item saved key: ${key}`);
      }
    } catch (e) {
      if (!disableLog) {
        console.log(`AsyncStorageService: Problem during save key: ${key}`);
      }
      throw e;
    }
  },
  getItem: async (key: AsyncStorageEnum): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      console.log(
        `AsyncStorageService: Problem during getting item key: ${key}`,
      );
      return null;
    }
  },
  removeItem: async (key: AsyncStorageEnum | string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`AsyncStorageService: Item removed key: ${key}`);
    } catch {
      console.log(
        `AsyncStorageService: Problem during removal key: ${key}`,
      );
    }
  },
  getAllKeys: async (): Promise<readonly string[]> =>
    await AsyncStorage.getAllKeys(),
  multiGet: async (
    keys: readonly string[],
  ): Promise<readonly (string | null)[][]> => await AsyncStorage.multiGet(keys),
  multiRemove: async (keys: string[]): Promise<void> =>
    await AsyncStorage.multiRemove(keys),
};
