import {
  canContinueGuidedMonitoringSetup,
  getAndroidBioMonitoringPrerequisites,
  getGuidedMonitoringPermissionsReady,
  hasReceivedHealthData,
} from './GuidedMonitoringSetupSheet.logic';

describe('GuidedMonitoringSetupSheet logic', () => {
  describe('getAndroidBioMonitoringPrerequisites', () => {
    it('persists every Android bio prerequisite in the same enable update', () => {
      expect(getAndroidBioMonitoringPrerequisites(true, 'bio')).toEqual({
        pulseBasedTriggerGoogleFitAuthenticated: true,
        pulseBasedTriggerConnectedToGoogleFit: true,
        pulseBasedTriggerBackgroundModesEnabled: true,
      });
    });

    it('does not add Android bio flags to time-based or iOS setup', () => {
      expect(getAndroidBioMonitoringPrerequisites(true, 'time')).toEqual({});
      expect(getAndroidBioMonitoringPrerequisites(false, 'bio')).toEqual({});
    });
  });

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

  describe('getGuidedMonitoringPermissionsReady', () => {
    const allGranted = {
      notificationsGranted: true,
      locationGranted: true,
      healthVerified: true,
    };

    it('is ready only once every permission is satisfied', () => {
      expect(getGuidedMonitoringPermissionsReady(allGranted)).toBe(true);
      expect(
        getGuidedMonitoringPermissionsReady({
          ...allGranted,
          notificationsGranted: false,
        }),
      ).toBe(false);
      expect(
        getGuidedMonitoringPermissionsReady({
          ...allGranted,
          locationGranted: false,
        }),
      ).toBe(false);
    });

    // Regression: the gate and the health tile's visibility were derived from
    // two different values, so once health data arrived without this sheet's
    // own check completing the row read "Connected" with no tile left to tap
    // while Continue stayed disabled. Callers must pass the same value to both.
    it('blocks until health access is verified on this device', () => {
      expect(
        getGuidedMonitoringPermissionsReady({
          ...allGranted,
          healthVerified: false,
        }),
      ).toBe(false);
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
