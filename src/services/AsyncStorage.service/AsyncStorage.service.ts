import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageEnum} from './AsyncStorage.types';

export const AsyncStorageService = {
  setItem: async (
    key: AsyncStorageEnum | string,
    value: string,
    disableLog?: boolean,
  ): Promise<void> =>
    await AsyncStorage.setItem(key, value)
      .then(() => {
        if (!disableLog) {
          console.log(
            `AsyncStorageService: Item saved key: ${key}, value: ${value}`,
          );
        }
      })
      .catch(() => {
        if (!disableLog) {
          console.log(
            `AsyncStorageService: Problem during save key: ${key}, value: ${value}`,
          );
        }
      }),
  getItem: async (key: AsyncStorageEnum): Promise<string | null> =>
    await AsyncStorage.getItem(key).catch(() => {
      console.log(
        `AsyncStorageService: Problem during getting item key: ${key}`,
      );
      return null;
    }),
  getAllKeys: async (): Promise<readonly string[]> =>
    await AsyncStorage.getAllKeys(),
  multiGet: async (
    keys: readonly string[],
  ): Promise<readonly (string | null)[][]> => await AsyncStorage.multiGet(keys),
  multiRemove: async (keys: string[]): Promise<void> =>
    await AsyncStorage.multiRemove(keys),
};
