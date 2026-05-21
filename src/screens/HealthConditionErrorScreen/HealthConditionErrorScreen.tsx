import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo, VFC} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens, ScreensNavigationParamsList} from '~/models/Navigation.model';
import {automatedEmergencyLoading} from '~/redux/automatedEmergency/selectors';
import {
  pushPositiveResponse,
  startEmergency,
} from '~/redux/automatedEmergency/thunks';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {stopBackgroundFetch} from '~/services/Background.service';
import {isAndroid, updateDataCollectionStatus} from '~/utils';
import SoundService from '~/services/Alert.service';
import ToastService from '~/services/Toast.service';
import {updateNotification} from '~/services/Notification.service';
import AlertScreen from '~/components/AlertScreen';
import {HeartPulseIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';

const resetSoundAndNotificationsHandler = () => {
  SoundService.resetAllSounds();
};

const HealthConditionErrorScreen: VFC = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const loading = useAppSelector(automatedEmergencyLoading);
  const {params} =
    useRoute<
      RouteProp<ScreensNavigationParamsList, Screens.HealthConditionError>
    >();
  const dispatch = useAppDispatch();

  const resetPersistentTriggers = useCallback(async () => {
    await AsyncStorageService.setItem(AsyncStorageEnum.TimeTrigger, 'false');
    await AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'false');
  }, []);

  const handleCloseAndRedirect = useCallback(() => {
    reset({
      index: 0,
      routes: [{name: 'MainStack'}],
    });
  }, [reset]);

  const handleCancelEmergency = useCallback(async () => {
    resetSoundAndNotificationsHandler();
    await AsyncStorageService.setItem(
      AsyncStorageEnum.IsEmergencyEscalationStarted,
      'false',
    );

    await resetPersistentTriggers();
    dispatch(pushPositiveResponse());
    // FIXME: handle catch and schedule retries
    handleCloseAndRedirect();
    if (params.healthCheck) {
      await updateNotification(
        t('bioCheck.messages.automatedEmergency'),
        t('bioCheck.messages.userSendSignal'),
      );
    }
    ToastService.success(t('healthConditionError.success'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, handleCloseAndRedirect]);

  const handleTriggerEmergency = useCallback(async () => {
    resetSoundAndNotificationsHandler();
    await dispatch(startEmergency()).then(async () => {
      /*
        After setting emergency manually
        we are finishing services and turning off automated emergency
       */
      await resetPersistentTriggers();
      await dispatch(updateUser({automatedEmergency: false}));
      isAndroid ? await stopBackgroundFetch() : updateDataCollectionStatus();
    });
    handleCloseAndRedirect();
  }, [dispatch, handleCloseAndRedirect, resetPersistentTriggers]);

  const description: string = useMemo(() => {
    if (params?.regularCheck) {
      return t('healthConditionError.text1');
    }
    return t('healthConditionError.text0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertScreen
      tone="critical"
      icon={<HeartPulseIcon size={44} color={semanticColors.danger} />}
      title={t('healthConditionError.title')}
      description={description}
      headline={t('healthConditionError.text3')}
      primary={{
        label: t('healthConditionError.confirmOk'),
        onPress: handleCancelEmergency,
        variant: 'figmaPrimary',
      }}
      secondary={{
        label: t('healthConditionError.startEmergency'),
        onPress: handleTriggerEmergency,
        isLoading: loading,
        variant: 'figmaEmergency',
      }}
    />
  );
};
export default HealthConditionErrorScreen;
