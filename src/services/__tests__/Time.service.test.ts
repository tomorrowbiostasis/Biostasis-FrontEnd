import {isPausedTime} from '../Time.service';

jest.mock('../API.service', () => ({
  __esModule: true,
  default: {getTimeSlot: jest.fn()},
}));

jest.mock('../TimeSlot.service', () => ({
  ApiToLocal: {mapApiToLocalData: jest.fn()},
}));

const makePausedTime = (
  startTime: Date,
  endTime: Date,
  startDay: number[],
  endDay: number[],
  isActive = true,
) => ({isActive, startTime: +startTime, endTime: +endTime, startDay, endDay});

describe('isPausedTime', () => {
  describe('manual pause (pausedDate)', () => {
    it('returns true if current time is before pausedDate timestamp', () => {
      const now = new Date('2026-03-24T10:00:00');
      const pausedDate = {timestamp: +new Date('2026-03-24T12:00:00')};
      expect(isPausedTime(now, pausedDate, [])).toBe(true);
    });

    it('returns false if current time is after pausedDate timestamp', () => {
      const now = new Date('2026-03-24T14:00:00');
      const pausedDate = {timestamp: +new Date('2026-03-24T12:00:00')};
      expect(isPausedTime(now, pausedDate, [])).toBe(false);
    });

    it('handles null pausedDate safely', () => {
      const now = new Date('2026-03-24T10:00:00');
      expect(isPausedTime(now, null, [])).toBe(false);
    });
  });

  describe('specific paused times — all days (midnight crossing)', () => {
    it('23:00–06:00 pauses at 01:00 (after midnight)', () => {
      const now = new Date('2026-03-24T01:00:00'); // Tuesday 1 AM
      const pause = makePausedTime(
        new Date('2026-01-01T23:00:00'),
        new Date('2026-01-01T06:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
      );
      expect(isPausedTime(now, null, [pause])).toBe(true);
    });

    it('23:00–06:00 pauses at 23:30', () => {
      const now = new Date('2026-03-24T23:30:00');
      const pause = makePausedTime(
        new Date('2026-01-01T23:00:00'),
        new Date('2026-01-01T06:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
      );
      expect(isPausedTime(now, null, [pause])).toBe(true);
    });

    it('23:00–06:00 does NOT pause at 12:00', () => {
      const now = new Date('2026-03-24T12:00:00');
      const pause = makePausedTime(
        new Date('2026-01-01T23:00:00'),
        new Date('2026-01-01T06:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
      );
      expect(isPausedTime(now, null, [pause])).toBe(false);
    });

    it('09:00–17:00 (no midnight crossing) pauses at 12:00', () => {
      const now = new Date('2026-03-24T12:00:00');
      const pause = makePausedTime(
        new Date('2026-01-01T09:00:00'),
        new Date('2026-01-01T17:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
      );
      expect(isPausedTime(now, null, [pause])).toBe(true);
    });

    it('09:00–17:00 does NOT pause at 20:00', () => {
      const now = new Date('2026-03-24T20:00:00');
      const pause = makePausedTime(
        new Date('2026-01-01T09:00:00'),
        new Date('2026-01-01T17:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
      );
      expect(isPausedTime(now, null, [pause])).toBe(false);
    });
  });

  describe('inactive paused times are ignored', () => {
    it('does not pause if isActive is false', () => {
      const now = new Date('2026-03-24T12:00:00');
      const pause = makePausedTime(
        new Date('2026-01-01T09:00:00'),
        new Date('2026-01-01T17:00:00'),
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 4, 5, 6],
        false,
      );
      expect(isPausedTime(now, null, [pause])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null specificPausedTimes', () => {
      const now = new Date('2026-03-24T10:00:00');
      expect(isPausedTime(now, null, null)).toBe(false);
    });

    it('handles undefined specificPausedTimes', () => {
      const now = new Date('2026-03-24T10:00:00');
      expect(isPausedTime(now, null, undefined)).toBe(false);
    });
  });
});
