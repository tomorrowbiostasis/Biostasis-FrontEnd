import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {getUserPersistedSettings} from '../AsyncStorage.service/helpers';
import {AsyncStorageEnum} from '../AsyncStorage.service/AsyncStorage.types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(() => {
  AsyncStorage.clear();
});

describe('getUserPersistedSettings', () => {
  it('returns empty object when no data stored', async () => {
    const result = await getUserPersistedSettings();
    expect(result).toEqual({});
  });

  it('returns empty object when stored data is empty string', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.PersistedUserSettings, '');
    const result = await getUserPersistedSettings();
    expect(result).toEqual({});
  });

  it('returns empty object when stored data is invalid JSON', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.PersistedUserSettings,
      'not json at all',
    );
    const result = await getUserPersistedSettings();
    expect(result).toEqual({});
  });

  it('returns empty object when user key is missing', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.PersistedUserSettings,
      JSON.stringify({someOtherKey: 'value'}),
    );
    const result = await getUserPersistedSettings();
    expect(result).toEqual({});
  });

  it('parses valid nested user data correctly', async () => {
    const userData = {
      automatedEmergency: true,
      positiveInfoPeriod: 90,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.PersistedUserSettings,
      JSON.stringify({user: JSON.stringify(userData)}),
    );
    const result = await getUserPersistedSettings();
    expect(result).toEqual(userData);
  });

  it('returns empty object when user key is invalid JSON', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.PersistedUserSettings,
      JSON.stringify({user: 'not valid json'}),
    );
    const result = await getUserPersistedSettings();
    expect(result).toEqual({});
  });
});
