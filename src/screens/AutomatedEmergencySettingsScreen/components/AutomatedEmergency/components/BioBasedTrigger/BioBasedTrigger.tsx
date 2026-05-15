import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Settings, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {isIOS} from '~/utils';
import {
  AutomatedEmergencySettings,
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {IUser} from '~/redux/user/user.slice';
import {updateUser} from '~/redux/user/thunks';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import useBioTriggerValid from '~/hooks/UseBioTriggerValid.hook';
import ToastService from '~/services/Toast.service';
import EnvConfig from '~/services/Env.service';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {Screens} from '~/models/Navigation.model';

import IconChip from '~/components/IconChip';
import IntervalSelect from '~/components/IntervalSelect';
import {HeartPulseIcon} from '~/assets/icons/AppIcons';
import StatusBadge from '../../StatusBadge';
import TriggerToggleRow from '../../TriggerToggleRow';
import triggerStyles from '../../triggerStyles';

type BasedTriggerSwitchStepsType = Pick<
  IUser,
  | 'pulseBasedTriggerIOSHealthPermissions'
  | 'pulseBasedTriggerIOSAppleWatchPaired'
  | 'pulseBasedTriggerConnectedToGoogleFit'
  | 'pulseBasedTriggerBackgroundModesEnabled'
  | 'pulseBasedTriggerGoogleFitAuthenticated'
>;

const defaultPositiveInfoPeriod = 1440;

const BioBasedTrigger = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const {authorizeGoogleFit, isGoogleFitAuthorized, resetGoogleFit} =
    useGoogleFitAuthStatus();
  const {regularPushNotification, positiveInfoPeriod} = useAppSelector(
    automatedEmergencySettingsSelector,
  );
  const {isPlatformConditionsValid} = useBioTriggerValid();

  const [recommendedPeriod, setRecommendedPeriod] = useState<string | null>(
    null,
  );
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const handleRecommendedPeriod = async () => {
      try {
        const period = isIOS
          ? await Settings.get(AsyncStorageEnum.RecommendedPeriod)
          : await AsyncStorageService.getItem(
              AsyncStorageEnum.RecommendedPeriod,
            );
        setRecommendedPeriod(period);
      } catch (error) {
        console.error('Error retrieving recommended period:', error);
        setRecommendedPeriod(null);
      }
    };

    const handleDaysLeft = async () => {
      const startingDateString = isIOS
        ? await Settings.get(AsyncStorageEnum.StartingDate)
        : await AsyncStorageService.getItem(AsyncStorageEnum.StartingDate);
      if (startingDateString) {
        const startingDate = new Date(startingDateString);
        const currentDate = new Date();
        const timeDifferenceMillis =
          currentDate.getTime() - startingDate.getTime();
        const daysDifference = Math.floor(
          timeDifferenceMillis / (1000 * 60 * 60 * 24),
        );
        if (daysDifference < 7) {
          setDaysLeft(7 - daysDifference);
        }
      } else {
        setDaysLeft(7);
      }
    };

    handleRecommendedPeriod();
    handleDaysLeft();

    return () => {
      abortController.abort();
    };
  }, []);

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
      regularPushNotification: false,
      positiveInfoPeriod: positiveInfoPeriod || defaultPositiveInfoPeriod,
    };
    handleUpdateUser(updateData, true);
  }, [handleUpdateUser, positiveInfoPeriod]);

  const handleSpecificTimesNavigation = useCallback(() => {
    navigate(Screens.SpecificTimePaused as never);
  }, [navigate]);

  const showFrequencyToast = useCallback(
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
    },
    [t],
  );

  const handleWarningMessage = useCallback(
    (frequency: number) => {
      Alert.alert(
        t('warningFrequencyMessage.android.title'),
        t('warningFrequencyMessage.android.description'),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {
            text: t('common.setUpPauseTimes'),
            onPress: handleSpecificTimesNavigation,
          },
          {
            text: t('common.ok'),
            onPress: () => {
              handleUpdateUser({positiveInfoPeriod: frequency}, true);
              showFrequencyToast(frequency);
            },
          },
        ],
      );
    },
    [t, handleUpdateUser, handleSpecificTimesNavigation, showFrequencyToast],
  );

  const handleFrequency = useCallback(
    (frequency: number) => {
      if ([180, 360, 540].includes(frequency)) {
        handleWarningMessage(frequency);
      } else {
        handleUpdateUser({positiveInfoPeriod: frequency}, true);
        showFrequencyToast(frequency);
      }
    },
    [handleUpdateUser, handleWarningMessage, showFrequencyToast],
  );

  const handleEmergencyCheckTypeChange = () => {
    dispatch(setEmergencyCheckType('bio'));
  };

  const handleManualEmergencySwitch = (value: boolean) => {
    handleUpdateUser({automatedEmergency: value}, true);
    if (!value) {
      ToastService.success(
        t('emergencyContactsSettings.automatedEmergencySettings.systemOffMessage'),
      );
    }
  };

  const handleBioToggle = (value: boolean) => {
    updateUserDataOnChange();
    handleEmergencyCheckTypeChange();
    handleManualEmergencySwitch(value);
  };

  const handleSwitchChange = useCallback(
    (field: keyof BasedTriggerSwitchStepsType, value: boolean) => {
      if (value) {
        Alert.alert(t('confirmAlert.title'), t('confirmAlert.text'), [
          {
            text: t('common.cancel'),
            onPress: () => handleUpdateUser({[field]: false}),
            style: 'cancel',
          },
          {
            text: t('common.ok'),
            onPress: () => handleUpdateUser({[field]: value}, true),
          },
        ]);
      } else {
        handleUpdateUser({[field]: value}, true);
      }
    },
    [handleUpdateUser, t],
  );

  const handleAuthorizeGoogleFit = useCallback(
    async (value: boolean) => {
      if (value) {
        Alert.alert(t('confirmAlert.title'), t('confirmAlert.text'), [
          {text: t('common.cancel'), style: 'cancel'},
          {
            text: t('common.ok'),
            onPress: async () => {
              const authSuccess = await authorizeGoogleFit();
              if (authSuccess) {
                handleUpdateUser(
                  {pulseBasedTriggerGoogleFitAuthenticated: value},
                  true,
                );
                return;
              }
              ToastService.error('Google Fit authorization was cancelled');
            },
          },
        ]);
      } else {
        await resetGoogleFit();
        handleUpdateUser({pulseBasedTriggerGoogleFitAuthenticated: false}, true);
      }
    },
    [authorizeGoogleFit, handleUpdateUser, resetGoogleFit, t],
  );

  const infoAlert = (titleKey: string, descKey: string) => () =>
    Alert.alert(t(titleKey), t(descKey));

  const description = isIOS
    ? t(
        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.description',
      )
    : t(
        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.description',
      );

  const recommendation = isPlatformConditionsValid ? (
    <Text style={triggerStyles.recommendation}>
      {recommendedPeriod
        ? t('dashboard.automatedEmergency.recommendationMessage', {
            recommendedPeriod,
          })
        : `${t('dashboard.automatedEmergency.recommendationDaysLeft', {
            daysLeft,
          })}${
            daysLeft === 1
              ? t('dashboard.automatedEmergency.day')
              : t('dashboard.automatedEmergency.days')
          }`}
    </Text>
  ) : null;

  return (
    <View style={triggerStyles.card}>
      <View style={triggerStyles.header}>
        <IconChip background="rgba(245, 214, 230, 0.6)" size={36} radius={8}>
          <HeartPulseIcon size={18} color="#C23A7A" />
        </IconChip>
        <Text style={triggerStyles.headerTitle}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.title',
          )}
        </Text>
      </View>
      <StatusBadge active={!!isPlatformConditionsValid} />
      <Text style={triggerStyles.description}>{description}</Text>

      <View>
        <TriggerToggleRow
          label={t(
            'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.turnOn',
          )}
          value={!regularPushNotification}
          onChange={handleBioToggle}
        />
        {regularPushNotification ? (
          <Text style={triggerStyles.warning}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.warning',
            )}
          </Text>
        ) : null}

        {!regularPushNotification && isIOS ? (
          <TriggerToggleRow
            divider
            label={t(
              'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.title',
            )}
            value={!!user.pulseBasedTriggerIOSAppleWatchPaired}
            onChange={value =>
              handleSwitchChange('pulseBasedTriggerIOSAppleWatchPaired', value)
            }
            onInfoPress={infoAlert(
              'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.alertTitle',
              'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.alertDescription',
            )}
          />
        ) : null}

        {!regularPushNotification && !isIOS ? (
          <>
            <TriggerToggleRow
              divider
              label={t(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.title',
              )}
              value={isGoogleFitAuthorized}
              onChange={handleAuthorizeGoogleFit}
              onInfoPress={infoAlert(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertTitle1',
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertDescription1',
              )}
            />
            <TriggerToggleRow
              divider
              label={t(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.connect',
              )}
              value={!!user.pulseBasedTriggerConnectedToGoogleFit}
              onChange={value =>
                handleSwitchChange('pulseBasedTriggerConnectedToGoogleFit', value)
              }
              onInfoPress={infoAlert(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertTitle2',
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertDescription2',
              )}
            />
            <TriggerToggleRow
              divider
              label={t(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.title',
              )}
              value={!!user.pulseBasedTriggerBackgroundModesEnabled}
              onChange={value =>
                handleSwitchChange('pulseBasedTriggerBackgroundModesEnabled', value)
              }
              onInfoPress={infoAlert(
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.alertTitle',
                'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.alertDescription',
              )}
            />
          </>
        ) : null}
      </View>

      {!regularPushNotification && !isIOS ? (
        <>
          <Text style={triggerStyles.frequencyLabel}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.frequency',
            )}
          </Text>
          <IntervalSelect
            type="bio"
            onValueChange={itemValue => handleFrequency(+itemValue)}
            selectedValue={`${positiveInfoPeriod}`}
          />
        </>
      ) : null}

      {recommendation}
    </View>
  );
};

export default BioBasedTrigger;
