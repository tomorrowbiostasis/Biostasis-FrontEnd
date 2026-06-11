import React, {useCallback, useEffect, useState} from 'react';
import {
  InteractionManager,
  Platform,
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
import isBatteryOptimizationOn from '~/services/Battery.service';
import ToastService from '~/services/Toast.service';
import {isAndroid} from '~/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Screens} from '~/models/Navigation.model';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';

import ScreenHeader from '~/components/ScreenHeader';
import {
  BioEmergencySettingsFillClock,
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
import {hasReceivedHealthData} from './components/GuidedMonitoringSetupSheet/GuidedMonitoringSetupSheet.logic';
import styles from './styles';
import GoogleIcon from '~/assets/icons/GoogleIcon';
import {ChevronRightIcon, HeartPulseIcon} from '~/assets/icons/AppIcons';
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
  const health = useAppSelector(state => state.health.data);
  const healthDataReceived = hasReceivedHealthData(health);
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
  const bioSourceLabel = t(
    Platform.OS === 'ios'
      ? 'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceBioIos'
      : 'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceBioAndroid',
  );

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

  const handleSwitchToTimeBased = useCallback(async () => {
    handleUpdateUser(
      {
        automatedEmergency: true,
        readManual: true,
        regularPushNotification: true,
        frequencyOfRegularNotification:
          user.frequencyOfRegularNotification ||
          defaultFrequencyOfRegularNotification,
      },
      true,
    );
    await resetRecommendationSystem(AsyncStorage);
    dispatch(setEmergencyCheckType('time'));
    ToastService.success(
      t(
        'emergencyContactsSettings.automatedEmergencySettings.guidance.activeActions.switchedToTime',
      ),
    );
  }, [dispatch, handleUpdateUser, t, user.frequencyOfRegularNotification]);

  const handleSwitchToBioBased = useCallback(() => {
    if (!healthDataReceived) {
      ToastService.info(
        t(
          'emergencyContactsSettings.automatedEmergencySettings.guidance.activeActions.bioUnavailableTitle',
        ),
        {
          text2: t(
            'emergencyContactsSettings.automatedEmergencySettings.guidance.activeActions.bioUnavailableMessage',
          ),
        },
      );
      return;
    }

    handleUpdateUser(
      {
        automatedEmergency: true,
        readManual: true,
        regularPushNotification: false,
        positiveInfoPeriod:
          user.positiveInfoPeriod || defaultPositiveInfoPeriod,
      },
      true,
    );
    dispatch(setEmergencyCheckType('bio'));
    ToastService.success(
      t(
        'emergencyContactsSettings.automatedEmergencySettings.guidance.activeActions.switchedToBio',
      ),
    );
  }, [
    dispatch,
    handleUpdateUser,
    healthDataReceived,
    t,
    user.positiveInfoPeriod,
  ]);

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
        ) : effectiveMonitoringOn ? (
          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.howCard}
            onPress={() => setShowSetupSheet(true)}
            accessibilityRole="button">
            <View style={styles.howHeader}>
              <BioEmergencySettingsFillInfo />
              <View style={styles.howHeaderText}>
                <Text style={styles.howTitle}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.guidance.howCompleted',
                  )}
                </Text>
                <Text style={styles.howCompletedSubtitle}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.guidance.howCompletedSubtitle',
                  )}
                </Text>
              </View>
              <ChevronRightIcon
                size={18}
                color="#6B7A8E"
                style={styles.howChevron}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        {effectiveMonitoringOn ? (
          <>
            <PauseEmergencyPanel />
            <View
              style={[
                styles.activeConfiguration,
                isPaused ? styles.dimmed : undefined,
              ]}
              pointerEvents={isPaused ? 'none' : 'auto'}>
              <View style={styles.activeHeader}>
                {bioBasedActive ? (
                  <BioEmergencySettingsFillEcgWave />
                ) : (
                  <BioEmergencySettingsFillClock />
                )}
                <View style={styles.activeHeaderCopy}>
                  <Text style={styles.activeTitle}>
                    {bioBasedActive
                      ? t(
                          'emergencyContactsSettings.automatedEmergencySettings.guidance.bioChoice.title',
                        )
                      : t(
                          'emergencyContactsSettings.automatedEmergencySettings.guidance.timeChoice.title',
                        )}
                  </Text>
                  <Text style={styles.activeDescription}>
                    {bioBasedActive
                      ? t(
                          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleBio',
                        )
                      : t(
                          'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleTime',
                        )}
                  </Text>
                </View>
              </View>
              {bioBasedActive ? (
                <View style={styles.activeSummaryRows}>
                  <View style={styles.activeSummaryRow}>
                    <View style={styles.activeSummaryLabelGroup}>
                      <BioEmergencySettingsFillEcgWave size={30} />
                      <Text style={styles.activeSummaryLabel}>
                        {t(
                          'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceLabel',
                        )}
                      </Text>
                    </View>
                    <View style={styles.activeSummaryValueGroup}>
                      {Platform.OS === 'ios' ? (
                        <HeartPulseIcon size={16} color="#E0527A" />
                      ) : (
                        <GoogleIcon size={16} />
                      )}
                      <Text style={styles.activeSummaryValue}>
                        {bioSourceLabel}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.activeSummaryRow}>
                    <Text style={styles.activeSummaryLabel}>
                      {t(
                        'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.healthDataLabel',
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.activeSummaryValue,
                        healthDataReceived
                          ? styles.activeSummaryValueSuccess
                          : styles.activeSummaryValueWarning,
                      ]}>
                      {healthDataReceived
                        ? t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.healthDataConnected',
                          )
                        : t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.healthDataMissing',
                          )}
                    </Text>
                  </View>
                </View>
              ) : null}
              {timeBasedActive ? <AutomatedEmergency /> : null}
              <View style={styles.modeSection}>
                <View style={styles.modeSectionHeader}>
                  <Text style={styles.modeSectionTitle}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.guidance.monitoringTypeTitle',
                    )}
                  </Text>
                  <Text style={styles.modeSectionSubtitle}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.guidance.monitoringTypeSubtitle',
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.82}
                  style={[
                    styles.modeOption,
                    bioBasedActive ? styles.modeOptionActive : undefined,
                  ]}
                  onPress={
                    bioBasedActive ? undefined : handleSwitchToBioBased
                  }
                  disabled={bioBasedActive}
                  accessibilityRole="button">
                  <View style={styles.modeOptionIcon}>
                    <BioEmergencySettingsFillEcgWave />
                  </View>
                  <View style={styles.modeOptionCopy}>
                    <Text style={styles.modeOptionTitle}>
                      {t(
                        'emergencyContactsSettings.automatedEmergencySettings.guidance.bioChoice.title',
                      )}
                    </Text>
                    <Text style={styles.modeOptionDescription}>
                      {bioBasedActive
                        ? t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleBio',
                          )
                        : t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.bioChoice.support',
                          )}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modeBadge,
                      bioBasedActive
                        ? styles.modeBadgeActive
                        : styles.modeBadgeIdle,
                    ]}>
                    <Text
                      style={[
                        styles.modeBadgeText,
                        bioBasedActive
                          ? styles.modeBadgeTextActive
                          : styles.modeBadgeTextIdle,
                      ]}>
                      {bioBasedActive
                        ? t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.active',
                          )
                        : t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.select',
                          )}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.82}
                  style={[
                    styles.modeOption,
                    timeBasedActive ? styles.modeOptionActive : undefined,
                  ]}
                  onPress={
                    timeBasedActive ? undefined : handleSwitchToTimeBased
                  }
                  disabled={timeBasedActive}
                  accessibilityRole="button">
                  <View style={styles.modeOptionIcon}>
                    <BioEmergencySettingsFillClock />
                  </View>
                  <View style={styles.modeOptionCopy}>
                    <Text style={styles.modeOptionTitle}>
                      {t(
                        'emergencyContactsSettings.automatedEmergencySettings.guidance.timeChoice.title',
                      )}
                    </Text>
                    <Text style={styles.modeOptionDescription}>
                      {timeBasedActive
                        ? t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.status.active.subtitleTime',
                          )
                        : t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.timeChoice.support',
                          )}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modeBadge,
                      timeBasedActive
                        ? styles.modeBadgeActive
                        : styles.modeBadgeIdle,
                    ]}>
                    <Text
                      style={[
                        styles.modeBadgeText,
                        timeBasedActive
                          ? styles.modeBadgeTextActive
                          : styles.modeBadgeTextIdle,
                      ]}>
                      {timeBasedActive
                        ? t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.active',
                          )
                        : t(
                            'emergencyContactsSettings.automatedEmergencySettings.guidance.statusLabels.select',
                          )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {contactsReady ? (
                <>
                  <SleepSchedulePanel refreshKey={sleepScheduleKey} required />
                  {timeBasedActive ? <SpecificTimesPanel /> : null}
                </>
              ) : null}
            </View>
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
