import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {
  automatedEmergencySettingsSelector,
  AutomatedEmergencySettings,
  userSelector,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';
import {getSleepSchedule} from '~/services/SleepSchedule.service';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import isBatteryOptimizationOn from '~/services/Battery.service';
import ToastService from '~/services/Toast.service';
import {isAndroid} from '~/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenHeader from '~/components/ScreenHeader';
import IconChip from '~/components/IconChip';
import Toggle from '~/components/Toggle';
import {HelpCircleIcon} from '~/assets/icons/AppIcons';
import AutomatedEmergency from './components/AutomatedEmergency';
import SleepSchedulePanel from './components/SleepSchedulePanel/SleepSchedulePanel';
import SleepScheduleBottomSheet from './components/SleepSchedulePanel/SleepScheduleBottomSheet';
import PauseEmergencyPanel from '~/screens/SpecificTimePausedScreen/components/PauseEmergencyPanel/PauseEmergencyPanel';
import SpecificTimesPanel from '~/screens/SpecificTimePausedScreen/components/SpecificTimesPanel/SpecificTimesPanel';
import {useTimeFormat} from '~/screens/SpecificTimePausedScreen/hooks/UseTimeFormat.hook';
import styles from './styles';

const STEPS = [
  {
    chipBg: 'rgba(39, 174, 114, 0.06)',
    numColor: '#2ABFA0',
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Desc',
  },
  {
    chipBg: 'rgba(45, 107, 228, 0.06)',
    numColor: '#2D6BE4',
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Desc',
  },
  {
    chipBg: 'rgba(229, 55, 58, 0.06)',
    numColor: '#E5373A',
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step3Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step3Desc',
  },
];

const AutomatedEmergencySettingsScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  useTimeFormat();

  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const {isSlotPause} = useTimeSlotPauseStatus();
  const {user} = useAppSelector(userSelector);
  const {automatedEmergency, readManual} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  const [showSleepSheet, setShowSleepSheet] = useState(false);
  const [sleepScheduleKey, setSleepScheduleKey] = useState(0);
  const prevAutomatedEmergency = useRef(automatedEmergency);

  const isPaused = !!pausedDate || !!isSlotPause;

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (!prevAutomatedEmergency.current && automatedEmergency) {
      getSleepSchedule().then(schedule => {
        if (!schedule.enabled) {
          setShowSleepSheet(true);
        }
      });
    }
    prevAutomatedEmergency.current = automatedEmergency;
  }, [automatedEmergency]);

  useEffect(() => {
    if (pausedDate && pausedDate.timestamp < Date.now()) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    }
  }, [dispatch, pausedDate]);

  useEffect(() => {
    isAndroid &&
      automatedEmergency &&
      user.pulseBasedTriggerBackgroundModesEnabled &&
      isBatteryOptimizationOn();
  }, [automatedEmergency, user.pulseBasedTriggerBackgroundModesEnabled]);

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const handleManualEmergencySwitch = async (value: boolean) => {
    handleUpdateUser({automatedEmergency: value}, true);
    if (!value) {
      await resetRecommendationSystem(AsyncStorage);
      ToastService.success(
        t('emergencyContactsSettings.automatedEmergencySettings.systemOffMessage'),
      );
    }
  };

  const handleReadManualSwitchPress = (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {readManual: value};
    if (!value) {
      updateData.automatedEmergency = false;
    }
    handleUpdateUser(updateData, true);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('emergencyContactsSettings.automatedEmergencySettings.title')}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* How it works */}
        <View style={styles.howCard}>
          <View style={styles.howHeader}>
            <IconChip background="rgba(243, 222, 199, 0.6)" size={36} radius={8}>
              <HelpCircleIcon size={18} color="#B86E2D" />
            </IconChip>
            <Text style={styles.howTitle}>
              {t('emergencyContactsSettings.automatedEmergencySettings.howItWorks.title')}
            </Text>
          </View>
          <Text style={styles.howDescription}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.howItWorks.intro',
            )}
          </Text>
          <View style={styles.steps}>
            {STEPS.map((step, index) => (
              <View key={step.titleKey} style={styles.stepRow}>
                <View style={[styles.stepNum, {backgroundColor: step.chipBg}]}>
                  <Text style={[styles.stepNumText, {color: step.numColor}]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
                  <Text style={styles.stepDesc}>{t(step.descKey)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Enable toggles */}
        <View style={styles.togglesCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.confirmReadManual',
              )}
            </Text>
            <Toggle value={!!readManual} onChange={handleReadManualSwitchPress} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.enableAutomatedEmergency',
              )}
            </Text>
            <Toggle
              value={!!automatedEmergency}
              disabled={!readManual}
              onChange={handleManualEmergencySwitch}
            />
          </View>
        </View>

        {automatedEmergency ? (
          <View
            style={isPaused ? styles.dimmed : undefined}
            pointerEvents={isPaused ? 'none' : 'auto'}>
            <AutomatedEmergency />
          </View>
        ) : null}

        {automatedEmergency ? (
          <SleepSchedulePanel refreshKey={sleepScheduleKey} />
        ) : null}

        <PauseEmergencyPanel />
        <SpecificTimesPanel />
      </ScrollView>

      <SleepScheduleBottomSheet
        visible={showSleepSheet}
        onDismiss={() => {
          setShowSleepSheet(false);
          setSleepScheduleKey(k => k + 1);
        }}
      />
    </View>
  );
};

export default AutomatedEmergencySettingsScreen;
