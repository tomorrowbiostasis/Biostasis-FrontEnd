/* eslint-disable no-shadow */
import {PermissionsAndroid, Platform} from 'react-native';
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {getUserPersistedSettings} from '~/services/AsyncStorage.service/helpers';
import {store} from '~/redux/store';
import {setHealthData} from '~/redux/health/health.slice';
import {IBioData, IGoogleFitConfig} from './GoogleFit.types';
import {IHealthData} from './BioCheck.types';

// Google Fit step queries require the ACTIVITY_RECOGNITION runtime permission on
// Android 10+ (API 29). Without it, getDailyStepCountSamples fails with
// ApiException 5025 and returns no data. Request it before authorizing/querying.
const ensureActivityRecognitionPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version < 29) {
    return true;
  }
  try {
    const permission =
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION;
    if (await PermissionsAndroid.check(permission)) {
      return true;
    }
    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    console.warn('ACTIVITY_RECOGNITION permission request failed', e);
    return false;
  }
};

export const authenticateGoogleFit = async () => {
  try {
    await ensureActivityRecognitionPermission();
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
    const authStatusRaw = await AsyncStorageService.getItem(
      AsyncStorageEnum.GoogleFitAuthorized,
    );
    let authResult = false;
    if (authStatusRaw) {
      try {
        authResult = Boolean(JSON.parse(authStatusRaw));
      } catch (error) {
        console.warn('Invalid Google Fit authorization cache value', error);
      }
    }

    const {positiveInfoPeriod} = await getUserPersistedSettings();

    // The native module's `isAuthorized` flag lives in memory and resets to
    // false on every app launch / background-fetch JS restart. Relying on the
    // persisted cache alone means we query Google Fit without an active Fitness
    // client, which silently returns empty arrays. Re-establish the native
    // connection here — this is a cheap no-op when the grant already exists.
    if (authResult && positiveInfoPeriod) {
      const nativeAuthorized = await authenticateGoogleFit();
      if (!nativeAuthorized) {
        console.warn(
          'Google Fit cached as authorized but native re-auth failed',
        );
        return null;
      }

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

      // Push the fetched values into the health slice the UI renders from
      // (Android's analogue of the iOS HealthKit emitter). Only dispatch on a
      // positive read so an empty window leaves the last displayed value intact.
      if (
        bioData.pulseData.value ||
        bioData.restingPulseData.value ||
        bioData.movementData.value
      ) {
        const toEndDate = (time: IHealthData['time']): number | null => {
          if (!time) {
            return null;
          }
          const ms = new Date(time).getTime();
          return Number.isNaN(ms) ? null : ms;
        };
        store.dispatch(
          setHealthData({
            heartRate: bioData.pulseData.value,
            restingHeartRate: bioData.restingPulseData.value,
            steps: bioData.movementData.value,
            totalSteps: bioData.movementData.value,
            heartRateEndDate: toEndDate(bioData.pulseData.time),
            restingHeartRateEndDate: toEndDate(bioData.restingPulseData.time),
            stepsEndDate: toEndDate(bioData.movementData.time),
          }),
        );
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
      let maxSteps = 0;
      let latestTime: number | null = null;
      samples.forEach(sample => {
        const steps = sample.rawSteps.reduce(
          (sum, data) => sum + data.steps,
          0,
        );
        const time = sample.rawSteps.reduce<number | null>((latest, data) => {
          if (!latest || data.endDate > latest) {
            return data.endDate;
          }
          return latest;
        }, null);
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
