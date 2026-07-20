import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {AsyncStorageEnum} from '../AsyncStorage.service/AsyncStorage.types';
import {recentBioDataResult} from '../GoogleFit.service';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockGetUserPersistedSettings = jest.fn();
jest.mock('../AsyncStorage.service/helpers', () => ({
  getUserPersistedSettings: (...args: any[]) =>
    mockGetUserPersistedSettings(...args),
}));

const mockAuthorize = jest.fn();
const mockGetHeartRateSamples = jest.fn();
const mockGetRestingHeartRateSamples = jest.fn();
const mockGetDailyStepCountSamples = jest.fn();

jest.mock('react-native-google-fit', () => ({
  __esModule: true,
  default: {
    authorize: (...args: any[]) => mockAuthorize(...args),
    getHeartRateSamples: (...args: any[]) => mockGetHeartRateSamples(...args),
    getRestingHeartRateSamples: (...args: any[]) =>
      mockGetRestingHeartRateSamples(...args),
    getDailyStepCountSamples: (...args: any[]) =>
      mockGetDailyStepCountSamples(...args),
  },
  BucketUnit: {HOUR: 'HOUR'},
  Scopes: {
    FITNESS_HEART_RATE_READ: 'FITNESS_HEART_RATE_READ',
    FITNESS_ACTIVITY_READ: 'FITNESS_ACTIVITY_READ',
  },
}));

jest.mock('../../redux/store', () => ({
  store: {dispatch: jest.fn()},
}));

jest.mock('../../redux/health/health.slice', () => ({
  setHealthData: jest.fn(data => data),
}));

describe('recentBioDataResult', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockGetUserPersistedSettings.mockResolvedValue({positiveInfoPeriod: 60});
    mockAuthorize.mockResolvedValue({success: true});
    mockGetHeartRateSamples.mockResolvedValue([]);
    mockGetRestingHeartRateSamples.mockResolvedValue([]);
    mockGetDailyStepCountSamples.mockResolvedValue([]);
  });

  it('classifies a missing local grant as unavailable, not empty health data', async () => {
    await expect(recentBioDataResult()).resolves.toEqual({
      status: 'unavailable',
      reason: 'not-authorized',
    });
    expect(mockGetHeartRateSamples).not.toHaveBeenCalled();
  });

  it('classifies native re-authorization failure as unavailable', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.GoogleFitAuthorized,
      JSON.stringify(true),
    );
    mockAuthorize.mockResolvedValue({success: false, message: 'denied'});

    await expect(recentBioDataResult()).resolves.toEqual({
      status: 'unavailable',
      reason: 'native-authorization-failed',
    });
  });

  it('classifies a Google Fit query error as unavailable', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.GoogleFitAuthorized,
      JSON.stringify(true),
    );
    mockGetHeartRateSamples.mockRejectedValue(new Error('Fit unavailable'));

    await expect(recentBioDataResult()).resolves.toEqual({
      status: 'unavailable',
      reason: 'query-failed',
    });
  });

  it('returns a successful all-zero sample only when every query completed', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.GoogleFitAuthorized,
      JSON.stringify(true),
    );

    await expect(recentBioDataResult()).resolves.toEqual({
      status: 'success',
      data: {
        pulseData: {value: 0, time: ''},
        restingPulseData: {value: 0, time: ''},
        movementData: {value: 0, time: ''},
      },
    });
  });
});
