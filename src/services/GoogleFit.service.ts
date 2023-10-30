/* eslint-disable no-shadow */
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import {getUserPersistedSettings} from '~/services/AsyncStorage.service/helpers';
import {IBioData, IGoogleFitConfig} from './GoogleFit.types';

export const authenticateGoogleFit = async () => {
  try {
    const authResult = await GoogleFit.authorize({
      scopes: [Scopes.FITNESS_HEART_RATE_READ, Scopes.FITNESS_ACTIVITY_READ],
    });
    if (authResult.success) {
      console.log('Google Fit authorized successfully');
      return true;
    }
    console.warn('Could not authorize Google Fit', authResult);
    return false;
  } catch (e) {
    console.warn('Google Fit authorization error', e);
    return false;
  }
};

export const recentBioData = async () => {
  try {
    const authResult = await authenticateGoogleFit();

    const {positiveInfoPeriod} = await getUserPersistedSettings();

    if (authResult && positiveInfoPeriod) {
      const googleFitConfig: IGoogleFitConfig = {
        startDate: new Date(
          +new Date() - 1000 * 60 * positiveInfoPeriod,
        ).toISOString(),
        endDate: new Date().toISOString(),
        bucketUnit: 'HOUR' as BucketUnit,
        bucketInterval: 1,
      };

      const pulseData = await recentPulseData(googleFitConfig);
      const restingPulseData = await recentRestingPulseData(googleFitConfig);
      const movementData = await recentMovementData(googleFitConfig);

      let bioData: IBioData = {
        pulseData: {value: 0, time: ''},
        restingPulseData: {value: 0, time: ''},
        movementData: {value: 0, time: ''},
      };

      if (pulseData !== null) {
        bioData.pulseData = pulseData;
      }
      if (restingPulseData !== null) {
        bioData.restingPulseData = restingPulseData;
      }
      if (movementData !== null) {
        bioData.movementData = movementData;
      }

      return bioData;
    }
    console.warn('Could not authorize Google Fit', authResult);
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const recentPulseData = async (config: IGoogleFitConfig) => {
  try {
    const samples = await GoogleFit.getHeartRateSamples(config);
    if (samples.length) {
      const lastSample = samples[samples.length - 1];
      const lastPulseValue = lastSample.value;
      const lastPulseTime = lastSample.endDate;
      if (lastPulseValue > 10) {
        return {
          value: lastPulseValue,
          time: new Date(lastPulseTime),
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Google Fit authorization error', e);
    return null;
  }
};

export const recentRestingPulseData = async (config: IGoogleFitConfig) => {
  try {
    const samples = await GoogleFit.getRestingHeartRateSamples(config);

    if (samples.length) {
      const lastSample = samples[samples.length - 1];
      const lastRestingPulseValue = lastSample.value;
      const lastRestingPulseTime = lastSample.endDate;
      if (lastRestingPulseValue > 10) {
        return {
          value: Math.round(lastRestingPulseValue),
          time: new Date(lastRestingPulseTime),
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Google Fit authorization error', e);
    return null;
  }
};

export const recentMovementData = async (config: IGoogleFitConfig) => {
  try {
    const samples = await GoogleFit.getDailyStepCountSamples(config);

    if (samples.length) {
      let maxSteps = 0,
        latestTime = 0;
      samples.forEach(sample => {
        const steps = sample.rawSteps.reduce(
          (sum, data) => (sum += data.steps),
          0,
        );
        const time = sample.rawSteps.reduce((time, data) => {
          if (data.endDate > time) {
            return data.endDate;
          }
          return time;
        }, 0);
        if (steps > maxSteps) {
          maxSteps = steps;
          latestTime = time;
        }
      });

      if (maxSteps > 10 && latestTime) {
        return {
          value: maxSteps,
          time: new Date(latestTime),
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Google Fit authorization error', e);
    return null;
  }
};
