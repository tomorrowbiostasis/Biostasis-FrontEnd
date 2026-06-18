import React, {useCallback, useEffect, useState} from 'react';
import {
  InteractionManager,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {
  automatedEmergencySettingsSelector,
  AutomatedEmergencySettings,
  userSelector,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import {timeFromNow} from '~/services/Date.service';
import isBatteryOptimizationOn from '~/services/Battery.service';
import ToastService from '~/services/Toast.service';
import {isAndroid} from '~/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Screens} from '~/models/Navigation.model';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';

import ScreenHeader from '~/components/ScreenHeader';
import {
  BioEmergencySettingsFillEcgWave,
  BioEmergencySettingsFillInfo,
  BioHomeFillBroadcastSignal,
  BioHomeFillCircleCheck,
  BioSettingsFillShieldCheck,
} from '~/assets/icons/BiostasisIcons';
import AutomatedEmergency from './components/AutomatedEmergency';
import SleepSchedulePanel from './components/SleepSchedulePanel/SleepSchedulePanel';
import PauseEmergencyPanel from '~/screens/SpecificTimePausedScreen/components/PauseEmergencyPanel/PauseEmergencyPanel';
import SpecificTimesPanel from '~/screens/SpecificTimePausedScreen/components/SpecificTimesPanel/SpecificTimesPanel';
import {useTimeFormat} from '~/screens/SpecificTimePausedScreen/hooks/UseTimeFormat.hook';
import GuidedMonitoringSetupSheet, {
  GuidedMonitoringMode,
  SleepSetupChoice,
} from './components/GuidedMonitoringSetupSheet/GuidedMonitoringSetupSheet';
import styles from './styles';
import {TIME_BASED_CHECK_IN_INTERVAL_MINUTES} from './constants';

const defaultFrequencyOfRegularNotification =
  TIME_BASED_CHECK_IN_INTERVAL_MINUTES;
const defaultPositiveInfoPeriod = 1440;

const HOW_IT_WORKS_STEPS = [
  {
    icon: <BioHomeFillBroadcastSignal />,
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step1Desc',
  },
  {
    icon: <BioEmergencySettingsFillEcgWave />,
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step2Desc',
  },
  {
    icon: <BioHomeFillCircleCheck />,
    titleKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step3Title',
    descKey:
      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.step3Desc',
  },
];

const AutomatedEmergencySettingsScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  useTimeFormat();

  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const {isSlotPause} = useTimeSlotPauseStatus();
  const {user} = useAppSelector(userSelector);
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const {automatedEmergency, readManual} = useAppSelector(
    automatedEmergencySettingsSelector,
  );
  const monitoringEnabledFromBackend = !!automatedEmergency;
  const contactsReady = hasContacts && areContactsEnabled;
  const setupComplete = contactsReady && readManual;
  const effectiveMonitoringOn = monitoringEnabledFromBackend && setupComplete;
  const showSetupEducation = contactsReady && !effectiveMonitoringOn;
  const timeBasedActive =
    effectiveMonitoringOn && user.regularPushNotification === true;
  const bioBasedActive =
    effectiveMonitoringOn && user.regularPushNotification === false;
  const [showSetupSheet, setShowSetupSheet] = useState(false);
  const [sleepScheduleKey, setSleepScheduleKey] = useState(0);
  const [pendingSetupRedirect, setPendingSetupRedirect] = useState(false);

  const isPaused = !!pausedDate || !!isSlotPause;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch(getUser());
    });

    return () => task.cancel();
  }, [dispatch]);

  useEffect(() => {
    if (pausedDate && pausedDate.timestamp < Date.now()) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    }
  }, [dispatch, pausedDate]);

  useEffect(() => {
    isAndroid &&
      effectiveMonitoringOn &&
      user.pulseBasedTriggerBackgroundModesEnabled &&
      isBatteryOptimizationOn();
  }, [effectiveMonitoringOn, user.pulseBasedTriggerBackgroundModesEnabled]);

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const handleSetupComplete = useCallback(
    async ({
      mode,
      frequencyOfRegularNotification,
      positiveInfoPeriod,
      sleepChoice,
    }: {
      mode: GuidedMonitoringMode;
      frequencyOfRegularNotification: number;
      positiveInfoPeriod: number;
      sleepChoice: SleepSetupChoice;
    }) => {
      const updateData: AutomatedEmergencySettings = {
        automatedEmergency: true,
        readManual: true,
        regularPushNotification: mode === 'time',
        frequencyOfRegularNotification:
          mode === 'time'
            ? frequencyOfRegularNotification
            : user.frequencyOfRegularNotification ||
              defaultFrequencyOfRegularNotification,
        positiveInfoPeriod:
          mode === 'bio'
            ? positiveInfoPeriod
            : user.positiveInfoPeriod || defaultPositiveInfoPeriod,
      };

      await dispatch(updateUser(updateData));
      dispatch(setEmergencyCheckType(mode));

      if (mode === 'time') {
        await resetRecommendationSystem(AsyncStorage);
      }

      if (sleepChoice === 'enable') {
        setSleepScheduleKey(k => k + 1);
      }

      setPendingSetupRedirect(true);
      setShowSetupSheet(false);
    },
    [
      dispatch,
      user.frequencyOfRegularNotification,
      user.positiveInfoPeriod,
    ],
  );

  const handleSetupSheetDismissComplete = useCallback(() => {
    if (!pendingSetupRedirect) {
      return;
    }

    setPendingSetupRedirect(false);
    dispatch(getUser());
    ToastService.success(
      t(
        'emergencyContactsSettings.automatedEmergencySettings.setupFlow.enabledToast',
      ),
    );
    navigate(Screens.Tabs as never, {screen: Screens.Home} as never);
  }, [dispatch, navigate, pendingSetupRedirect, t]);

  const handleSetupSheetDismiss = useCallback(() => {
    setPendingSetupRedirect(false);
    setShowSetupSheet(false);
  }, []);

  const handleTurnOffMonitoring = useCallback(async () => {
    handleUpdateUser({automatedEmergency: false}, true);
    dispatch(setAutomatedEmergencyPause(null));
    await resetRecommendationSystem(AsyncStorage);
    setShowSetupSheet(false);
    ToastService.success(
      t(
        'emergencyContactsSettings.automatedEmergencySettings.systemOffMessage',
      ),
    );
  }, [dispatch, handleUpdateUser, t]);

  const setupStatus = (() => {
    if (!contactsReady) {
      return {
        tone: 'needsSetup' as const,
        title: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.contacts.title',
        ),
        subtitle: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.contacts.subtitle',
        ),
        actionLabel: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.contacts.action',
        ),
        onActionPress: () =>
          navigate(Screens.EmergencyContactSettings as never),
      };
    }

    if (!effectiveMonitoringOn) {
      return {
        tone: 'ready' as const,
        title: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.ready.title',
        ),
        subtitle: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.ready.subtitle',
        ),
        actionLabel: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.ready.action',
        ),
        onActionPress: () => setShowSetupSheet(true),
      };
    }

    if (!timeBasedActive && !bioBasedActive) {
      return {
        tone: 'ready' as const,
        title: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.choose.title',
        ),
        subtitle: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.choose.subtitle',
        ),
        actionLabel: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.choose.action',
        ),
        onActionPress: undefined,
      };
    }

    const pauseUntil = Math.max(
      pausedDate?.timestamp ?? 0,
      isSlotPause ?? 0,
    );
    if (pauseUntil > Date.now()) {
      return {
        tone: 'active' as const,
        title: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.pausedTitle',
        ),
        subtitle: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.pausedSubtitle',
          {time: timeFromNow(pauseUntil)},
        ),
        actionLabel: t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.turnOff',
        ),
        onActionPress: handleTurnOffMonitoring,
      };
    }

    return {
      tone: 'active' as const,
      title: t(
        'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.title',
      ),
      subtitle: bioBasedActive
        ? t(
            'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleBio',
          )
        : t(
            'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleTime',
          ),
      actionLabel: t(
        'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.turnOff',
      ),
      onActionPress: handleTurnOffMonitoring,
    };
  })();

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
        <View
          style={[
            styles.statusCard,
            setupStatus.tone === 'active'
              ? styles.statusCardActive
              : styles.statusCardReady,
          ]}>
          <View
            style={[
              styles.statusIcon,
              setupStatus.tone === 'active'
                ? styles.statusIconActive
                : styles.statusIconReady,
            ]}>
            {setupStatus.tone === 'active' ? (
              <BioHomeFillCircleCheck size={36} />
            ) : (
              <BioSettingsFillShieldCheck size={36} />
            )}
          </View>
          <View style={styles.statusTextBlock}>
            <Text style={styles.statusEyebrow}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.guidance.status.eyebrow',
              )}
            </Text>
            <Text style={styles.statusTitle}>{setupStatus.title}</Text>
            <Text style={styles.statusSubtitle}>{setupStatus.subtitle}</Text>
          </View>
          {setupStatus.actionLabel &&
          setupStatus.onActionPress &&
          !showSetupEducation ? (
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.statusAction}
              onPress={setupStatus.onActionPress}
              accessibilityRole="button">
              <Text style={styles.statusActionText}>
                {setupStatus.actionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {showSetupEducation ? (
          <>
            <View style={styles.howCard}>
              <View style={styles.howHeader}>
                <BioEmergencySettingsFillInfo />
                <View style={styles.howHeaderText}>
                  <Text style={styles.howTitle}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.title',
                    )}
                  </Text>
                  <Text style={styles.howDescription}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.howItWorks.intro',
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.steps}>
                {HOW_IT_WORKS_STEPS.map(stepItem => (
                  <View key={stepItem.titleKey} style={styles.stepRow}>
                    <View style={styles.stepIconWrap}>{stepItem.icon}</View>
                    <View style={styles.stepText}>
                      <Text style={styles.stepTitle}>
                        {t(stepItem.titleKey)}
                      </Text>
                      <Text style={styles.stepDesc}>
                        {t(stepItem.descKey)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.understandButton}
              onPress={() => setShowSetupSheet(true)}
              accessibilityRole="button">
              <Text style={styles.understandButtonText}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.guidance.status.ready.action',
                )}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}

        {effectiveMonitoringOn ? (
          <>
            <PauseEmergencyPanel />
            {timeBasedActive ? (
              <View
                style={[
                  styles.activeConfiguration,
                  isPaused ? styles.dimmed : undefined,
                ]}
                pointerEvents={isPaused ? 'none' : 'auto'}>
                <AutomatedEmergency />
                {contactsReady ? <SpecificTimesPanel /> : null}
              </View>
            ) : null}
            {contactsReady ? (
              <SleepSchedulePanel refreshKey={sleepScheduleKey} required />
            ) : null}
          </>
        ) : null}
      </ScrollView>

      <GuidedMonitoringSetupSheet
        visible={showSetupSheet}
        defaultPositiveInfoPeriod={
          user.positiveInfoPeriod || defaultPositiveInfoPeriod
        }
        onDismiss={handleSetupSheetDismiss}
        onDismissComplete={handleSetupSheetDismissComplete}
        onComplete={handleSetupComplete}
      />
    </View>
  );
};

export default AutomatedEmergencySettingsScreen;
