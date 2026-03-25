import {useCallback, useState} from 'react';

interface IUseGoogleFitAuthStatusResult {
  authorizeGoogleFit: () => Promise<boolean>;
  isGoogleFitAuthorized: boolean;
  resetGoogleFit: () => Promise<void>;
}

export const useGoogleFitAuthStatus = (): IUseGoogleFitAuthStatusResult => {
  const [status] = useState(false);
  const authorizeGoogleFit = useCallback(async () => false, []);

  const resetGoogleFit = useCallback(async () => undefined, []);

  return {
    authorizeGoogleFit,
    isGoogleFitAuthorized: status,
    resetGoogleFit,
  };
};
