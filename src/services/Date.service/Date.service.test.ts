import {describe, expect, it} from '@jest/globals';
import {timeFromNow} from './Date.service';

describe('date to relative time', () => {
  describe('date difference min <= 0', () => {
    it('to be equal "less than minute"', () => {
      const today = new Date();

      const result = timeFromNow(today);
      expect(result).toEqual('less than minute');
    });

    it('to be equal "less than minute" when m = 1', () => {
      const today = new Date();

      today.setMinutes(today.getMinutes() + 1);
      const result = timeFromNow(today);
      expect(result).toEqual('less than minute');
    });

    it('to be equal less than minute when past', () => {
      const today = new Date();

      today.setSeconds(today.getSeconds() - 10);
      const result = timeFromNow(today);
      expect(result).toEqual('less than minute');
    });

    it('to be NOT equal less than minute min > 1', () => {
      const today = new Date();

      today.setSeconds(today.getSeconds() + 61);
      const result = timeFromNow(today);
      expect(result).not.toEqual('less than minute');
    });
  });

  describe('date difference 0 < min < 45', () => {
    it('to be equal "1 minute" when min = 1 and sec < 30', () => {
      const today = new Date();

      today.setMinutes(today.getMinutes() + 1);
      today.setSeconds(today.getSeconds() + 29);
      const result = timeFromNow(today);
      expect(result).toEqual('1 minute');
    });

    it('to be equal "2 minutes" when min = 2 ', () => {
      const today = new Date();

      today.setMinutes(today.getMinutes() + 2);
      const result = timeFromNow(today);
      expect(result).toEqual('2 minutes');
    });
  });

  describe('date differences 45 <= min < 120', () => {
    it('to be equal "1 hour" when h = 1 and min <= 0', () => {
      const today = new Date();

      today.setHours(today.getHours() + 1);
      let result = timeFromNow(today);
      expect(result).toEqual('1 hour');

      today.setSeconds(today.getSeconds() + 29);
      result = timeFromNow(today);
      expect(result).toEqual('1 hour');

      today.setSeconds(today.getSeconds() + 2);
      result = timeFromNow(today);
      expect(result).not.toEqual('1 hour');
    });

    it('to be equal "1 hour an X min" when h = 1 and min > 0 or sec > 30', () => {
      const today = new Date();

      today.setHours(today.getHours() + 1);
      today.setMinutes(today.getMinutes() + 1);
      let result = timeFromNow(today);
      expect(result).toContain('1 hour');
      expect(result).toContain('min');

      today.setMinutes(today.getMinutes() - 1);
      today.setSeconds(today.getSeconds() + 29);
      result = timeFromNow(today);
      expect(result).toContain('1 hour');
      expect(result).not.toContain('min');

      today.setSeconds(today.getSeconds() + 2);
      result = timeFromNow(today);
      expect(result).toContain('1 hour');
      expect(result).toContain('min');
    });

    it('to be NOT equal "1 hour" when min > 120', () => {
      const today = new Date();

      today.setMinutes(today.getMinutes() + 120);
      let result = timeFromNow(today);
      expect(result).not.toContain('1 hour');
    });
  });

  describe('date differences 2 <= h < 22', () => {
    it('to be equal "2 hours" when h = 2 and min <= 0', () => {
      const today = new Date();

      today.setHours(today.getHours() + 2);
      let result = timeFromNow(today);
      expect(result).toEqual('2 hours');

      today.setSeconds(today.getSeconds() + 29);
      result = timeFromNow(today);
      expect(result).toEqual('2 hours');

      today.setSeconds(today.getSeconds() + 2);
      result = timeFromNow(today);
      expect(result).not.toEqual('2 hours');
    });

    it('to be equal "2 hours an X min" when h = 2 and min > 0 or sec > 30', () => {
      const today = new Date();

      today.setHours(today.getHours() + 2);
      today.setMinutes(today.getMinutes() + 1);
      let result = timeFromNow(today);
      expect(result).toContain('2 hours');
      expect(result).toContain('min');

      today.setMinutes(today.getMinutes() - 1);
      today.setSeconds(today.getSeconds() + 29);
      result = timeFromNow(today);
      expect(result).toContain('2 hours');
      expect(result).not.toContain('min');

      today.setSeconds(today.getSeconds() + 2);
      result = timeFromNow(today);
      expect(result).toContain('2 hours');
      expect(result).toContain('min');
    });

    it('to be NOT equal "2 hours" when h >= 48', () => {
      const today = new Date();

      today.setHours(today.getHours() + 48);
      let result = timeFromNow(today);
      expect(result).not.toContain('2 hours');
    });
  });

  describe('date equal 21 h 59min 30 s <> 21 h 59 min 31s', () => {
    it(' 21 h 59 min 29 s', () => {
      const today = new Date();

      today.setHours(today.getHours() + 22);
      today.setSeconds(today.getSeconds() - 31);
      let result = timeFromNow(today);
      expect(result).toEqual('21 hours 59 min');
    });
    it(' 21 h 59 min 31s', () => {
      const today = new Date();

      today.setHours(today.getHours() + 22);
      today.setSeconds(today.getSeconds() - 29);
      let result = timeFromNow(today);
      expect(result).toEqual('1 day');
    });
  });

  describe('date differences 22 <= h < 47', () => {
    it('to be equal "1 day" when h = 22', () => {
      const today = new Date();

      today.setHours(today.getHours() + 22);
      let result = timeFromNow(today);
      console.log(result);
      expect(result).toEqual('1 day');

      today.setHours(today.getHours() + 5);
      result = timeFromNow(today);
      expect(result).not.toEqual('1 day');
    });

    it('to be equal "1 day" when 22 < h < 24 ', () => {
      const today = new Date();

      today.setHours(today.getHours() + 23);
      let result = timeFromNow(today);
      expect(result).toEqual('1 day');

      today.setHours(today.getHours() + 5);
      result = timeFromNow(today);
      expect(result).not.toEqual('1 day');
    });

    it('to be equal "1 day" when h = 24', () => {
      const today = new Date();

      today.setHours(today.getHours() + 24);
      let result = timeFromNow(today);
      expect(result).toEqual('1 day');

      today.setHours(today.getHours() + 4);
      result = timeFromNow(today);
      expect(result).not.toEqual('1 day');
    });

    it('to be equal "1 day an X h" when h > 24', () => {
      const today = new Date();

      today.setHours(today.getHours() + 25);
      let result = timeFromNow(today);
      expect(result).toEqual('1 day 1 h');
    });

    it('to be NOT equal "1 day..." when h >= 48', () => {
      const today = new Date();

      today.setHours(today.getHours() + 48);
      let result = timeFromNow(today);
      expect(result).not.toContain('1 hour');
    });

    it('to be  equal "X day X h" when h > 48', () => {
      const today = new Date();

      today.setHours(today.getHours() + 49);
      let result = timeFromNow(today);
      expect(result).toEqual('2 days 1 h');
    });
  });

  describe('date differences  h > 47', () => {
    it('to be equal "2 ays" when h = 48 and min = 0', () => {
      const today = new Date();

      today.setHours(today.getHours() + 48);
      let result = timeFromNow(today);
      expect(result).toEqual('2 days');

      today.setMinutes(today.getMinutes() + 50);
      result = timeFromNow(today);
      expect(result).not.toEqual('2 days');
    });
  });
});
