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
    it('requires permissions before continuing to sleep schedule', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 1,
          permissionsReady: false,
        }),
      ).toBe(false);

      expect(
        canContinueGuidedMonitoringSetup({
          step: 1,
          permissionsReady: true,
        }),
      ).toBe(true);
    });

    it('keeps health access as part of permissions readiness', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 1,
          permissionsReady: false,
        }),
      ).toBe(false);
    });

    it('allows final enable from the sleep schedule step', () => {
      expect(
        canContinueGuidedMonitoringSetup({
          step: 2,
          permissionsReady: true,
        }),
      ).toBe(true);
    });
  });
});
