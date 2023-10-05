import {isIOS, updateDataCollectionStatus} from '~/utils';
import {
  createNotificationChannels,
  // isForegroundFetchRunning,
  stopForegroundFetch,
  updateNotification,
} from '~/services/Notification.service';
import {useDidUpdateEffect} from '~/hooks/UseDidUpdateEffect';
import {NotificationTypesEnum} from '~/constants/notification.constants';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  AutomatedEmergencySettings,
  accountSettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
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
  checkNotificationPermissions,
  invokeGetToken,
  listenForPushTokenAndUpdate,
} from '~/services/Push.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {updateUser} from '~/redux/user/thunks';
import {IUser} from '~/redux/user/user.slice';
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
  const dispatch = useAppDispatch();

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

  const startAutomatedEmergency = useCallback(async () => {
    await createNotificationChannels();
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      await startBackgroundFetch()
        .then(status => {
          console.log('Settings > startAutomatedEmergency', status);
        })
        .catch(e =>
          console.log('Settings > startAutomatedEmergency > error', e),
        );
    }
    await listenForPushTokenAndUpdate();
    await invokeGetToken();
  }, []);

  const stopAutomatedEmergency = useCallback(async () => {
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      await stopBackgroundFetch(BackgroundEventsEnum.ReactNativeBackgroundFetch)
        .then(response =>
          console.log('Settings > stopAutomatedEmergency', response),
        )
        .catch(e =>
          console.log('Settings > stopAutomatedEmergency > error', e),
        );
    }
  }, []);

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const handleChangeAutomatedEmergencyState = useCallback(
    async (isBioChosen = false) => {
      console.log('Automated Emergency: changing state to', isBioChosen);
      const updateData: IUser = {
        automatedEmergency: isBioChosen,
      };
      if (isBioChosen) {
        updateData.regularPushNotification = false;
        handleUpdateUser(updateData);
        await startAutomatedEmergency();
      } else {
        stopAutomatedEmergency();
      }
    },
    [handleUpdateUser, startAutomatedEmergency, stopAutomatedEmergency],
  );

  // useDidUpdateEffect(() => {
  //   if (profile.id) {
  //     checkNotificationPermissions().then(null);
  //     return handleChangeAutomatedEmergencyState(isPlatformConditionsValid);
  //   }
  // }, [isPlatformConditionsValid]);

  useDidUpdateEffect(() => {
    const abortController = new AbortController();

    const handleEffect = async () => {
      if (!profile.id) {
        return; // If profile ID is not available, exit early
      }

      // const isActive = await isForegroundActive;
      // console.log('isActive', isActive);
      await checkNotificationPermissions().then(null);
      await handleChangeAutomatedEmergencyState(isPlatformConditionsValid);
      if (Platform.OS === 'android') {
        if (allowNotifications && !isNowPaused && isConnected) {
          await updateNotification(
            t('automatedEmergencyStatus.start.title'),
            t('automatedEmergencyStatus.start.describe'),
            NotificationTypesEnum.StartAutomatedSystem,
          );
        } else if (!allowNotifications || isNowPaused) {
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
    // isForegroundActive,
    isNowPaused,
    profile.id,
    isPlatformConditionsValid,
  ]);

  return null;
};

export default AutomatedSystemListener;
