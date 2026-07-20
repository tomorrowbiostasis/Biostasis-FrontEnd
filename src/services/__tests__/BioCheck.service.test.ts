import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {AsyncStorageEnum} from '../AsyncStorage.service/AsyncStorage.types';
import {
  checkForBioData,
  handleBioData,
  handlePositiveData,
} from '../BioCheck.service';
import {IBioData} from '../GoogleFit.types';
import {IHealthData} from '../BioCheck.types';
import {NotificationTypesEnum} from '../../constants/notification.constants';

// ── Mocks ────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@notifee/react-native', () => ({
  AndroidChannel: {},
  AndroidChannelGroup: {},
  AndroidColor: {},
  AndroidImportance: {HIGH: 4, DEFAULT: 3},
  AndroidStyle: {BIGTEXT: 0},
  default: {
    createChannel: jest.fn(),
    createChannelGroup: jest.fn(),
    displayNotification: jest.fn(),
    cancelAllNotifications: jest.fn(),
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
  },
}));

jest.mock('react-native-device-info', () => ({
  isBatteryCharging: jest.fn().mockResolvedValue(false),
  isAirplaneMode: jest.fn().mockResolvedValue(false),
}));

jest.mock('react-native-google-fit', () => ({
  __esModule: true,
  default: {
    authorize: jest.fn(),
    getHeartRateSamples: jest.fn(),
    getDailyStepCountSamples: jest.fn(),
  },
  BucketUnit: {HOUR: 'HOUR'},
  Scopes: {FITNESS_ACTIVITY_READ: 'FITNESS_ACTIVITY_READ'},
}));

const mockRecentBioDataResult = jest.fn();
jest.mock('../GoogleFit.service', () => ({
  recentBioDataResult: (...args: any[]) => mockRecentBioDataResult(...args),
}));

jest.mock('react-native-device-time-format', () => ({
  is24HourFormat: jest.fn().mockResolvedValue(false),
}));

const mockUpdateNotification = jest.fn().mockResolvedValue(undefined);
const mockCreateNotificationChannels = jest.fn();
jest.mock('../Notification.service', () => ({
  updateNotification: (...args: any[]) => mockUpdateNotification(...args),
  createNotificationChannels: () => mockCreateNotificationChannels(),
}));

const mockPositiveInfo = jest.fn().mockResolvedValue({
  status: 201,
  data: {success: true},
});
jest.mock('../API.service', () => ({
  __esModule: true,
  default: {
    positiveInfo: (...args: any[]) => mockPositiveInfo(...args),
  },
}));

const mockNavigate = jest.fn();
jest.mock('../../navigators', () => ({
  navigate: (...args: any[]) => mockNavigate(...args),
}));

jest.mock('../../models/Navigation.model', () => ({
  Screens: {
    HealthConditionError: 'HealthConditionError',
    LostConnection: 'LostConnection',
  },
}));

jest.mock('../Recommendation.service', () => ({
  recommendationSystem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../Background.service', () => ({
  stopBackgroundFetch: jest.fn().mockResolvedValue(undefined),
  updateLocation: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../i18n/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => key,
  },
}));

// AppState.currentState is set to 'active' in beforeEach below
// so the navigate() call in the escalation path is exercised.

jest.mock('../AsyncStorage.service/helpers', () => ({
  getUserPersistedSettings: jest.fn().mockResolvedValue({
    automatedEmergency: true,
    allowNotifications: true,
    positiveInfoPeriod: 90,
  }),
}));

// ── Helpers ──────────────────────────────────────────────

const hd = (value: number, time?: string): IHealthData => ({
  value,
  time: time ?? new Date().toISOString(),
});

const bioData = (
  pulse: number,
  restingPulse: number,
  movement: number,
): IBioData => ({
  pulseData: hd(pulse),
  restingPulseData: hd(restingPulse),
  movementData: hd(movement),
});

// ── Setup ────────────────────────────────────────────────

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
  (AppState as any).currentState = 'active';
  mockRecentBioDataResult.mockResolvedValue({
    status: 'success',
    data: bioData(72, 60, 200),
  });
});

// ─────────────────────────────────────────────────────────
// handleBioData — the "alive" OR condition
// ─────────────────────────────────────────────────────────

describe('handleBioData — alive signal detection (OR logic)', () => {
  it('steps only (no heart rate) → user is alive', async () => {
    const data = bioData(0, 0, 150);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).toBe('false');
  });

  it('heart rate only (no steps) → user is alive', async () => {
    const data = bioData(72, 0, 0);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('resting heart rate only → user is alive', async () => {
    const data = bioData(0, 60, 0);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('all three present → user is alive', async () => {
    const data = bioData(72, 60, 200);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('steps at wake-up with stale HR → user is alive (phone pedometer)', async () => {
    const data = bioData(0, 0, 42);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
  });
});

// ─────────────────────────────────────────────────────────
// Two-strike warning system
// ─────────────────────────────────────────────────────────

describe('handleBioData — two-strike warning system', () => {
  it('first no-data event → sends warning notification, does NOT escalate', async () => {
    const data = bioData(0, 0, 0);
    await handleBioData(data);

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('1');

    expect(mockNavigate).not.toHaveBeenCalled();
    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).not.toBe('true');
  });

  it('second consecutive no-data event → escalates to emergency', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');

    const data = bioData(0, 0, 0);
    await handleBioData(data);

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.automatedEmergency',
      'bioCheck.messages.noData',
      NotificationTypesEnum.NoDataFound,
    );
    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).toBe('true');
    expect(mockNavigate).toHaveBeenCalled();

    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
  });

  it('sets a pending trigger but does not navigate while app is backgrounded', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');
    (AppState as any).currentState = 'background';

    await handleBioData(bioData(0, 0, 0));

    expect(await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger)).toBe(
      'true',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('positive data after first strike → resets counter, no escalation', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');

    const data = bioData(0, 0, 80);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('full cycle: no-data → warning → positive → reset → no-data → warning again', async () => {
    // Strike 1
    await handleBioData(bioData(0, 0, 0));
    let count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('1');
    expect(mockNavigate).not.toHaveBeenCalled();

    // Positive data arrives — reset
    jest.clearAllMocks();
    await handleBioData(bioData(0, 0, 50));
    count = await AsyncStorage.getItem(AsyncStorageEnum.ConsecutiveNoDataCount);
    expect(count).toBe('0');

    // Strike 1 again (not strike 2 — counter was reset)
    jest.clearAllMocks();
    await handleBioData(bioData(0, 0, 0));
    count = await AsyncStorage.getItem(AsyncStorageEnum.ConsecutiveNoDataCount);
    expect(count).toBe('1');
    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('two consecutive no-data → escalation → then positive resets for next cycle', async () => {
    // Strike 1
    await handleBioData(bioData(0, 0, 0));
    expect(mockNavigate).not.toHaveBeenCalled();

    // Strike 2 — escalation
    jest.clearAllMocks();
    await handleBioData(bioData(0, 0, 0));
    expect(mockNavigate).toHaveBeenCalled();
    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).toBe('true');

    // Positive data arrives
    jest.clearAllMocks();
    await handleBioData(bioData(72, 60, 100));
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
    const triggerAfter = await AsyncStorage.getItem(
      AsyncStorageEnum.HealthTrigger,
    );
    expect(triggerAfter).toBe('false');
  });
});

describe('checkForBioData — unavailable health integration', () => {
  it('does not turn a Google Fit/auth failure into a no-data strike', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');
    mockRecentBioDataResult.mockResolvedValue({
      status: 'unavailable',
      reason: 'native-authorization-failed',
    });

    await checkForBioData();

    expect(
      await AsyncStorage.getItem(AsyncStorageEnum.ConsecutiveNoDataCount),
    ).toBe('0');
    expect(await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger)).not.toBe(
      'true',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────
// handlePositiveData — counter reset
// ─────────────────────────────────────────────────────────

describe('handlePositiveData — resets ConsecutiveNoDataCount', () => {
  it('resets counter to 0 even when it was at 1', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');

    await handlePositiveData(hd(72), hd(60), hd(200));

    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
  });

  it('resets counter to 0 from fresh state (null)', async () => {
    await handlePositiveData(hd(72), hd(60), hd(200));

    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
  });

  it('calls API.positiveInfo on positive data', async () => {
    await handlePositiveData(hd(72), hd(60), hd(200));
    expect(mockPositiveInfo).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────
// Real-world scenario: morning wakeup without wearable sync
// ─────────────────────────────────────────────────────────

describe('Real-world: morning wakeup scenario', () => {
  it('user wakes and walks (steps only) — stays alive even without Oura sync', async () => {
    const data = bioData(0, 0, 35);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).toBe('false');
  });

  it('user wakes but phone still on nightstand (no data at all) → warning, not emergency', async () => {
    const data = bioData(0, 0, 0);
    await handleBioData(data);

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('user ignores warning, still no data → emergency triggered', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');

    const data = bioData(0, 0, 0);
    await handleBioData(data);

    const trigger = await AsyncStorage.getItem(AsyncStorageEnum.HealthTrigger);
    expect(trigger).toBe('true');
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('user opens Oura after warning, HR syncs → system happy, counter reset', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '1');

    const data = bioData(68, 55, 0);
    await handleBioData(data);

    expect(mockPositiveInfo).toHaveBeenCalled();
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('0');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────
// NaN guard for ConsecutiveNoDataCount
// ─────────────────────────────────────────────────────────

describe('handleBioData — NaN guard on ConsecutiveNoDataCount', () => {
  it('corrupted counter value (NaN string) → treated as 0, sends warning', async () => {
    await AsyncStorage.setItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
      'not-a-number',
    );

    await handleBioData(bioData(0, 0, 0));

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    const count = await AsyncStorage.getItem(
      AsyncStorageEnum.ConsecutiveNoDataCount,
    );
    expect(count).toBe('1');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('negative counter value → treated as 0, sends warning', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '-5');

    await handleBioData(bioData(0, 0, 0));

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('empty string counter → treated as 0, sends warning', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ConsecutiveNoDataCount, '');

    await handleBioData(bioData(0, 0, 0));

    expect(mockUpdateNotification).toHaveBeenCalledWith(
      'bioCheck.messages.wearableSyncWarning',
      'bioCheck.messages.wearableSyncWarningBody',
      NotificationTypesEnum.WearableSyncWarning,
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────
// handleDisconnection — AppState guard
// ─────────────────────────────────────────────────────────

describe('handleDisconnection — AppState guard', () => {
  // Import dynamically to test with different AppState values
  it('navigates to LostConnection when app is active', async () => {
    const {handleDisconnection} = require('../BioCheck.service');
    (AppState as any).currentState = 'active';

    await handleDisconnection();
    expect(mockNavigate).toHaveBeenCalledWith('LostConnection');
  });

  it('does NOT navigate when app is inactive', async () => {
    const {handleDisconnection} = require('../BioCheck.service');
    (AppState as any).currentState = 'inactive';

    await handleDisconnection();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
