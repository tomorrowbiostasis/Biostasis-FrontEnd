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
      .catch(e => {
        if (!disableLog) {
          console.log(
            `AsyncStorageService: Problem during save key: ${key}, value: ${value}`,
            e,
          );
        }
      }),
  getItem: async (key: AsyncStorageEnum): Promise<string | null> =>
    await AsyncStorage.getItem(key).catch(e => {
      console.log(
        `AsyncStorageService: Problem during getting item key: ${key}`,
        e,
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
