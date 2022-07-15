import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import {getUserPersistedSettings} from '~/services/AsyncStorage.service/helpers';

export const authenticateGoogleFit = async () => {
  try {
    const authResult = await GoogleFit.authorize({
      scopes: [Scopes.FITNESS_HEART_RATE_READ],
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

export const hasRecentAndCorrectPulseData = async () => {
  try {
    const authResult = await GoogleFit.authorize({
      scopes: [Scopes.FITNESS_HEART_RATE_READ],
    });

    const {positiveInfoPeriod} = await getUserPersistedSettings();

    if (authResult.success && positiveInfoPeriod) {
      const samples = await GoogleFit.getHeartRateSamples({
        startDate: new Date(
          +new Date() - 1000 * 60 * positiveInfoPeriod,
        ).toISOString(),
        endDate: new Date().toISOString(),
        bucketUnit: 'MINUTE' as BucketUnit,
        bucketInterval: 1,
      });
      if (samples.length) {
        const lastSample = samples[samples.length - 1];
        const lastValue = lastSample.value;
        const lastValueTime = lastSample.startDate;
        if (lastValue > 10) {
          return lastValueTime;
        }
      }
      return null;
    }
    console.warn('Could not authorize Google Fit', authResult);
    return null;
  } catch (e) {
    console.warn('Google Fit authorization error', e);
    return null;
  }
};
