import {useCallback, useState} from 'react';

interface IUseGoogleFitAuthStatusResult {
  authorizeGoogleFit: () => Promise<boolean>;
  authorizeGoogleFitDetailed: () => Promise<{success: false; message: string}>;
  isGoogleFitAuthorized: boolean;
  resetGoogleFit: () => Promise<void>;
}

export const useGoogleFitAuthStatus = (): IUseGoogleFitAuthStatusResult => {
  const [status] = useState(false);
  const authorizeGoogleFit = useCallback(async () => false, []);
  const authorizeGoogleFitDetailed = useCallback(
    async () => ({success: false as const, message: 'Unavailable on iOS'}),
    [],
  );

  const resetGoogleFit = useCallback(async () => undefined, []);

  return {
    authorizeGoogleFit,
    authorizeGoogleFitDetailed,
    isGoogleFitAuthorized: status,
    resetGoogleFit,
  };
};
