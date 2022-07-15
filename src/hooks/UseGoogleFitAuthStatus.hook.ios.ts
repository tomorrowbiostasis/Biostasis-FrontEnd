import {useCallback, useState} from 'react';

interface IUseGoogleFitAuthStatusResult {
  authorizeGoogleFit: () => void;
  isGoogleFitAuthorized: boolean;
  resetGoogleFit: () => void;
}

export const useGoogleFitAuthStatus = (): IUseGoogleFitAuthStatusResult => {
  const [status] = useState(false);
  const authorizeGoogleFit = useCallback(() => null, []);

  const resetGoogleFit = useCallback(() => null, []);

  return {
    authorizeGoogleFit,
    isGoogleFitAuthorized: status,
    resetGoogleFit,
  };
};
