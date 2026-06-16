import {NativeModules, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import {SleepSchedule, getSleepSchedule} from './SleepSchedule.service';

export interface SmartDetectionSettings {
  enabled: boolean;
  useFocusDetection: boolean;
  useChargingDetection: boolean;
  useHealthDataRecency: boolean;
  healthDataStaleThresholdMs: number;
  nighttimeStartHour: number;
  nighttimeStartMinute: number;
  nighttimeEndHour: number;
  nighttimeEndMinute: number;
}

export interface DeviceSignals {
  isFocusActive: boolean;
  isCharging: boolean;
  isHealthDataStale: boolean;
  lastHealthDataAgeMs: number | null;
  isInTravelGracePeriod: boolean;
}

const TRAVEL_GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours
const TIMEZONE_SHIFT_THRESHOLD_MINUTES = 60;

const DEFAULT_STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

const DEFAULT_SETTINGS: SmartDetectionSettings = {
  enabled: true,
  useFocusDetection: true,
  useChargingDetection: true,
  useHealthDataRecency: true,
  healthDataStaleThresholdMs: DEFAULT_STALE_THRESHOLD_MS,
  nighttimeStartHour: 22,
  nighttimeStartMinute: 0,
  nighttimeEndHour: 8,
  nighttimeEndMinute: 0,
};

export const getSmartDetectionSettings =
  async (): Promise<SmartDetectionSettings> => {
    try {
      const raw = await AsyncStorageService.getItem(
        AsyncStorageEnum.SmartDetectionSettings,
      );
      if (raw) {
        return {...DEFAULT_SETTINGS, ...JSON.parse(raw)};
      }
    } catch (e) {
      console.log('Error reading smart detection settings', e);
    }
    return DEFAULT_SETTINGS;
  };

export const saveSmartDetectionSettings = async (
  settings: SmartDetectionSettings,
): Promise<void> => {
  await AsyncStorageService.setItem(
    AsyncStorageEnum.SmartDetectionSettings,
    JSON.stringify(settings),
  );
};

async function queryFocusOrDnd(): Promise<boolean> {
  try {
    if (Platform.OS === 'ios') {
      if (NativeModules.DeviceSignalsManager?.isFocusActive) {
        return await NativeModules.DeviceSignalsManager.isFocusActive();
      }
    } else if (Platform.OS === 'android') {
      if (NativeModules.DeviceSignalsModule?.isDndActive) {
        return await NativeModules.DeviceSignalsModule.isDndActive();
      }
    }
  } catch (e) {
    console.log('Error querying focus/DND status', e);
  }
  return false;
}

async function queryChargingState(): Promise<boolean> {
  try {
    return await DeviceInfo.isBatteryCharging();
  } catch (e) {
    console.log('Error querying charging state', e);
    return false;
  }
}

async function queryHealthDataAge(): Promise<number | null> {
  try {
    const raw = await AsyncStorageService.getItem(
      AsyncStorageEnum.LastUpdatedDate,
    );
    if (raw) {
      const lastUpdated = parseInt(raw, 10);
      if (!isNaN(lastUpdated) && lastUpdated > 0) {
        return Date.now() - lastUpdated;
      }
    }
  } catch (e) {
    console.log('Error reading health data recency', e);
  }
  return null;
}

export const isAirplaneModeOn = async (): Promise<boolean> => {
  try {
    return await DeviceInfo.isAirplaneMode();
  } catch (e) {
    console.log('Error querying airplane mode', e);
    return false;
  }
};

const GOOGLE_FIT_PACKAGE = 'com.google.android.apps.fitness';
const GOOGLE_PLAY_SERVICES_PACKAGE = 'com.google.android.gms';

export type GoogleFitAvailability =
  | 'available'
  | 'googleFitMissing'
  | 'googlePlayServicesMissing'
  | 'unknown';

export const isAndroidPackageInstalled = async (
  packageName: string,
): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    if (NativeModules.DeviceSignalsModule?.isPackageInstalled) {
      return await NativeModules.DeviceSignalsModule.isPackageInstalled(
        packageName,
      );
    }
  } catch (e) {
    console.log('Error checking Android package installation', e);
  }

  return false;
};

export const getGoogleFitAvailability =
  async (): Promise<GoogleFitAvailability> => {
    if (Platform.OS !== 'android') {
      return 'available';
    }

    if (!NativeModules.DeviceSignalsModule?.isPackageInstalled) {
      return 'unknown';
    }

    const [hasGoogleFit, hasGooglePlayServices] = await Promise.all([
      isAndroidPackageInstalled(GOOGLE_FIT_PACKAGE),
      isAndroidPackageInstalled(GOOGLE_PLAY_SERVICES_PACKAGE),
    ]);

    if (!hasGooglePlayServices) {
      return 'googlePlayServicesMissing';
    }

    if (!hasGoogleFit) {
      return 'googleFitMissing';
    }

    return 'available';
  };

export const openAndroidAppSettings = async (
  packageName: string,
): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    if (NativeModules.DeviceSignalsModule?.openAppSettings) {
      return await NativeModules.DeviceSignalsModule.openAppSettings(
        packageName,
      );
    }
  } catch (e) {
    console.log('Error opening Android app settings', e);
  }

  return false;
};

export const openAndroidApp = async (packageName: string): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    if (NativeModules.DeviceSignalsModule?.openApp) {
      return await NativeModules.DeviceSignalsModule.openApp(packageName);
    }
  } catch (e) {
    console.log('Error opening Android app', e);
  }

  return false;
};

export const openGoogleFit = async (): Promise<boolean> =>
  openAndroidApp(GOOGLE_FIT_PACKAGE);

export const openGoogleFitSettings = async (): Promise<boolean> =>
  openAndroidAppSettings(GOOGLE_FIT_PACKAGE);

export const openGooglePlayServicesSettings = async (): Promise<boolean> =>
  openAndroidAppSettings(GOOGLE_PLAY_SERVICES_PACKAGE);

/**
 * Silently detect timezone shifts. Stores a baseline offset and compares
 * on each call. If the offset changes by ≥60 minutes, records a travel
 * detection timestamp. The grace period lasts 24 hours.
 */
async function queryTravelGracePeriod(): Promise<boolean> {
  try {
    const currentOffset = new Date().getTimezoneOffset();
    const storedBaseline = await AsyncStorageService.getItem(
      AsyncStorageEnum.TimezoneBaseline,
    );

    if (storedBaseline === null) {
      await AsyncStorageService.setItem(
        AsyncStorageEnum.TimezoneBaseline,
        String(currentOffset),
      );
      return false;
    }

    const baselineOffset = parseInt(storedBaseline, 10);
    const shift = Math.abs(currentOffset - baselineOffset);

    if (shift >= TIMEZONE_SHIFT_THRESHOLD_MINUTES) {
      const existingDetection = await AsyncStorageService.getItem(
        AsyncStorageEnum.TravelDetectedAt,
      );

      if (existingDetection) {
        const detectedAt = parseInt(existingDetection, 10);
        const elapsed = Date.now() - detectedAt;

        if (elapsed < TRAVEL_GRACE_PERIOD_MS) {
          return true;
        }
        // Grace period expired — update baseline to new timezone
        await AsyncStorageService.setItem(
          AsyncStorageEnum.TimezoneBaseline,
          String(currentOffset),
        );
        await AsyncStorageService.removeItem(
          AsyncStorageEnum.TravelDetectedAt,
        );
        return false;
      }

      // First detection of this timezone shift
      await AsyncStorageService.setItem(
        AsyncStorageEnum.TravelDetectedAt,
        String(Date.now()),
      );
      return true;
    }

    // No significant shift — clear any stale travel detection
    const staleDetection = await AsyncStorageService.getItem(
      AsyncStorageEnum.TravelDetectedAt,
    );
    if (staleDetection) {
      await AsyncStorageService.removeItem(AsyncStorageEnum.TravelDetectedAt);
      await AsyncStorageService.setItem(
        AsyncStorageEnum.TimezoneBaseline,
        String(currentOffset),
      );
    }

    return false;
  } catch (e) {
    console.log('Error querying travel grace period', e);
    return false;
  }
}

export const getDeviceSignals = async (
  settings?: SmartDetectionSettings,
): Promise<DeviceSignals> => {
  const s = settings ?? (await getSmartDetectionSettings());

  const [isFocusActive, isCharging, healthDataAgeMs, isInTravelGracePeriod] =
    await Promise.all([
      s.useFocusDetection ? queryFocusOrDnd() : Promise.resolve(false),
      s.useChargingDetection ? queryChargingState() : Promise.resolve(false),
      s.useHealthDataRecency ? queryHealthDataAge() : Promise.resolve(null),
      queryTravelGracePeriod(),
    ]);

  const isHealthDataStale =
    healthDataAgeMs !== null && healthDataAgeMs > s.healthDataStaleThresholdMs;

  return {
    isFocusActive,
    isCharging,
    isHealthDataStale,
    lastHealthDataAgeMs: healthDataAgeMs,
    isInTravelGracePeriod,
  };
};

/**
 * Check if current time falls within a nighttime window.
 * Uses the user's sleep schedule (with 1h buffer) if available,
 * otherwise falls back to the smart detection nighttime settings.
 */
export const isInNighttimeWindow = (
  schedule: SleepSchedule | null,
  settings: SmartDetectionSettings,
  now?: Date,
): boolean => {
  const current = now ?? new Date();
  const currentMinutes = current.getHours() * 60 + current.getMinutes();

  let startMinutes: number;
  let endMinutes: number;

  if (schedule && schedule.enabled) {
    // Use schedule with 1-hour buffer on each side
    startMinutes = schedule.bedtimeHour * 60 + schedule.bedtimeMinute - 60;
    endMinutes = schedule.wakeHour * 60 + schedule.wakeMinute + 60;
    if (startMinutes < 0) {
      startMinutes += 1440;
    }
    if (endMinutes >= 1440) {
      endMinutes -= 1440;
    }
  } else {
    startMinutes = settings.nighttimeStartHour * 60 + settings.nighttimeStartMinute;
    endMinutes = settings.nighttimeEndHour * 60 + settings.nighttimeEndMinute;
  }

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  // Crosses midnight
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
};

/**
 * Evaluate smart detection signals and determine if the system
 * should be paused. Called from isSleepPaused() as a fallback
 * after schedule-based checks.
 */
export const shouldSmartDetectionPause = async (): Promise<boolean> => {
  const settings = await getSmartDetectionSettings();

  const signals = await getDeviceSignals(settings);
  const schedule = await getSleepSchedule();

  const nighttime =
    signals.isInTravelGracePeriod || isInNighttimeWindow(schedule, settings);

  if (signals.isInTravelGracePeriod) {
    console.log(
      '-> Smart detection: travel grace period active (24h expanded nighttime)',
    );
  }

  // Focus/DND only pauses during nighttime or travel grace to prevent
  // indefinite daytime pausing (e.g. work Focus modes)
  if (
    settings.useFocusDetection &&
    signals.isFocusActive &&
    nighttime
  ) {
    console.log('-> Smart detection: PAUSE (Focus/DND active + nighttime)');
    return true;
  }

  // Charging during nighttime hours (or travel grace period)
  if (settings.useChargingDetection && signals.isCharging && nighttime) {
    console.log('-> Smart detection: PAUSE (charging + nighttime/travel)');
    return true;
  }

  // Stale health data requires a corroborating nighttime signal
  if (settings.useHealthDataRecency && signals.isHealthDataStale) {
    if (nighttime) {
      console.log(
        '-> Smart detection: PAUSE (stale health data + nighttime/travel)',
      );
      return true;
    }
  }

  return false;
};
