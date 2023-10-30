import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import {getUserPersistedSettings} from './AsyncStorage.service/helpers';
import {recentBioData} from './GoogleFit.service';
import API from './API.service';
import {stopBackgroundFetch, updateLocation} from './Background.service';
import {navigate} from '~/navigators';
import {Screens} from '~/models/Navigation.model';
import i18n from '~/i18n/i18n';
import {IBioData, TIME_FORMAT_OPTION} from './GoogleFit.types';
import {NotificationTypesEnum} from '../constants/notification.constants';
import {
  createNotificationChannels,
  updateNotification,
} from './Notification.service';
import {getTimeSettings, isPausedTime} from './Time.service';
import {IHealthData} from './BioCheck.types';
import {recommendationSystem} from './Recommendation.service';
import {AppState} from 'react-native';

export const startBioCheck = async () => {
  const response = await getUserPersistedSettings();
  const {automatedEmergency, allowNotifications} = response;
  console.log('-> BIO CHECK STARTED');

  try {
    // check if the system is paused
    const {pausedDate, specificPausedTimes} = await getTimeSettings();

    if (!isPausedTime(new Date(), pausedDate, specificPausedTimes)) {
      // Allow notification is on make sure that the notification channel is created to send notification
      allowNotifications && createNotificationChannels();
      automatedEmergency && (await checkForBioData());
    }
  } catch (e) {
    console.log(e);
    handleDisconnection();
  }
};

export const checkForBioData = async () => {
  try {
    const recentAndCorrectBioData = await recentBioData();

    if (recentAndCorrectBioData !== null) {
      await handleBioData(recentAndCorrectBioData);
    }
  } catch (e) {
    await updateNotification(
      'Something went wrong',
      'Automated Emergency will retry soon',
    );
  } finally {
    await updateLocation();
  }
};

export const handleBioData = async (recentAndCorrectBioData: IBioData) => {
  try {
    const {pulseData, restingPulseData, movementData} = recentAndCorrectBioData;
    if (pulseData.value || restingPulseData.value || movementData.value) {
      await handlePositiveData(pulseData, restingPulseData, movementData);
      await AsyncStorageService.setItem(
        AsyncStorageEnum.HealthTrigger,
        'false',
      );
      try {
        await recommendationSystem(recentAndCorrectBioData);
      } catch (e) {
        console.log('Error: recommendation system', e);
      }
    } else {
      await updateNotification(
        i18n.t('bioCheck.messages.automatedEmergency'),
        i18n.t('bioCheck.messages.noData'),
        NotificationTypesEnum.NoDataFound,
      );
      await AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'true');
      // navigate to health condition screen while the application is active
      ['active', 'background'].includes(AppState.currentState) &&
        navigate(Screens.HealthConditionError, {healthCheck: true});
    }
  } catch (e: any) {
    handleDisconnection();

    const {status, statusText} = e.response || {
      status: 0,
      statusText: 'Network error',
    };
    console.log('error while sending positive info', status, statusText);
  }
};

export const handlePositiveData = async (
  pulseData: IHealthData,
  restingPulseData: IHealthData,
  movementData: IHealthData,
) => {
  console.log('has positive data or positive info');

  const {positiveInfoPeriod} = await getUserPersistedSettings();
  const positiveInfoResponse = await API.positiveInfo(positiveInfoPeriod);

  const {status, data} = positiveInfoResponse;

  if (!data.success) {
    /*
      Stop foreground services while trying to send positive while emergency is already escalated
    */
    await stopBackgroundFetch();
  }

  if (status === 201) {
    console.log('positive info successfully sent');

    await updateNotification(
      i18n.t('bioCheck.messages.automatedEmergency'),
      i18n.t('bioCheck.messages.infoSend') +
        '<br>💓 ' +
        i18n.t('bioCheck.messages.heartRate') +
        (pulseData.value
          ? pulseData.value + ' bpm'
          : i18n.t('bioCheck.messages.noDataUnit')) +
        ' - 🕑 ' +
        (pulseData.time
          ? new Date(pulseData.time).toLocaleTimeString(
              'en-Us',
              TIME_FORMAT_OPTION,
            )
          : i18n.t('bioCheck.messages.noDataUnit')) +
        '<br>🫀 ' +
        i18n.t('bioCheck.messages.restingHeartRate') +
        (restingPulseData.value
          ? restingPulseData.value + ' bpm'
          : i18n.t('bioCheck.messages.noDataUnit')) +
        ' - 🕑 ' +
        (restingPulseData.time
          ? new Date(restingPulseData.time).toLocaleTimeString(
              'en-Us',
              TIME_FORMAT_OPTION,
            )
          : i18n.t('bioCheck.messages.noDataUnit')) +
        '<br>👟 ' +
        i18n.t('bioCheck.messages.movement.title') +
        (movementData.value
          ? movementData.value + ' ' + i18n.t('bioCheck.messages.movement.unit')
          : i18n.t('bioCheck.messages.noDataUnit')) +
        ' - 🕑 ' +
        (movementData.time
          ? new Date(movementData.time).toLocaleTimeString(
              'en-Us',
              TIME_FORMAT_OPTION,
            )
          : i18n.t('bioCheck.messages.noDataUnit')),
      NotificationTypesEnum.BioCheck,
    );
  }
};

export const handleDisconnection = async () => {
  await updateNotification(
    i18n.t('bioCheck.messages.offline'),
    i18n.t('bioCheck.messages.pleaseComeBackOnline'),
  );
  navigate(Screens.LostConnection as never);
};
