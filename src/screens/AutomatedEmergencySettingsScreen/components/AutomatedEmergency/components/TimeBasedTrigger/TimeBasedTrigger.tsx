import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  AutomatedEmergencySettings,
  automatedEmergencySettingsSelector,
} from '~/redux/user/selectors';
import {IUser} from '~/redux/user/user.slice';
import {updateUser} from '~/redux/user/thunks';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import ToastService from '~/services/Toast.service';

import {BioEmergencySettingsFillClock} from '~/assets/icons/BiostasisIcons';
import StatusBadge from '../../StatusBadge';
import TriggerToggleRow from '../../TriggerToggleRow';
import triggerStyles from '../../triggerStyles';
import {TIME_BASED_CHECK_IN_INTERVAL_MINUTES} from '../../../../constants';

const TimeBasedTrigger = ({embedded = false}: {embedded?: boolean}) => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {regularPushNotification} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const updateUserDataOnChange = useCallback(() => {
    const updateData: IUser = {
      regularPushNotification: true,
      frequencyOfRegularNotification:
        TIME_BASED_CHECK_IN_INTERVAL_MINUTES,
    };
    handleUpdateUser(updateData, true);
  }, [handleUpdateUser]);

  const handleEmergencyCheckTypeChange = async () => {
    await resetRecommendationSystem(AsyncStorage);
    dispatch(setEmergencyCheckType('time'));
  };

  const handleManualEmergencySwitch = (value: boolean) => {
    handleUpdateUser({automatedEmergency: value}, true);
    if (!value) {
      ToastService.success(
        t('emergencyContactsSettings.automatedEmergencySettings.systemOffMessage'),
      );
    }
  };

  const handleTimeToggle = (value: boolean) => {
    updateUserDataOnChange();
    handleEmergencyCheckTypeChange();
    handleManualEmergencySwitch(value);
  };

  return (
    <View style={[triggerStyles.card, embedded && triggerStyles.embeddedCard]}>
      <View style={triggerStyles.header}>
        <BioEmergencySettingsFillClock />
        <Text style={triggerStyles.headerTitle}>
          {t(
            embedded
              ? 'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.configurationTitle'
              : 'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.title',
          )}
        </Text>
      </View>
      {!embedded ? (
        <>
          <StatusBadge
            active={!!regularPushNotification}
            activeLabel={t(
              'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.monitoringActive',
            )}
            inactiveLabel={t(
              'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.monitoringInactive',
            )}
          />
          <Text style={triggerStyles.description}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.description',
            )}
          </Text>
        </>
      ) : null}

      {!embedded ? (
        <>
          <TriggerToggleRow
            label={t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.turnOn',
            )}
            value={!!regularPushNotification}
            onChange={handleTimeToggle}
          />
          {!regularPushNotification ? (
            <Text style={triggerStyles.warning}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.warning',
              )}
            </Text>
          ) : null}
        </>
      ) : null}

      {regularPushNotification || embedded ? (
        <View style={triggerStyles.fixedIntervalBox}>
          <Text style={triggerStyles.frequencyLabel}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.frequency',
            )}
          </Text>
          <Text style={triggerStyles.fixedIntervalValue}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.fixedInterval',
            )}
          </Text>
          <Text style={triggerStyles.recommendation}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.movementNote',
            )}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default TimeBasedTrigger;
