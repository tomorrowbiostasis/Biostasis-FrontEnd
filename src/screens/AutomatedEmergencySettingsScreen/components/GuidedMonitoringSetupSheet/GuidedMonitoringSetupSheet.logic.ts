export type GuidedMonitoringMode = 'bio' | 'time';
export type GuidedMonitoringStep = 1 | 2;

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
