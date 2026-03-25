import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {AsyncStorageEnum} from '../AsyncStorage.service/AsyncStorage.types';
import {
  SleepSchedule,
  getSleepSchedule,
  saveSleepSchedule,
  isSleepPaused,
  isWithinSleepWindow,
  formatTime,
} from '../SleepSchedule.service';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-device-info', () => ({
  isBatteryCharging: jest.fn().mockResolvedValue(false),
  isAirplaneMode: jest.fn().mockResolvedValue(false),
}));

jest.mock('react-native-device-time-format', () => ({
  is24HourFormat: jest.fn().mockResolvedValue(false),
}));

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  exists: jest.fn(),
  DocumentDirectoryPath: '/mock',
}));

jest.mock('../API.service', () => ({
  __esModule: true,
  default: {
    positiveInfo: jest.fn(),
    getTimeSlot: jest.fn(),
  },
}));

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

beforeEach(() => {
  AsyncStorage.clear();
  jest.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────
// isWithinSleepWindow — pure function, no mocks needed
// NOTE: the sleep window includes a 60-minute post-wake buffer,
// so actual wake boundary = wakeTime + 60min.
// ─────────────────────────────────────────────────────────

describe('isWithinSleepWindow', () => {
  const schedule = (
    bedH: number,
    bedM: number,
    wakeH: number,
    wakeM: number,
  ): SleepSchedule => ({
    enabled: true,
    bedtimeHour: bedH,
    bedtimeMinute: bedM,
    wakeHour: wakeH,
    wakeMinute: wakeM,
  });

  const mockTime = (hour: number, minute: number) => {
    const fakeNow = new Date(2026, 2, 18, hour, minute, 0);
    jest.spyOn(global, 'Date').mockImplementation(
      (...args: any[]) =>
        args.length ? new (jest.requireActual('Date') as any)(...args) : fakeNow,
    );
  };

  afterEach(() => jest.restoreAllMocks());

  describe('crosses midnight (bed 22:00, wake 07:00, buffer → 08:00)', () => {
    const s = schedule(22, 0, 7, 0);

    it('11:00 PM → inside window', () => {
      mockTime(23, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('10:00 PM exactly (bedtime) → inside window', () => {
      mockTime(22, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('midnight → inside window', () => {
      mockTime(0, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('3:30 AM → inside window', () => {
      mockTime(3, 30);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('6:59 AM → inside window (1 min before raw wake)', () => {
      mockTime(6, 59);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:00 AM (raw wake time) → still inside due to 1h buffer', () => {
      mockTime(7, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:30 AM → still inside buffer window', () => {
      mockTime(7, 30);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:59 AM → inside (1 min before buffer end)', () => {
      mockTime(7, 59);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('8:00 AM → outside (buffer ended)', () => {
      mockTime(8, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('8:01 AM → outside', () => {
      mockTime(8, 1);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('2:00 PM → outside window', () => {
      mockTime(14, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('9:59 PM → outside window (1 min before bedtime)', () => {
      mockTime(21, 59);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });

  describe('same day (bed 01:00, wake 06:00, buffer → 07:00)', () => {
    const s = schedule(1, 0, 6, 0);

    it('3:00 AM → inside', () => {
      mockTime(3, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('1:00 AM exactly → inside', () => {
      mockTime(1, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('5:59 AM → inside', () => {
      mockTime(5, 59);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('6:00 AM (raw wake) → inside due to buffer', () => {
      mockTime(6, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('6:59 AM → inside (1 min before buffer end)', () => {
      mockTime(6, 59);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:00 AM → outside (buffer ended)', () => {
      mockTime(7, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('12:00 PM → outside', () => {
      mockTime(12, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('11:00 PM → outside', () => {
      mockTime(23, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });

  describe('edge: bedtime equals wake time (08:00–08:00, buffer → 09:00)', () => {
    const s = schedule(8, 0, 8, 0);

    it('8:00 AM → inside (bedtime==wake, window extends to 09:00)', () => {
      mockTime(8, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });
  });

  describe('edge: very short window (bed 23:55, wake 00:05, buffer → 01:05)', () => {
    const s = schedule(23, 55, 0, 5);

    it('23:57 → inside', () => {
      mockTime(23, 57);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('00:03 → inside', () => {
      mockTime(0, 3);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('00:05 (raw wake) → inside due to buffer', () => {
      mockTime(0, 5);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('01:04 → inside (1 min before buffer end)', () => {
      mockTime(1, 4);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('01:05 → outside (buffer ended)', () => {
      mockTime(1, 5);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('23:54 → outside', () => {
      mockTime(23, 54);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });

  describe('edge: almost full day (bed 00:01, wake 00:00, buffer → 01:00)', () => {
    const s = schedule(0, 1, 0, 0);

    it('00:30 → inside (within buffered window 00:01–01:00)', () => {
      mockTime(0, 30);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('12:00 PM → outside (buffer collapses the nearly-full-day window)', () => {
      mockTime(12, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('00:00 → outside (before bedtime)', () => {
      mockTime(0, 0);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });

  describe('minutes precision (bed 22:30, wake 06:45, buffer → 07:45)', () => {
    const s = schedule(22, 30, 6, 45);

    it('22:29 → outside', () => {
      mockTime(22, 29);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('22:30 → inside', () => {
      mockTime(22, 30);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('6:44 → inside', () => {
      mockTime(6, 44);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('6:45 (raw wake) → inside due to buffer', () => {
      mockTime(6, 45);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:44 → inside (1 min before buffer end)', () => {
      mockTime(7, 44);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('7:45 → outside (buffer ended)', () => {
      mockTime(7, 45);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });

  describe('post-wake buffer wrapping past midnight (bed 20:00, wake 23:30, buffer → 00:30)', () => {
    const s = schedule(20, 0, 23, 30);

    it('23:00 → inside (before raw wake)', () => {
      mockTime(23, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('23:30 (raw wake) → inside due to buffer', () => {
      mockTime(23, 30);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('00:00 midnight → inside (buffer extends past midnight)', () => {
      mockTime(0, 0);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('00:29 → inside (1 min before buffer end)', () => {
      mockTime(0, 29);
      expect(isWithinSleepWindow(s)).toBe(true);
    });

    it('00:30 → outside (buffer ended)', () => {
      mockTime(0, 30);
      expect(isWithinSleepWindow(s)).toBe(false);
    });

    it('19:59 → outside', () => {
      mockTime(19, 59);
      expect(isWithinSleepWindow(s)).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────
// formatTime
// ─────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('12:00 AM (midnight)', () => expect(formatTime(0, 0)).toBe('12:00 AM'));
  it('12:30 AM', () => expect(formatTime(0, 30)).toBe('12:30 AM'));
  it('1:05 AM', () => expect(formatTime(1, 5)).toBe('1:05 AM'));
  it('11:59 AM', () => expect(formatTime(11, 59)).toBe('11:59 AM'));
  it('12:00 PM (noon)', () => expect(formatTime(12, 0)).toBe('12:00 PM'));
  it('1:00 PM', () => expect(formatTime(13, 0)).toBe('1:00 PM'));
  it('11:59 PM', () => expect(formatTime(23, 59)).toBe('11:59 PM'));
  it('single digit minutes padded', () => expect(formatTime(9, 5)).toBe('9:05 AM'));
});

// ─────────────────────────────────────────────────────────
// Storage: getSleepSchedule / saveSleepSchedule
// ─────────────────────────────────────────────────────────

describe('getSleepSchedule', () => {
  it('returns default schedule when nothing stored', async () => {
    const result = await getSleepSchedule();
    expect(result).toEqual({
      enabled: false,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    });
  });

  it('returns saved schedule', async () => {
    const custom: SleepSchedule = {
      enabled: true,
      bedtimeHour: 23,
      bedtimeMinute: 30,
      wakeHour: 8,
      wakeMinute: 15,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(custom),
    );
    const result = await getSleepSchedule();
    expect(result).toEqual(custom);
  });

  it('returns default on corrupted JSON', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.SleepSchedule, '{broken json');
    const result = await getSleepSchedule();
    expect(result.enabled).toBe(false);
  });
});

describe('saveSleepSchedule', () => {
  it('persists and is retrievable', async () => {
    const custom: SleepSchedule = {
      enabled: true,
      bedtimeHour: 21,
      bedtimeMinute: 0,
      wakeHour: 6,
      wakeMinute: 30,
    };
    await saveSleepSchedule(custom);
    const raw = await AsyncStorage.getItem(AsyncStorageEnum.SleepSchedule);
    expect(JSON.parse(raw!)).toEqual(custom);
  });
});

// ─────────────────────────────────────────────────────────
// isSleepPaused — schedule + smart detection
// ─────────────────────────────────────────────────────────

const RealDate = global.Date;

const mockDateAndNow = (fakeNow: Date) => {
  const mock = jest.spyOn(global, 'Date').mockImplementation(
    (...args: any[]) => (args.length ? new (RealDate as any)(...args) : fakeNow),
  );
  (global.Date as any).now = jest.fn(() => fakeNow.getTime());
  return mock;
};

describe('isSleepPaused', () => {
  describe('automatic schedule', () => {
    it('returns true when schedule enabled and current time is within window', async () => {
      const fakeNow = new Date(2026, 2, 18, 23, 30, 0);
      mockDateAndNow(fakeNow);

      const schedule: SleepSchedule = {
        enabled: true,
        bedtimeHour: 22,
        bedtimeMinute: 0,
        wakeHour: 7,
        wakeMinute: 0,
      };
      await AsyncStorage.setItem(
        AsyncStorageEnum.SleepSchedule,
        JSON.stringify(schedule),
      );

      expect(await isSleepPaused()).toBe(true);
    });

    it('returns false when schedule enabled but current time is outside window', async () => {
      const fakeNow = new Date(2026, 2, 18, 14, 0, 0);
      mockDateAndNow(fakeNow);

      const schedule: SleepSchedule = {
        enabled: true,
        bedtimeHour: 22,
        bedtimeMinute: 0,
        wakeHour: 7,
        wakeMinute: 0,
      };
      await AsyncStorage.setItem(
        AsyncStorageEnum.SleepSchedule,
        JSON.stringify(schedule),
      );

      expect(await isSleepPaused()).toBe(false);
    });

    it('returns false when schedule is disabled', async () => {
      const schedule: SleepSchedule = {
        enabled: false,
        bedtimeHour: 22,
        bedtimeMinute: 0,
        wakeHour: 7,
        wakeMinute: 0,
      };
      await AsyncStorage.setItem(
        AsyncStorageEnum.SleepSchedule,
        JSON.stringify(schedule),
      );

      expect(await isSleepPaused()).toBe(false);
    });

    it('returns false when no schedule saved', async () => {
      expect(await isSleepPaused()).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────
// Real-world scenarios (updated for 1h post-wake buffer)
// ─────────────────────────────────────────────────────────

describe('Real-world scenarios', () => {
  afterEach(() => jest.restoreAllMocks());

  it('User asleep at 2 AM — system paused', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    const twoAM = new Date(2026, 2, 19, 2, 0, 0);
    mockDateAndNow(twoAM);

    expect(await isSleepPaused()).toBe(true);
  });

  it('7:01 AM — still paused (within 1h post-wake buffer)', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 7, 1, 0));

    expect(await isSleepPaused()).toBe(true);
  });

  it('7:30 AM — still paused (30 min into buffer)', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 7, 30, 0));

    expect(await isSleepPaused()).toBe(true);
  });

  it('8:01 AM — system resumes (buffer expired)', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 8, 1, 0));

    expect(await isSleepPaused()).toBe(false);
  });

  it('Schedule disabled — system runs 24/7', async () => {
    const schedule: SleepSchedule = {
      enabled: false,
      bedtimeHour: 22,
      bedtimeMinute: 0,
      wakeHour: 7,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 2, 0, 0));

    expect(await isSleepPaused()).toBe(false);
  });

  it('Night shift worker — bedtime 06:00, wake 14:00, buffer → 15:00', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 6,
      bedtimeMinute: 0,
      wakeHour: 14,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 10, 0, 0));
    expect(await isSleepPaused()).toBe(true);
  });

  it('Night shift — 14:30 still paused (in buffer), 15:01 resumes', async () => {
    const schedule: SleepSchedule = {
      enabled: true,
      bedtimeHour: 6,
      bedtimeMinute: 0,
      wakeHour: 14,
      wakeMinute: 0,
    };
    await AsyncStorage.setItem(
      AsyncStorageEnum.SleepSchedule,
      JSON.stringify(schedule),
    );

    mockDateAndNow(new Date(2026, 2, 19, 14, 30, 0));
    expect(await isSleepPaused()).toBe(true);

    jest.restoreAllMocks();

    mockDateAndNow(new Date(2026, 2, 19, 15, 1, 0));
    expect(await isSleepPaused()).toBe(false);
  });

  it('Corrupted storage — should not crash', async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.SleepSchedule, '%%%CORRUPT%%%');
    expect(await isSleepPaused()).toBe(false);
  });

  it('Fresh install — nothing saved', async () => {
    expect(await isSleepPaused()).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// isPausedTime edge cases (Time.service)
// ─────────────────────────────────────────────────────────

describe('isPausedTime (Time.service)', () => {
  const {isPausedTime} = require('../Time.service');

  it('returns true when current time is before pausedDate timestamp', () => {
    const now = new Date(2026, 2, 18, 12, 0, 0);
    const pausedDate = {timestamp: new Date(2026, 2, 18, 13, 0, 0).getTime()};
    expect(isPausedTime(now, pausedDate, [])).toBe(true);
  });

  it('returns false when pausedDate has passed', () => {
    const now = new Date(2026, 2, 18, 14, 0, 0);
    const pausedDate = {timestamp: new Date(2026, 2, 18, 13, 0, 0).getTime()};
    expect(isPausedTime(now, pausedDate, [])).toBe(false);
  });

  it('returns false when pausedDate is null', () => {
    const now = new Date(2026, 2, 18, 14, 0, 0);
    expect(isPausedTime(now, null, [])).toBe(false);
  });

  it('returns false with empty specificPausedTimes', () => {
    const now = new Date(2026, 2, 18, 14, 0, 0);
    expect(isPausedTime(now, {timestamp: 0}, [])).toBe(false);
  });

  it('matches a single-day time slot', () => {
    const wednesday = new Date(2026, 2, 18, 11, 0, 0);
    expect(wednesday.getDay()).toBe(3);

    const slot = {
      isActive: true,
      startTime: new Date(2026, 0, 1, 10, 0).getTime(),
      endTime: new Date(2026, 0, 1, 12, 0).getTime(),
      startDay: [3],
      endDay: [3],
    };
    expect(isPausedTime(wednesday, {timestamp: 0}, [slot])).toBe(true);
  });

  it('does not match inactive slot', () => {
    const wednesday = new Date(2026, 2, 18, 11, 0, 0);
    const slot = {
      isActive: false,
      startTime: new Date(2026, 0, 1, 10, 0).getTime(),
      endTime: new Date(2026, 0, 1, 12, 0).getTime(),
      startDay: [3],
      endDay: [3],
    };
    expect(isPausedTime(wednesday, {timestamp: 0}, [slot])).toBe(false);
  });

  it('matches an every-day slot', () => {
    const wednesday = new Date(2026, 2, 18, 11, 0, 0);
    const slot = {
      isActive: true,
      startTime: new Date(2026, 0, 1, 10, 0).getTime(),
      endTime: new Date(2026, 0, 1, 12, 0).getTime(),
      startDay: [0, 1, 2, 3, 4, 5, 6],
      endDay: [0, 1, 2, 3, 4, 5, 6],
    };
    expect(isPausedTime(wednesday, {timestamp: 0}, [slot])).toBe(true);
  });

  it('matches week-wrapping span (Fri–Mon)', () => {
    const sunday = new Date(2026, 2, 22, 11, 0, 0);
    expect(sunday.getDay()).toBe(0);
    const slot = {
      isActive: true,
      startTime: new Date(2026, 0, 1, 9, 0).getTime(),
      endTime: new Date(2026, 0, 1, 17, 0).getTime(),
      startDay: [5],
      endDay: [1],
    };
    expect(isPausedTime(sunday, {timestamp: 0}, [slot])).toBe(true);
  });
});
