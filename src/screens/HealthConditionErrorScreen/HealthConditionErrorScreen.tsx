import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Button, Text, View, Spinner} from 'native-base';
import React, {useCallback, useMemo, VFC} from 'react';
// import {Notifications} from 'react-native-notifications';
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
import styles from './styles';
import SoundService from '~/services/Alert.service';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import Container from '~/components/Container';
import ToastService from '~/services/Toast.service';
import {updateNotification} from '~/services/Notification.service';
// import {
//   isForegroundFetchRunning,
//   stopForegroundFetch,
// } from '~/services/Notification.service';

const resetSoundAndNotificationsHandler = () => {
  // Notifications.removeAllDeliveredNotifications();
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
    // const isForegroundActive = await isForegroundFetchRunning();
    // if (isForegroundActive) {
    // await stopForegroundFetch();
    // }
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

  const firstLineOfText: string = useMemo(() => {
    if (params?.regularCheck) {
      return t('healthConditionError.text1');
    }
    return t('healthConditionError.text0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      loading={loading}
      type={'static'}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <IconIonicons name={'pulse-outline'} size={26} style={styles.icon} />
          <Text fontSize={'md'} fontWeight={700}>
            {t('healthConditionError.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <Text fontSize={'md'}>{firstLineOfText}</Text>
          <Text fontSize={'2xl'} fontWeight={700} m={10}>
            {t('healthConditionError.text3')}
          </Text>
          <View style={styles.panelFooter}>
            <Button variant={'solid'} onPress={handleCancelEmergency}>
              {t('common.yes')}
            </Button>
            <Button
              spinner={<Spinner color={'white'} size={'small'} />}
              isLoading={loading}
              style={styles.emergencyButton}
              variant={'solid'}
              onPress={handleTriggerEmergency}>
              {t('healthConditionError.startEmergency')}
            </Button>
          </View>
        </View>
      </View>
    </Container>
  );
};
export default HealthConditionErrorScreen;
