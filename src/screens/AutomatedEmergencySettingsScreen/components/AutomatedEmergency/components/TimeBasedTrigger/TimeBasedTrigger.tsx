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
import EnvConfig from '~/services/Env.service';

import IconChip from '~/components/IconChip';
import IntervalSelect from '~/components/IntervalSelect';
import {ClockIcon} from '~/assets/icons/AppIcons';
import StatusBadge from '../../StatusBadge';
import TriggerToggleRow from '../../TriggerToggleRow';
import triggerStyles from '../../triggerStyles';

const defaultFrequencyOfRegularNotification = 120;

const TimeBasedTrigger = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {regularPushNotification, frequencyOfRegularNotification} =
    useAppSelector(automatedEmergencySettingsSelector);

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
        frequencyOfRegularNotification || defaultFrequencyOfRegularNotification,
    };
    handleUpdateUser(updateData, true);
  }, [handleUpdateUser, frequencyOfRegularNotification]);

  const handleFrequency = useCallback(
    (frequency: number) => {
      ToastService.success(
        t('emergencyContactsSettings.automatedEmergencySettings.frequencySet') +
          ' ' +
          (EnvConfig.DEV
            ? t(
                'emergencyContactsSettings.automatedEmergencySettings.time.minutes',
                {count: frequency},
              )
            : t(
                'emergencyContactsSettings.automatedEmergencySettings.time.hours',
                {count: frequency / 60},
              )),
        {visibilityTime: 1000},
      );
      handleUpdateUser({frequencyOfRegularNotification: frequency}, true);
    },
    [handleUpdateUser, t],
  );

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
    <View style={triggerStyles.card}>
      <View style={triggerStyles.header}>
        <IconChip background="rgba(215, 240, 236, 0.6)" size={36} radius={8}>
          <ClockIcon size={18} color="#2C8F86" />
        </IconChip>
        <Text style={triggerStyles.headerTitle}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.title',
          )}
        </Text>
      </View>
      <StatusBadge active={!!regularPushNotification} />
      <Text style={triggerStyles.description}>
        {t(
          'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.description',
        )}
      </Text>

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

      {regularPushNotification ? (
        <>
          <Text style={triggerStyles.frequencyLabel}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.frequency',
            )}
          </Text>
          <IntervalSelect
            selectedValue={`${frequencyOfRegularNotification}`}
            type="time"
            onValueChange={itemValue => handleFrequency(+itemValue)}
          />
        </>
      ) : null}
    </View>
  );
};

export default TimeBasedTrigger;
