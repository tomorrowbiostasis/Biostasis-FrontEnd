import {
  canContinueGuidedMonitoringSetup,
  hasReceivedHealthData,
} from './GuidedMonitoringSetupSheet.logic';

describe('GuidedMonitoringSetupSheet logic', () => {
  describe('hasReceivedHealthData', () => {
    it('returns false when no health data exists', () => {
      expect(hasReceivedHealthData(null)).toBe(false);
      expect(hasReceivedHealthData(undefined)).toBe(false);
    });

    it('returns true when health values are available', () => {
      expect(hasReceivedHealthData({heartRate: 72})).toBe(true);
      expect(hasReceivedHealthData({steps: 0, stepsEndDate: 1717420000})).toBe(
        true,
      );
    });

    it('returns true when only timestamps are available', () => {
      expect(hasReceivedHealthData({heartRateEndDate: 1717420000})).toBe(true);
    });
  });

  describe('canContinueGuidedMonitoringSetup', () => {
    it('starts at monitoring type selection', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 1,
          mode: null,
          healthDataReceived: true,
          sleepScheduleEnabled: false,
        }),
      ).toBe(false);

      expect(
        canContinueGuidedMonitoringSetup({
          step: 1,
          mode: 'bio',
          healthDataReceived: true,
          sleepScheduleEnabled: false,
        }),
      ).toBe(true);
    });

    it('allows bio setup to continue only when health data is received', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 2,
          mode: 'bio',
          healthDataReceived: false,
          sleepScheduleEnabled: false,
        }),
      ).toBe(false);

      expect(
        canContinueGuidedMonitoringSetup({
          step: 2,
          mode: 'bio',
          healthDataReceived: true,
          sleepScheduleEnabled: false,
        }),
      ).toBe(true);
    });

    it('allows time setup to continue after type configuration', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 2,
          mode: 'time',
          healthDataReceived: false,
          sleepScheduleEnabled: false,
        }),
      ).toBe(true);
    });

    it('requires sleep schedule before final enable', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 4,
          mode: 'time',
          healthDataReceived: false,
          sleepScheduleEnabled: false,
        }),
      ).toBe(false);

      expect(
        canContinueGuidedMonitoringSetup({
          step: 4,
          mode: 'time',
          healthDataReceived: false,
          sleepScheduleEnabled: true,
        }),
      ).toBe(true);
    });
  });
});
