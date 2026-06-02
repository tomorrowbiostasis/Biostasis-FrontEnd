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
    const geoPosition = await getGeoPosition();
    if (Platform.OS === 'ios') {
      return dispatchEmergency();
    }
    await setupRetries(geoPosition);
    return true;
  }, [dispatchEmergency, getGeoPosition, setupRetries]);

  return {triggerEmergency};
};
