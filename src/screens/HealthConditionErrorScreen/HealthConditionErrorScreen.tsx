import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Button, Text, View, Spinner} from 'native-base';
import React, {useCallback, useMemo, VFC} from 'react';
import {Notifications} from 'react-native-notifications';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
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

const resetSoundAndNotificationsHandler = () => {
  Notifications.removeAllDeliveredNotifications();
  SoundService.resetAllSounds();
};

const HealthConditionErrorScreen: VFC = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const loading = useAppSelector(automatedEmergencyLoading);
  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'HealthConditionError'>>();
  const dispatch = useAppDispatch();

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
    dispatch(pushPositiveResponse());
    // FIXME: handle catch and schedule retries
    handleCloseAndRedirect();
  }, [handleCloseAndRedirect, dispatch]);

  const handleTriggerEmergency = useCallback(async () => {
    resetSoundAndNotificationsHandler();
    await dispatch(startEmergency()).then(async () => {
      /*
        After setting emergency manually
        we are finishing services and turning off automated emergency
       */
      await dispatch(updateUser({automatedEmergency: false}));
      isAndroid ? await stopBackgroundFetch() : updateDataCollectionStatus();
    });
    handleCloseAndRedirect();
  }, [handleCloseAndRedirect, dispatch]);

  const firstLineOfText = useMemo(() => {
    if (params?.backendTriggered) {
      return (
        <Text fontSize="2xl" textAlign="center">
          {t('healthConditionError.text0')}
        </Text>
      );
    }
    if (!params?.regular) {
      return (
        <Text fontSize="2xl" textAlign="center">
          {t('healthConditionError.text1')}
        </Text>
      );
    }
    return null;
  }, [t, params]);

  return (
    <SafeAreaView style={styles.contentContainerStyle}>
      <View py={40} px={10} minHeight={50} width={'100%'}>
        {firstLineOfText}
        <Text fontSize="2xl" textAlign="center" mt={10}>
          {t('healthConditionError.text2')}
        </Text>
      </View>
      <View py={5} width={'100%'} px={10}>
        <Button
          style={styles.button}
          variant={'solid'}
          onPress={handleCancelEmergency}>
          {t('common.yes')}
        </Button>
        <Button
          spinner={<Spinner color={'white'} size={'small'} />}
          isLoading={loading}
          style={[styles.button, styles.emergencyButton]}
          variant={'solid'}
          onPress={handleTriggerEmergency}>
          {t('healthConditionError.startEmergency')}
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default HealthConditionErrorScreen;
