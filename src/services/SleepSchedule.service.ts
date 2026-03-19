import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import {shouldSmartDetectionPause} from './DeviceSignals.service';

export interface SleepSchedule {
  enabled: boolean;
  bedtimeHour: number;
  bedtimeMinute: number;
  wakeHour: number;
  wakeMinute: number;
}

const SLEEP_SCHEDULE_KEY = AsyncStorageEnum.SleepSchedule;

const DEFAULT_SCHEDULE: SleepSchedule = {
  enabled: false,
  bedtimeHour: 22,
  bedtimeMinute: 0,
  wakeHour: 7,
  wakeMinute: 0,
};

export const getSleepSchedule = async (): Promise<SleepSchedule> => {
  try {
    const raw = await AsyncStorageService.getItem(SLEEP_SCHEDULE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.log('Error reading sleep schedule', e);
  }
  return DEFAULT_SCHEDULE;
};

export const saveSleepSchedule = async (
  schedule: SleepSchedule,
): Promise<void> => {
  await AsyncStorageService.setItem(
    SLEEP_SCHEDULE_KEY,
    JSON.stringify(schedule),
  );
};

/**
 * Check if the system should be paused due to sleep.
 * Returns true if:
 *  1. A sleep schedule is enabled and current time falls within the window, OR
 *  2. Smart detection signals indicate the user is likely sleeping
 *     (Focus/DND active, charging at night, stale health data + corroborating signal)
 */
export const isSleepPaused = async (): Promise<boolean> => {
  const schedule = await getSleepSchedule();
  if (schedule.enabled && isWithinSleepWindow(schedule)) {
    return true;
  }

  return shouldSmartDetectionPause();
};

export const isWithinSleepWindow = (schedule: SleepSchedule): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const bedtimeMinutes = schedule.bedtimeHour * 60 + schedule.bedtimeMinute;
  const wakeMinutes = schedule.wakeHour * 60 + schedule.wakeMinute;

  if (bedtimeMinutes < wakeMinutes) {
    return currentMinutes >= bedtimeMinutes && currentMinutes < wakeMinutes;
  }
  // Crosses midnight (e.g. 22:00 - 07:00)
  return currentMinutes >= bedtimeMinutes || currentMinutes < wakeMinutes;
};

export const formatTime = (hour: number, minute: number): string => {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
};
