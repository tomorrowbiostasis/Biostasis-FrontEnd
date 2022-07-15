import {useState, useEffect, useCallback} from 'react';
import {authenticateGoogleFit} from '~/services/GoogleFit.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';

interface IUseGoogleFitAuthStatusResult {
  authorizeGoogleFit: () => Promise<void>;
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
          const isGoogleFitAuthorized = JSON.parse(value);
          console.log('Saved Google Fit authorization status', isAuthorized);
          setIsAuthorized(isGoogleFitAuthorized);
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authorizeGoogleFit = useCallback(async () => {
    const authSuccess = await authenticateGoogleFit();
    if (authSuccess) {
      setIsAuthorized(true);
      await AsyncStorageService.setItem(
        AsyncStorageEnum.GoogleFitAuthorized,
        JSON.stringify(true),
      );
      console.log('Saved Google Fit authorization status');
    }
  }, [setIsAuthorized]);

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
    isGoogleFitAuthorized: isAuthorized,
    resetGoogleFit,
  };
};
