import {useCallback} from 'react';
import {Platform} from 'react-native';
import {GeoPosition} from 'react-native-geolocation-service';

import {useAppDispatch} from '~/redux/store/hooks';
import {startEmergency} from '~/redux/automatedEmergency/thunks';
import {useGeoPosition} from '~/hooks/UseGeoPosition.hook';
import {
  scheduleEvent,
  startBackgroundFetch,
} from '~/services/Background.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';

interface IUseTriggerEmergencyReturn {
  triggerEmergency: () => Promise<boolean>;
}

/**
 * Fires the real emergency.
 *
 * Captures GPS, then:
 * - iOS: dispatches the `startEmergency` thunk and resolves with the API success flag.
 * - Android: schedules the offline-capable background retry mechanism (which keeps
 *   retrying until delivered) and resolves optimistically.
 *
 * Extracted from the legacy EmergencyCountdown overlay so the trigger drawer can
 * drive it directly.
 */
export const useTriggerEmergency = (): IUseTriggerEmergencyReturn => {
  const dispatch = useAppDispatch();
  const {getGeoPosition} = useGeoPosition();

  const dispatchEmergency = useCallback(
    async () => {
      const action = await dispatch(startEmergency());
      return Boolean((action as {payload?: {data?: {success?: boolean}}})
        .payload?.data?.success);
    },
    [dispatch],
  );

  // Marks that this device initiated the emergency. CancelEmergencyPopup uses
  // this to skip its auto-navigation to HealthConditionError when the backend
  // flips `isEmergencyTriggerActive` as a result of OUR own send — keeping the
  // user inside the confirmation sheet's success state and leaving the
  // automated monitor running. The genuine backend-only escalation path (flag
  // flips without a local trigger) is unaffected.
  const markManualTrigger = useCallback(async () => {
    await AsyncStorageService.setItem(
      AsyncStorageEnum.ManualEmergencyInProgress,
      'true',
    );
  }, []);

  const setupRetries = useCallback(
    async (geoPosition: GeoPosition | null) => {
      await AsyncStorageService.setItem(
        AsyncStorageEnum.RetryGeoPosition,
        JSON.stringify(geoPosition),
      );

      const backgroundServiceStatus = await startBackgroundFetch();
      console.log(
        `background service status: ${JSON.stringify(backgroundServiceStatus)}`,
      );
      return scheduleEvent(BackgroundEventsEnum.EmergencyRetryMechanism, 0)
        .then(() => console.log('first retry task set'))
        .catch(() => {
          console.log('task not scheduled');
          return dispatchEmergency();
        });
    },
    [dispatchEmergency],
  );

  const triggerEmergency = useCallback(async (): Promise<boolean> => {
    await markManualTrigger();
    const geoPosition = await getGeoPosition();
    if (Platform.OS === 'ios') {
      return dispatchEmergency();
    }
    await setupRetries(geoPosition);
    return true;
  }, [dispatchEmergency, getGeoPosition, markManualTrigger, setupRetries]);

  return {triggerEmergency};
};
