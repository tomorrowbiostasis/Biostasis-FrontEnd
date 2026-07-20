import {isIOS, updateDataCollectionStatus} from '~/utils';
import {
  createNotificationChannels,
  // isForegroundFetchRunning,
  stopForegroundFetch,
  updateNotification,
} from '~/services/Notification.service';
import {NotificationTypesEnum} from '~/constants/notification.constants';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppSelector} from '~/redux/store/hooks';
import {accountSettingsSelector, userSelector} from '~/redux/user/selectors';
import {isPausedTime} from '~/services/Time.service';
import {useCallback, useEffect, useMemo} from 'react';
import {
  automatedEmergencyPausedDateSelector,
  automatedEmergencyPausedTimesSelector,
} from '~/redux/automatedEmergency/selectors';
import {
  startBackgroundFetch,
  stopBackgroundFetch,
} from '~/services/Background.service';
import {
  invokeGetToken,
  listenForPushTokenAndUpdate,
} from '~/services/Push.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {Platform} from 'react-native';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import useBioTriggerValid from '~/hooks/UseBioTriggerValid.hook';

const AutomatedSystemListener = () => {
  const {user: profile} = useAppSelector(userSelector);
  const {isConnected} = useNetInfo();
  const {allowNotifications} = useAppSelector(accountSettingsSelector);
  const {isPlatformConditionsValid} = useBioTriggerValid();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const specificPausedTimes = useAppSelector(
    automatedEmergencyPausedTimesSelector,
  );
  const {t} = useAppTranslation();
  const isNowPaused = useMemo(
    () => isPausedTime(new Date(), pausedDate, specificPausedTimes),
    [pausedDate, specificPausedTimes],
  );
  useEffect(() => {
    const abortController = new AbortController();

    // Recommendation System Starting Date
    const handleStartingDate = async () => {
      const startingDate = await AsyncStorageService.getItem(
        AsyncStorageEnum.StartingDate,
      );
      if (!startingDate && isPlatformConditionsValid) {
        await AsyncStorageService.setItem(
          AsyncStorageEnum.StartingDate,
          new Date().toString(),
        );
      }
    };
    handleStartingDate();

    return () => {
      abortController.abort();
    };
  }, [isPlatformConditionsValid]);

  const startBioMonitoring = useCallback(async () => {
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      await startBackgroundFetch()
        .then(status => {
          console.log('Settings > startAutomatedEmergency', status);
        })
        .catch(() => console.log('Settings > startAutomatedEmergency > error'));
    }
  }, []);

  const stopBioMonitoring = useCallback(async () => {
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      await stopBackgroundFetch(BackgroundEventsEnum.ReactNativeBackgroundFetch)
        .then(response =>
          console.log('Settings > stopAutomatedEmergency', response),
        )
        .catch(() => console.log('Settings > stopAutomatedEmergency > error'));
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const handleEffect = async () => {
      if (!profile.id) {
        return; // If profile ID is not available, exit early
      }

      // Device readiness controls only the local bio worker. It must never
      // overwrite the user's server-side monitoring choice: permissions and
      // native authorization can be transient while Android recreates the app.
      if (isPlatformConditionsValid) {
        await startBioMonitoring();
      } else {
        await stopBioMonitoring();
      }

      if (profile.automatedEmergency) {
        await createNotificationChannels();
        await listenForPushTokenAndUpdate();
        await invokeGetToken();
      }

      if (Platform.OS === 'android') {
        if (
          profile.automatedEmergency &&
          allowNotifications &&
          !isNowPaused &&
          isConnected
        ) {
          await updateNotification(
            t('automatedEmergencyStatus.start.title'),
            t('automatedEmergencyStatus.start.describe'),
            NotificationTypesEnum.StartAutomatedSystem,
          );
        } else if (
          !profile.automatedEmergency ||
          !allowNotifications ||
          isNowPaused
        ) {
          await stopForegroundFetch();
        }
      }
    };

    handleEffect();

    return () => {
      abortController.abort();
    };
  }, [
    allowNotifications,
    isConnected,
    isNowPaused,
    profile.automatedEmergency,
    profile.id,
    isPlatformConditionsValid,
    startBioMonitoring,
    stopBioMonitoring,
    t,
  ]);

  return null;
};

export default AutomatedSystemListener;
