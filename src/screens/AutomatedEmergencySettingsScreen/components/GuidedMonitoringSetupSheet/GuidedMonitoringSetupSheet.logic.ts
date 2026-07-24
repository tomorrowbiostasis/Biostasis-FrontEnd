export type GuidedMonitoringMode = 'bio' | 'time';
export type GuidedMonitoringStep = 1 | 2;

export const getAndroidBioMonitoringPrerequisites = (
  isAndroid: boolean,
  mode: GuidedMonitoringMode,
) =>
  isAndroid && mode === 'bio'
    ? {
        pulseBasedTriggerGoogleFitAuthenticated: true,
        pulseBasedTriggerConnectedToGoogleFit: true,
        pulseBasedTriggerBackgroundModesEnabled: true,
      }
    : {};

type HealthDataLike =
  | {
      heartRate?: number | null;
      restingHeartRate?: number | null;
      steps?: number | null;
      totalSteps?: number | null;
      heartRateEndDate?: number | null;
      restingHeartRateEndDate?: number | null;
      stepsEndDate?: number | null;
    }
  | null
  | undefined;

export const hasReceivedHealthData = (health: HealthDataLike): boolean => {
  if (!health) {
    return false;
  }

  return [
    health.heartRate,
    health.restingHeartRate,
    health.steps,
    health.totalSteps,
    health.heartRateEndDate,
    health.restingHeartRateEndDate,
    health.stepsEndDate,
  ].some(value => typeof value === 'number' && Number.isFinite(value));
};

export type GuidedMonitoringPermissionState = {
  notificationsGranted: boolean;
  locationGranted: boolean;
  /**
   * Whether health access has been verified on THIS device — i.e. the sheet's
   * own check succeeded, or the platform reports a live grant. Deliberately not
   * satisfied by health data alone: persisted samples outlive the permission
   * that produced them, so data can exist after access was revoked.
   *
   * This MUST be the same value that decides whether the health tile is still
   * offered to the user.
   */
  healthVerified: boolean;
};

/**
 * Single source of truth for step 1 readiness.
 *
 * The gate and the health tile's visibility used to be derived from two
 * different values. Once health data arrived without this sheet's own check
 * completing, they diverged: the health row rendered as "Connected", no tile
 * was left to tap, and Continue stayed disabled — stranding the user on step 1
 * with no way forward. Both readings must come through this one function.
 */
export const getGuidedMonitoringPermissionsReady = ({
  notificationsGranted,
  locationGranted,
  healthVerified,
}: GuidedMonitoringPermissionState): boolean =>
  notificationsGranted && locationGranted && healthVerified;

export const canContinueGuidedMonitoringSetup = ({
  step,
  permissionsReady,
}: {
  step: GuidedMonitoringStep;
  permissionsReady: boolean;
}): boolean => {
  if (step === 1) {
    return permissionsReady;
  }

  if (step === 2) {
    return true;
  }

  return false;
};
