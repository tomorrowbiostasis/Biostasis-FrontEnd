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
import {isSleepPaused} from './SleepSchedule.service';
import {isAirplaneModeOn} from './DeviceSignals.service';
import {IHealthData} from './BioCheck.types';
import {recommendationSystem} from './Recommendation.service';
import {AppState} from 'react-native';
import {store} from '~/redux/store';
import {setHealthData} from '~/redux/health/health.slice';

let bioCheckMutex = false;

const safeParseCount = (raw: string | null): number => {
  if (!raw) return 0;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export const startBioCheck = async () => {
  try {
    const response = await getUserPersistedSettings();
    const {automatedEmergency, allowNotifications} = response;
    console.log('-> BIO CHECK STARTED');

    const airplaneMode = await isAirplaneModeOn();
    if (airplaneMode) {
      console.log(
        '-> BIO CHECK SKIPPED (airplane mode — no connectivity to deliver emergency)',
      );
      return;
    }

    const {pausedDate, specificPausedTimes} = await getTimeSettings();

    const sleepPaused = await isSleepPaused();

    const isPaused =
      isPausedTime(new Date(), pausedDate, specificPausedTimes) || sleepPaused;

    if (!isPaused) {
      allowNotifications && createNotificationChannels();
      automatedEmergency && (await checkForBioData());
    } else {
      console.log('-> BIO CHECK SKIPPED (paused or sleep mode)');
      await AsyncStorageService.setItem(
        AsyncStorageEnum.ConsecutiveNoDataCount,
        '0',
      );
    }
  } catch (e) {
    console.log('startBioCheck error:', e);
    await handleDisconnection();
  }
};

export const checkForBioData = async () => {
  try {
    const recentAndCorrectBioData = await recentBioData();

    const emptyBioData: IBioData = {
      pulseData: {value: 0, time: ''},
      restingPulseData: {value: 0, time: ''},
      movementData: {value: 0, time: ''},
    };

    await handleBioData(recentAndCorrectBioData ?? emptyBioData);
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
  if (bioCheckMutex) {
    console.log('-> BIO CHECK: skipping (already in progress)');
    return;
  }
  bioCheckMutex = true;

  try {
    const {pulseData, restingPulseData, movementData} =
      recentAndCorrectBioData;
    if (pulseData.value || restingPulseData.value || movementData.value) {
      // Mirror the iOS HealthKit emitter: on a positive read, push the values
      // into the health slice the UI renders from. Android's Google Fit path
      // otherwise never populates state.health, so the dashboard stayed empty
      // even with a successful fetch. Empty reads don't dispatch (last value
      // persists), matching the iOS emitter's behaviour.
      const toEndDate = (time: IHealthData['time']): number | null => {
        if (!time) {
          return null;
        }
        const ms = new Date(time).getTime();
        return Number.isNaN(ms) ? null : ms;
      };
      store.dispatch(
        setHealthData({
          heartRate: pulseData.value,
          restingHeartRate: restingPulseData.value,
          steps: movementData.value,
          totalSteps: movementData.value,
          heartRateEndDate: toEndDate(pulseData.time),
          restingHeartRateEndDate: toEndDate(restingPulseData.time),
          stepsEndDate: toEndDate(movementData.time),
        }),
      );
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
      const rawCount = await AsyncStorageService.getItem(
        AsyncStorageEnum.ConsecutiveNoDataCount,
      );
      const noDataCount = safeParseCount(rawCount);

      if (noDataCount < 1) {
        await AsyncStorageService.setItem(
          AsyncStorageEnum.ConsecutiveNoDataCount,
          String(noDataCount + 1),
        );
        await updateNotification(
          i18n.t('bioCheck.messages.wearableSyncWarning'),
          i18n.t('bioCheck.messages.wearableSyncWarningBody'),
          NotificationTypesEnum.WearableSyncWarning,
        );
        console.log(
          '-> BIO CHECK: no data (strike ' +
            (noDataCount + 1) +
            ') — warning sent, not escalating yet',
        );
      } else {
        await AsyncStorageService.setItem(
          AsyncStorageEnum.ConsecutiveNoDataCount,
          '0',
        );
        await updateNotification(
          i18n.t('bioCheck.messages.automatedEmergency'),
          i18n.t('bioCheck.messages.noData'),
          NotificationTypesEnum.NoDataFound,
        );
        await AsyncStorageService.setItem(
          AsyncStorageEnum.HealthTrigger,
          'true',
        );
        if (['active', 'background'].includes(AppState.currentState)) {
          navigate(Screens.HealthConditionError, {healthCheck: true});
        }
      }
    }
  } catch (e: any) {
    if (e?.response) {
      const {status, statusText} = e.response;
      console.log('error while sending positive info', status, statusText);
    } else {
      console.log('handleBioData error:', e);
    }
    await handleDisconnection();
  } finally {
    bioCheckMutex = false;
  }
};

export const handlePositiveData = async (
  pulseData: IHealthData,
  restingPulseData: IHealthData,
  movementData: IHealthData,
) => {
  console.log('has positive data or positive info');
  await AsyncStorageService.setItem(
    AsyncStorageEnum.ConsecutiveNoDataCount,
    '0',
  );

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
              undefined,
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
              undefined,
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
              undefined,
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
  if (['active', 'background'].includes(AppState.currentState)) {
    navigate(Screens.LostConnection as never);
  }
};
