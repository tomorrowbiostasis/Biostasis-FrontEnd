import {useState, useEffect, useCallback} from 'react';
import {
  authenticateGoogleFitDetailed,
  GoogleFitAuthResult,
} from '~/services/GoogleFit.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';

interface IUseGoogleFitAuthStatusResult {
  authorizeGoogleFit: () => Promise<boolean>;
  authorizeGoogleFitDetailed: () => Promise<GoogleFitAuthResult>;
  isGoogleFitAuthorized: boolean;
  resetGoogleFit: () => Promise<void>;
}

export const useGoogleFitAuthStatus = (): IUseGoogleFitAuthStatusResult => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    AsyncStorageService.getItem(AsyncStorageEnum.GoogleFitAuthorized).then(
      value => {
        console.log('Read value of Google Fit authorization status', value);
        if (value) {
          try {
            const parsedValue = JSON.parse(value);
            console.log('Saved Google Fit authorization status', parsedValue);
            setIsAuthorized(Boolean(parsedValue));
          } catch (error) {
            console.warn('Invalid Google Fit authorization status value', error);
            setIsAuthorized(false);
          }
        }
      },
    );
  }, []);

  const authorizeGoogleFitDetailedWithStorage = useCallback(async () => {
    const authResult = await authenticateGoogleFitDetailed();
    if (authResult.success) {
      setIsAuthorized(true);
      await AsyncStorageService.setItem(
        AsyncStorageEnum.GoogleFitAuthorized,
        JSON.stringify(true),
      );
      console.log('Saved Google Fit authorization status');
      return authResult;
    }

    setIsAuthorized(false);
    await AsyncStorageService.setItem(
      AsyncStorageEnum.GoogleFitAuthorized,
      JSON.stringify(false),
    );
    return authResult;
  }, [setIsAuthorized]);

  const authorizeGoogleFit = useCallback(async () => {
    const authResult = await authorizeGoogleFitDetailedWithStorage();
    return authResult.success;
  }, [authorizeGoogleFitDetailedWithStorage]);

  const resetGoogleFit = useCallback(async () => {
    await AsyncStorageService.setItem(
      AsyncStorageEnum.GoogleFitAuthorized,
      JSON.stringify(false),
    );
    console.log('Disabled Google Fit authorization status');
    setIsAuthorized(false);
  }, [setIsAuthorized]);

  return {
    authorizeGoogleFit,
    authorizeGoogleFitDetailed: authorizeGoogleFitDetailedWithStorage,
    isGoogleFitAuthorized: isAuthorized,
    resetGoogleFit,
  };
};
