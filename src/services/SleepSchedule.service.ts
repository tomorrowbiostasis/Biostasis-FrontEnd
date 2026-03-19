import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';

export interface SleepSchedule {
  enabled: boolean;
  bedtimeHour: number;
  bedtimeMinute: number;
  wakeHour: number;
  wakeMinute: number;
}

export interface SleepModeState {
  isAsleep: boolean;
  sleepStartedAt: number | null;
  expectedWakeAt: number | null;
}

const SLEEP_SCHEDULE_KEY = AsyncStorageEnum.SleepSchedule;
const SLEEP_MODE_KEY = AsyncStorageEnum.SleepModeState;

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

export const getSleepModeState = async (): Promise<SleepModeState> => {
  try {
    const raw = await AsyncStorageService.getItem(SLEEP_MODE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.log('Error reading sleep mode state', e);
  }
  return {isAsleep: false, sleepStartedAt: null, expectedWakeAt: null};
};

export const activateSleepMode = async (
  schedule: SleepSchedule,
): Promise<SleepModeState> => {
  const now = new Date();
  const wakeAt = new Date();
  wakeAt.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  if (wakeAt.getTime() <= now.getTime()) {
    wakeAt.setDate(wakeAt.getDate() + 1);
  }

  const state: SleepModeState = {
    isAsleep: true,
    sleepStartedAt: now.getTime(),
    expectedWakeAt: wakeAt.getTime(),
  };

  await AsyncStorageService.setItem(SLEEP_MODE_KEY, JSON.stringify(state));
  return state;
};

export const deactivateSleepMode = async (): Promise<void> => {
  const state: SleepModeState = {
    isAsleep: false,
    sleepStartedAt: null,
    expectedWakeAt: null,
  };
  await AsyncStorageService.setItem(SLEEP_MODE_KEY, JSON.stringify(state));
};

/**
 * Check if the system should be paused due to sleep.
 * Returns true if:
 *  1. Manual sleep mode is active and wake time hasn't passed, OR
 *  2. A sleep schedule is enabled and current time falls within the window
 */
export const isSleepPaused = async (): Promise<boolean> => {
  const manualState = await getSleepModeState();
  if (manualState.isAsleep) {
    if (
      manualState.expectedWakeAt &&
      Date.now() < manualState.expectedWakeAt
    ) {
      return true;
    }
    await deactivateSleepMode();
    return false;
  }

  const schedule = await getSleepSchedule();
  if (!schedule.enabled) {
    return false;
  }

  return isWithinSleepWindow(schedule);
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
