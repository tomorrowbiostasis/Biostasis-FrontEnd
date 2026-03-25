/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';

import {Text} from 'native-base';
import Container from '~/components/Container';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';
import styles from './styles';
import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {
  automatedEmergencySettingsSelector,
  AutomatedEmergencySettings,
  userSelector,
  userLoading,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';

import ToastService from '~/services/Toast.service';
import isBatteryOptimizationOn from '~/services/Battery.service';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AutomatedEmergency from './components/AutomatedEmergency';
import SleepSchedulePanel from './components/SleepSchedulePanel/SleepSchedulePanel';
import SleepScheduleBottomSheet from './components/SleepSchedulePanel/SleepScheduleBottomSheet';
import {getSleepSchedule} from '~/services/SleepSchedule.service';
import PauseEmergencyPanel from '~/screens/SpecificTimePausedScreen/components/PauseEmergencyPanel/PauseEmergencyPanel';
import SpecificTimesPanel from '~/screens/SpecificTimePausedScreen/components/SpecificTimesPanel/SpecificTimesPanel';
import {useTimeFormat} from '~/screens/SpecificTimePausedScreen/hooks/UseTimeFormat.hook';
import {isAndroid} from '~/utils';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS = [
  {
    icon: 'watch' as const,
    iconLib: 'feather' as const,
    color: '#4CAF50',
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Desc',
  },
  {
    icon: 'shield-check' as const,
    iconLib: 'mci' as const,
    color: '#2196F3',
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Desc',
  },
  {
    icon: 'alert-circle' as const,
    iconLib: 'feather' as const,
    color: '#F44336',
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

  const loading = useAppSelector(userLoading);
  const [showSleepSheet, setShowSleepSheet] = useState(false);
  const [sleepScheduleKey, setSleepScheduleKey] = useState(0);
  const prevAutomatedEmergency = useRef(automatedEmergency);

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

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const handleManualEmergencySwitch = async (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      automatedEmergency: value,
    };
    handleUpdateUser(updateData, true);
    if (!value) {
      await resetRecommendationSystem(AsyncStorage);
      ToastService.success(
        t(
          'emergencyContactsSettings.automatedEmergencySettings.systemOffMessage',
        ),
      );
    }
  };

  useEffect(() => {
    if (pausedDate && pausedDate.timestamp < Date.now()) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    }
  }, [dispatch, pausedDate]);

  const handleReadManualSwitchPress = (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      readManual: value,
    };
    if (!value) {
      updateData.automatedEmergency = false;
    }
    handleUpdateUser(updateData, true);
  };

  useEffect(() => {
    isAndroid &&
      automatedEmergency &&
      user.pulseBasedTriggerBackgroundModesEnabled &&
      isBatteryOptimizationOn();
  }, [automatedEmergency, user.pulseBasedTriggerBackgroundModesEnabled]);

  return (
    <Container
      loading={loading}
      title={t('emergencyContactsSettings.automatedEmergencySettings.title')}
      type={'static'}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      {/* <View style={styles.curveElement} /> */}
      {/* Solve problem with scrollView IOS */}
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          bounces={false}
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <IconFeather name={'settings'} size={26} style={styles.icon} />
              <Text style={styles.panelTitle} fontWeight={700}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.enableSystemTitle',
                )}
              </Text>
            </View>
            <View style={styles.lineStyle} />

            <View style={styles.howItWorksContainer}>
              <Text style={styles.howItWorksTitle}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.howItWorks.title',
                )}
              </Text>
              {STEPS.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepNumberCircle,
                      {backgroundColor: step.color + '18'},
                    ]}>
                    {step.iconLib === 'feather' ? (
                      <IconFeather
                        name={step.icon}
                        size={18}
                        color={step.color}
                      />
                    ) : (
                      <IconMaterialCommunityIcons
                        name={step.icon}
                        size={18}
                        color={step.color}
                      />
                    )}
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
                    <Text style={styles.stepDescription}>
                      {t(step.descKey)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.panelBody}>
              <SwitchButton
                value={readManual}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.confirmReadManual',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={handleReadManualSwitchPress}
              />
              <SwitchButton
                value={automatedEmergency}
                disabled={!readManual}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.enableAutomatedEmergency',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={handleManualEmergencySwitch}
                paused={!!pausedDate || !!isSlotPause}
              />
            </View>
          </View>

          {automatedEmergency && (
            <View
              style={isSlotPause || pausedDate ? styles.opacity : null}
              pointerEvents={isSlotPause || pausedDate ? 'none' : 'auto'}>
              <AutomatedEmergency />
            </View>
          )}

          {automatedEmergency && <SleepSchedulePanel refreshKey={sleepScheduleKey} />}

          <PauseEmergencyPanel />
          <SpecificTimesPanel />
        </ScrollView>
      </SafeAreaView>
      <SleepScheduleBottomSheet
        visible={showSleepSheet}
        onDismiss={() => {
          setShowSleepSheet(false);
          setSleepScheduleKey(k => k + 1);
        }}
      />
    </Container>
  );
};

export default AutomatedEmergencySettingsScreen;
