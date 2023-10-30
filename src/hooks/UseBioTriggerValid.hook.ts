import {useMemo} from 'react';
import {useAppSelector} from '~/redux/store/hooks';
import {
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {isIOS} from '~/utils';

const useBioTriggerValid = () => {
  const {user} = useAppSelector(userSelector);
  const {automatedEmergency, regularPushNotification} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  const validatePlatformConditionsProps = useMemo(
    () => [
      automatedEmergency,
      user.pulseBasedTriggerConnectedToGoogleFit,
      user.pulseBasedTriggerBackgroundModesEnabled,
      user.pulseBasedTriggerIOSAppleWatchPaired,
      user.pulseBasedTriggerGoogleFitAuthenticated,
      regularPushNotification,
    ],
    [
      automatedEmergency,
      user.pulseBasedTriggerConnectedToGoogleFit,
      user.pulseBasedTriggerBackgroundModesEnabled,
      user.pulseBasedTriggerIOSAppleWatchPaired,
      user.pulseBasedTriggerGoogleFitAuthenticated,
      regularPushNotification,
    ],
  );

  const isPlatformConditionsValid: Boolean | undefined = useMemo(
    () =>
      isIOS
        ? automatedEmergency &&
          !regularPushNotification &&
          user.pulseBasedTriggerIOSAppleWatchPaired
        : automatedEmergency &&
          !regularPushNotification &&
          user.pulseBasedTriggerGoogleFitAuthenticated &&
          user.pulseBasedTriggerConnectedToGoogleFit &&
          user.pulseBasedTriggerBackgroundModesEnabled,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    validatePlatformConditionsProps,
  );
  return {isPlatformConditionsValid};
};

export default useBioTriggerValid;
