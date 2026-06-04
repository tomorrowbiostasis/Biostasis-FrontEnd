export type GuidedMonitoringMode = 'bio' | 'time';
export type GuidedMonitoringStep = 1 | 2 | 3 | 4;

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
  mode,
  healthDataReceived,
  sleepScheduleEnabled,
}: {
  step: GuidedMonitoringStep;
  mode: GuidedMonitoringMode | null;
  healthDataReceived: boolean;
  sleepScheduleEnabled: boolean;
}): boolean => {
  if (step === 1) {
    return !!mode;
  }

  if (step === 2) {
    return mode === 'time' || (mode === 'bio' && healthDataReceived);
  }

  if (step === 3) {
    return !!mode;
  }

  return (
    !!mode && (mode === 'time' || healthDataReceived) && sleepScheduleEnabled
  );
};
