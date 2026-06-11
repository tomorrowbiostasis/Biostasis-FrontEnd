import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated as RNAnimated,
  Easing,
  GestureResponderEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import NativeBottomSheet from '~/components/NativeBottomSheet';
import {
  BellIcon,
  CheckIcon,
  HeartPulseIcon,
  MapPinIcon,
  XIcon,
} from '~/assets/icons/AppIcons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {layout, semanticColors, typography} from '~/theme/tokens';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {getHealthDataEmitter, requestLatestHealthData} from '~/utils';
import {updateUser} from '~/redux/user/thunks';
import {setAllHealthData, setHealthData} from '~/redux/health/health.slice';
import {
  formatTime,
  getSleepSchedule,
  saveSleepSchedule,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import {
  getGoogleMapsUrl,
  getLocation,
  hasLocationPermission,
  requestLocationPermission,
} from '~/services/Location.service';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import {
  checkNotificationPermissions,
  hasNotificationPermission,
} from '~/services/Push.service';
import {
  canContinueGuidedMonitoringSetup,
  GuidedMonitoringMode,
  GuidedMonitoringStep,
  hasReceivedHealthData,
} from './GuidedMonitoringSetupSheet.logic';
import ToastService from '~/services/Toast.service';
import {TIME_BASED_CHECK_IN_INTERVAL_MINUTES} from '../../constants';

export type {GuidedMonitoringMode};
export type SleepSetupChoice = 'enable';
type PermissionKey = 'notifications' | 'location' | 'health';

interface Props {
  visible: boolean;
  defaultPositiveInfoPeriod: number;
  onDismiss: () => void;
  onDismissComplete?: () => void;
  onComplete: (settings: {
    mode: GuidedMonitoringMode;
    frequencyOfRegularNotification: number;
    positiveInfoPeriod: number;
    sleepChoice: SleepSetupChoice;
  }) => void;
}

const normalizeHealthTimestamp = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeHealthEntry = (entry: Record<string, unknown>) => {
  const heartRate = typeof entry.heartRate === 'number' ? entry.heartRate : 0;
  const restingHeartRate =
    typeof entry.restingHeartRate === 'number' ? entry.restingHeartRate : 0;
  const steps = typeof entry.steps === 'number' ? entry.steps : 0;
  const totalSteps =
    typeof entry.totalSteps === 'number' ? entry.totalSteps : steps;

  return {
    ...entry,
    heartRate,
    restingHeartRate,
    steps,
    heartRateEndDate: normalizeHealthTimestamp(entry.heartRateEndDate),
    restingHeartRateEndDate: normalizeHealthTimestamp(
      entry.restingHeartRateEndDate,
    ),
    stepsEndDate: normalizeHealthTimestamp(entry.stepsEndDate),
    totalSteps,
  };
};

const STEP_TRANSITION_DURATION = 220;
const STEP_TRANSITION_DISTANCE = 8;

const GuidedMonitoringSetupSheet = ({
  visible,
  defaultPositiveInfoPeriod,
  onDismiss,
  onDismissComplete,
  onComplete,
}: Props) => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const health = useAppSelector(state => state.health.data);
  const user = useAppSelector(state => state.user.user);
  const {authorizeGoogleFit, isGoogleFitAuthorized} = useGoogleFitAuthStatus();
  const [step, setStep] = useState<GuidedMonitoringStep>(1);
  const [positiveInfoPeriod, setPositiveInfoPeriod] = useState(
    defaultPositiveInfoPeriod,
  );
  const [schedule, setSchedule] = useState<SleepSchedule>({
    enabled: false,
    bedtimeHour: 22,
    bedtimeMinute: 0,
    wakeHour: 7,
    wakeMinute: 0,
  });
  const [activeSleepPicker, setActiveSleepPicker] = useState<
    'bedtime' | 'wake'
  >('bedtime');
  const [androidSleepPickerVisible, setAndroidSleepPickerVisible] =
    useState(false);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [activePermissionAction, setActivePermissionAction] =
    useState<PermissionKey | null>(null);
  const [healthAccessConfirmed, setHealthAccessConfirmed] = useState(false);
  const healthCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const healthCheckResolvedRef = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const stepTransition = useRef(new RNAnimated.Value(1)).current;
  const healthDataReceived = hasReceivedHealthData(health);
  const healthConnectionGranted =
    Platform.OS === 'ios'
      ? !!user.pulseBasedTriggerIOSHealthPermissions ||
        !!user.pulseBasedTriggerIOSAppleWatchPaired
      : isGoogleFitAuthorized ||
        !!user.pulseBasedTriggerGoogleFitAuthenticated ||
        !!user.pulseBasedTriggerConnectedToGoogleFit;
  const healthConnectionReady = healthConnectionGranted || healthAccessConfirmed;
  const healthReady = healthDataReceived || healthConnectionReady;
  const commonPermissionsReady =
    notificationsGranted && locationGranted && healthConnectionReady;

  const refreshPermissionState = useCallback(async () => {
    const [notificationsAllowed, locationAllowed] = await Promise.all([
      hasNotificationPermission(),
      hasLocationPermission(),
    ]);

    setNotificationsGranted(notificationsAllowed);
    setLocationGranted(locationAllowed);
  }, []);

  const clearHealthCheckTimeout = useCallback(() => {
    if (healthCheckTimeoutRef.current) {
      clearTimeout(healthCheckTimeoutRef.current);
      healthCheckTimeoutRef.current = null;
    }
  }, []);

  const transitionToStep = useCallback(
    (nextStep: GuidedMonitoringStep) => {
      if (nextStep === step) {
        return;
      }

      setStepDirection(nextStep > step ? 1 : -1);
      stepTransition.stopAnimation();
      stepTransition.setValue(0);
      scrollRef.current?.scrollTo({y: 0, animated: false});
      setStep(nextStep);
      requestAnimationFrame(() => {
        RNAnimated.timing(stepTransition, {
          toValue: 1,
          duration: STEP_TRANSITION_DURATION,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }).start();
      });
    },
    [step, stepTransition],
  );

  const finishHealthPermissionCheck = useCallback(
    (success: boolean) => {
      if (healthCheckResolvedRef.current) {
        return;
      }

      healthCheckResolvedRef.current = true;
      clearHealthCheckTimeout();
      setActivePermissionAction(current =>
        current === 'health' ? null : current,
      );

      if (success) {
        setHealthAccessConfirmed(true);
        if (Platform.OS === 'ios') {
          dispatch(updateUser({pulseBasedTriggerIOSHealthPermissions: true}));
        }
      }

      ToastService[success ? 'success' : 'warning'](
        t(
          success
            ? 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthCheckSuccess'
            : 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthCheckFailed',
        ),
      );
    },
    [clearHealthCheckTimeout, dispatch, t],
  );

  useEffect(() => {
    if (visible) {
      setStep(1);
      setStepDirection(1);
      stepTransition.stopAnimation();
      stepTransition.setValue(1);
      setPositiveInfoPeriod(defaultPositiveInfoPeriod);
      getSleepSchedule().then(setSchedule);
      refreshPermissionState();
      setActivePermissionAction(null);
      setHealthAccessConfirmed(false);
      setActiveSleepPicker('bedtime');
      setAndroidSleepPickerVisible(false);
      clearHealthCheckTimeout();
      healthCheckResolvedRef.current = false;
    }
  }, [
    clearHealthCheckTimeout,
    defaultPositiveInfoPeriod,
    refreshPermissionState,
    stepTransition,
    visible,
  ]);

  useEffect(() => {
    if (visible && activePermissionAction === 'health' && healthReady) {
      finishHealthPermissionCheck(true);
    }
  }, [
    activePermissionAction,
    finishHealthPermissionCheck,
    healthReady,
    visible,
  ]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'ios') {
      return;
    }

    const emitter = getHealthDataEmitter();
    const subscription = emitter?.addListener('HealthDataEvent', (data: any) => {
      if (Array.isArray(data?.allHealthData)) {
        const normalizedArray = data.allHealthData.map(
          (entry: Record<string, unknown>) => normalizeHealthEntry(entry),
        );
        dispatch(setAllHealthData(normalizedArray));
        const latestEntry = normalizedArray.at(-1);
        if (latestEntry) {
          dispatch(setHealthData(latestEntry));
        }
        return;
      }

      if (data && typeof data === 'object') {
        dispatch(setHealthData(normalizeHealthEntry(data)));
      }
    });

    return () => subscription?.remove();
  }, [dispatch, visible]);

  useEffect(() => {
    return () => clearHealthCheckTimeout();
  }, [clearHealthCheckTimeout]);

  const primaryLabel = useMemo(() => {
    if (step === 2) {
      return t(
        'emergencyContactsSettings.automatedEmergencySettings.setupFlow.enableMonitoring',
      );
    }

    return t(
      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.continue',
    );
  }, [step, t]);

  const canContinue = canContinueGuidedMonitoringSetup({
    step,
    permissionsReady: commonPermissionsReady,
  });

  const persistSchedule = useCallback(async (updated: SleepSchedule) => {
    setSchedule(updated);
    await saveSleepSchedule(updated);
  }, []);

  const handleBedtimeConfirm = useCallback(
    (date: Date) => {
      persistSchedule({
        ...schedule,
        bedtimeHour: date.getHours(),
        bedtimeMinute: date.getMinutes(),
      });
    },
    [persistSchedule, schedule],
  );

  const handleWakeConfirm = useCallback(
    (date: Date) => {
      persistSchedule({
        ...schedule,
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      });
    },
    [persistSchedule, schedule],
  );

  const openSleepPicker = useCallback(
    (picker: 'bedtime' | 'wake') => (_event?: GestureResponderEvent) => {
      setActiveSleepPicker(picker);
      if (Platform.OS === 'android') {
        setAndroidSleepPickerVisible(true);
      }
    },
    [],
  );

  const handleSleepPickerChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS !== 'ios') {
        setAndroidSleepPickerVisible(false);
      }

      if (event.type === 'dismissed' || !date) {
        return;
      }

      if (activeSleepPicker === 'bedtime') {
        handleBedtimeConfirm(date);
        return;
      }

      handleWakeConfirm(date);
    },
    [activeSleepPicker, handleBedtimeConfirm, handleWakeConfirm],
  );

  const handleNotificationPermission = useCallback(async () => {
    setActivePermissionAction('notifications');
    const granted = await checkNotificationPermissions();
    setNotificationsGranted(granted);
    if (granted) {
      dispatch(updateUser({allowNotifications: true}));
    }
    setActivePermissionAction(null);
  }, [dispatch]);

  const handleLocationPermission = useCallback(async () => {
    setActivePermissionAction('location');
    const granted = await requestLocationPermission(true);
    setLocationGranted(granted);

    if (granted) {
      const payload = {
        locationAccess: true,
        timezone: timestampToISOWithOffset().slice(-6),
      } as {
        locationAccess: boolean;
        timezone: string;
        location?: string;
      };

      try {
        const location = await getLocation(5000, false);
        payload.location = getGoogleMapsUrl(location);
      } catch (error) {
        console.log('Could not refresh location during setup', error);
      }

      dispatch(updateUser(payload));
    }

    setActivePermissionAction(null);
  }, [dispatch]);

  const handleHealthPermission = useCallback(async () => {
    setActivePermissionAction('health');
    healthCheckResolvedRef.current = false;

    if (Platform.OS === 'ios') {
      clearHealthCheckTimeout();
      healthCheckTimeoutRef.current = setTimeout(() => {
        finishHealthPermissionCheck(false);
      }, 6000);
      requestLatestHealthData()
        .then(success => {
          finishHealthPermissionCheck(success);
        })
        .catch(() => {
          finishHealthPermissionCheck(false);
        });
      return;
    }

    const granted = await authorizeGoogleFit();
    if (granted) {
      dispatch(updateUser({pulseBasedTriggerGoogleFitAuthenticated: true}));
      finishHealthPermissionCheck(true);
      return;
    }
    finishHealthPermissionCheck(false);
  }, [
    authorizeGoogleFit,
    clearHealthCheckTimeout,
    dispatch,
    finishHealthPermissionCheck,
  ]);

  const handlePrimaryPress = async () => {
    if (step === 2) {
      const enabledSchedule = {...schedule, enabled: true};
      await persistSchedule(enabledSchedule);
      onComplete({
        mode: 'bio',
        frequencyOfRegularNotification: TIME_BASED_CHECK_IN_INTERVAL_MINUTES,
        positiveInfoPeriod,
        sleepChoice: 'enable',
      });
      return;
    }

    if (canContinue) {
      transitionToStep(Math.min(step + 1, 2) as GuidedMonitoringStep);
    }
  };

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);
  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);
  const stepAnimatedStyle = {
    opacity: stepTransition.interpolate({
      inputRange: [0, 0.65, 1],
      outputRange: [0, 0.96, 1],
    }),
    transform: [
      {
        translateY: stepTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [STEP_TRANSITION_DISTANCE * stepDirection, 0],
        }),
      },
      {
        scale: stepTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.99, 1],
        }),
      },
    ],
  };

  const renderStepContent = () => {
    if (step === 1) {
      const healthSubtitle =
        Platform.OS === 'ios'
          ? t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthSubtitleIos',
            )
          : t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthSubtitleAndroid',
            );
      const showNotificationsTile = !notificationsGranted;
      const showLocationTile = !locationGranted;
      const showHealthTile = !healthReady;
      const showNotificationStatus = notificationsGranted;
      const showLocationStatus = locationGranted;
      const showHealthStatus = healthReady;
      const hasVisiblePermissionTiles =
        showNotificationsTile || showLocationTile || showHealthTile;
      const hasResolvedPermissions =
        showNotificationStatus || showLocationStatus || showHealthStatus;

      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.subtitle',
            )}
          </Text>
          {hasResolvedPermissions ? (
            <View style={styles.permissionResolvedList}>
              {showNotificationStatus ? (
                <PermissionStatusRow
                  icon={<BellIcon size={18} color={semanticColors.primary} />}
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.notificationsTitle',
                  )}
                  statusLabel={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.allowed',
                  )}
                />
              ) : null}
              {showLocationStatus ? (
                <PermissionStatusRow
                  icon={
                    <MapPinIcon size={21} color={semanticColors.textPrimary} />
                  }
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.locationTitle',
                  )}
                  statusLabel={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.allowed',
                  )}
                />
              ) : null}
              {showHealthStatus ? (
                <PermissionStatusRow
                  icon={
                    <HeartPulseIcon size={18} color={semanticColors.primary} />
                  }
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthTitle',
                  )}
                  statusLabel={t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.connected',
                  )}
                />
              ) : null}
            </View>
          ) : null}
          {hasVisiblePermissionTiles ? (
            <>
              <View style={styles.permissionGrid}>
                {showNotificationsTile ? (
                  <PermissionRow
                    icon={<BellIcon size={18} color={semanticColors.primary} />}
                    title={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.notificationsTitle',
                    )}
                    subtitle={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.notificationsSubtitle',
                    )}
                    ready={false}
                    statusLabel={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.required',
                    )}
                    actionLabel={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.allowAction',
                    )}
                    loading={activePermissionAction === 'notifications'}
                    onPress={handleNotificationPermission}
                  />
                ) : null}
                {showLocationTile ? (
                  <PermissionRow
                    icon={
                      <MapPinIcon size={21} color={semanticColors.textPrimary} />
                    }
                    title={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.locationTitle',
                    )}
                    subtitle={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.locationSubtitle',
                    )}
                    ready={false}
                    statusLabel={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.required',
                    )}
                    actionLabel={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.allowAction',
                    )}
                    loading={activePermissionAction === 'location'}
                    onPress={handleLocationPermission}
                  />
                ) : null}
                {showHealthTile ? (
                  <PermissionRow
                    icon={
                      <HeartPulseIcon size={18} color={semanticColors.primary} />
                    }
                    title={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.healthTitle',
                    )}
                    subtitle={healthSubtitle}
                    ready={false}
                    statusLabel={t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.required',
                    )}
                    actionLabel={t(
                      Platform.OS === 'ios'
                        ? 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.checkHealthAction'
                        : 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.permissions.connectAction',
                    )}
                    fullWidthAction
                    loading={activePermissionAction === 'health'}
                    onPress={handleHealthPermission}
                  />
                ) : null}
              </View>
            </>
          ) : null}
        </>
      );
    }

    if (step === 2) {
      const showSleepPicker =
        Platform.OS === 'ios' || androidSleepPickerVisible;

      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.subtitle',
            )}
          </Text>
          <View style={styles.optionList}>
            <View style={styles.sleepTimeCards}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[
                  styles.sleepTimeCard,
                  activeSleepPicker === 'bedtime'
                    ? styles.sleepTimeCardActive
                    : undefined,
                ]}
                onPress={openSleepPicker('bedtime')}
                accessibilityRole="button"
                accessibilityState={{
                  selected: activeSleepPicker === 'bedtime',
                }}>
                <View
                  style={[
                    styles.sleepSelectionIndicator,
                    activeSleepPicker === 'bedtime'
                      ? styles.sleepSelectionIndicatorActive
                      : undefined,
                  ]}>
                  {activeSleepPicker === 'bedtime' ? (
                    <CheckIcon size={10} color={semanticColors.textInverse} />
                  ) : null}
                </View>
                <Text style={styles.sleepTimeIcon}>🌙</Text>
                <Text style={styles.sleepTimeLabel}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.bedtime',
                  )}
                </Text>
                <Text style={styles.sleepTimeValue}>
                  {formatTime(schedule.bedtimeHour, schedule.bedtimeMinute)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[
                  styles.sleepTimeCard,
                  activeSleepPicker === 'wake'
                    ? styles.sleepTimeCardActive
                    : undefined,
                ]}
                onPress={openSleepPicker('wake')}
                accessibilityRole="button"
                accessibilityState={{selected: activeSleepPicker === 'wake'}}>
                <View
                  style={[
                    styles.sleepSelectionIndicator,
                    activeSleepPicker === 'wake'
                      ? styles.sleepSelectionIndicatorActive
                      : undefined,
                  ]}>
                  {activeSleepPicker === 'wake' ? (
                    <CheckIcon size={10} color={semanticColors.textInverse} />
                  ) : null}
                </View>
                <Text style={styles.sleepTimeIcon}>☀️</Text>
                <Text style={styles.sleepTimeLabel}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.wakeTime',
                  )}
                </Text>
                <Text style={styles.sleepTimeValue}>
                  {formatTime(schedule.wakeHour, schedule.wakeMinute)}
                </Text>
              </TouchableOpacity>
            </View>
            {showSleepPicker ? (
              <View style={styles.inlineTimePicker}>
                <DateTimePicker
                  value={
                    activeSleepPicker === 'bedtime' ? bedtimeDate : wakeDate
                  }
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleSleepPickerChange}
                />
              </View>
            ) : null}
          </View>
        </>
      );
    }
  };

  return (
    <>
      <NativeBottomSheet
        visible={visible}
        onDismiss={onDismiss}
        onDismissComplete={onDismissComplete}
        sheetStyle={styles.sheet}>
        <View style={styles.header}>
            <Text style={styles.stepLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.stepLabel',
                {step, total: 2},
              )}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={10}
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}>
              <XIcon size={20} color={semanticColors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}>
            <RNAnimated.View style={[styles.stepContent, stepAnimatedStyle]}>
              {renderStepContent()}
            </RNAnimated.View>
          </ScrollView>
          <View style={styles.footer}>
            {step > 1 ? (
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.secondaryButton}
                onPress={() =>
                  transitionToStep(Math.max(step - 1, 1) as GuidedMonitoringStep)
                }>
                <Text style={styles.secondaryButtonText}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.back',
                  )}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.86}
              disabled={!canContinue}
              style={[
                styles.primaryButton,
                !canContinue ? styles.primaryButtonDisabled : undefined,
              ]}
              onPress={handlePrimaryPress}>
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            </TouchableOpacity>
          </View>
      </NativeBottomSheet>
    </>
  );
};

interface PermissionRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  statusLabel: string;
  actionLabel: string;
  ready: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidthAction?: boolean;
  onPress: () => void;
}

interface PermissionStatusRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  statusLabel: string;
}

const PermissionRow = ({
  icon,
  title,
  subtitle,
  statusLabel,
  actionLabel,
  ready,
  loading,
  disabled,
  fullWidthAction,
  onPress,
}: PermissionRowProps) => (
  <View
    style={[
      styles.permissionCard,
      ready ? styles.permissionCardReady : undefined,
    ]}>
    <View style={styles.permissionHeader}>
      <View
        style={[
          styles.permissionIconWrap,
          ready ? styles.permissionIconWrapReady : undefined,
        ]}>
        {icon}
      </View>
      <View style={styles.permissionCopy}>
        <View
          style={[
            styles.permissionStatusPill,
            ready
              ? styles.permissionStatusPillReady
              : styles.permissionStatusPillPending,
          ]}>
          <Text
            style={[
              styles.permissionStatusText,
              ready
                ? styles.permissionStatusTextReady
                : styles.permissionStatusTextPending,
            ]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <TouchableOpacity
      activeOpacity={0.82}
      style={[
        styles.permissionAction,
        fullWidthAction ? styles.permissionActionFullWidth : undefined,
        disabled ? styles.permissionActionDisabled : undefined,
      ]}
      disabled={disabled || loading}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            disabled ? semanticColors.primary : semanticColors.textInverse
          }
        />
      ) : (
        <Text
          style={[
            styles.permissionActionText,
            disabled ? styles.permissionActionTextDisabled : undefined,
          ]}>
          {actionLabel}
        </Text>
      )}
    </TouchableOpacity>
  </View>
);

const PermissionStatusRow = ({
  icon,
  title,
  subtitle,
  statusLabel,
}: PermissionStatusRowProps) => (
  <View style={styles.permissionStatusRow}>
    <View style={styles.permissionStatusRowIcon}>{icon}</View>
    <View style={styles.permissionStatusRowCopy}>
      <View style={styles.permissionStatusRowTop}>
        <Text style={styles.permissionStatusRowTitle}>{title}</Text>
        <View style={styles.permissionStatusRowPill}>
          <Text style={styles.permissionStatusRowPillText}>{statusLabel}</Text>
        </View>
      </View>
      {subtitle ? (
        <Text style={styles.permissionStatusRowSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sheet: {
    maxHeight: '86%',
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 12,
  },
  stepLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  body: {
    paddingBottom: 2,
  },
  stepContent: {
    gap: 14,
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
    lineHeight: 28,
    color: semanticColors.primary,
  },
  subtitle: {
    ...typography.sectionDescription,
    color: semanticColors.textSecondary,
  },
  helper: {
    ...typography.rowDescription,
    color: semanticColors.textMuted,
  },
  permissionResolvedList: {
    gap: 10,
    marginTop: 12,
    marginBottom: 2,
  },
  permissionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(30, 155, 107, 0.18)',
    backgroundColor: '#F5FBF9',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  permissionStatusRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.successSurface,
  },
  permissionStatusRowCopy: {
    flex: 1,
    gap: 5,
  },
  permissionStatusRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  permissionStatusRowTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  permissionStatusRowPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: semanticColors.successSurface,
  },
  permissionStatusRowPillText: {
    ...typography.statusTagSmall,
    color: semanticColors.success,
  },
  permissionStatusRowSubtitle: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  optionList: {
    marginTop: 8,
    gap: 10,
  },
  permissionGrid: {
    gap: 12,
    marginTop: 12,
  },
  permissionCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 0,
  },
  permissionCardReady: {
    borderColor: 'rgba(30, 155, 107, 0.26)',
    backgroundColor: '#F5FBF9',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  permissionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surfaceMuted,
  },
  permissionIconWrapReady: {
    backgroundColor: semanticColors.successSurface,
  },
  permissionCopy: {
    flex: 1,
    gap: 6,
  },
  permissionStatusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  permissionStatusPillReady: {
    backgroundColor: semanticColors.successSurface,
  },
  permissionStatusPillPending: {
    backgroundColor: semanticColors.surfaceSubtle,
  },
  permissionStatusText: {
    ...typography.statusTagSmall,
  },
  permissionStatusTextReady: {
    color: semanticColors.success,
  },
  permissionStatusTextPending: {
    color: semanticColors.textMuted,
  },
  permissionTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  permissionSubtitle: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  permissionAction: {
    alignSelf: 'flex-start',
    marginTop: 4,
    minHeight: 34,
    borderRadius: layout.formCtaRadius,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  permissionActionFullWidth: {
    alignSelf: 'stretch',
    marginLeft: 52,
  },
  permissionActionDisabled: {
    backgroundColor: semanticColors.successSurface,
  },
  permissionActionText: {
    ...typography.bodySemibold,
    color: semanticColors.textInverse,
  },
  permissionActionTextDisabled: {
    color: semanticColors.primary,
  },
  permissionsDoneCard: {
    borderRadius: 16,
    backgroundColor: '#F5FBF9',
    borderWidth: 1,
    borderColor: 'rgba(30, 155, 107, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  permissionsDoneTitle: {
    ...typography.bodySemibold,
    color: semanticColors.primary,
  },
  permissionsDoneText: {
    ...typography.body,
    color: semanticColors.textSecondary,
  },
  howCard: {
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  howHeaderText: {
    flex: 1,
    gap: 4,
  },
  howTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  howDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  howSteps: {
    gap: 12,
  },
  howStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  howStepText: {
    flex: 1,
    gap: 2,
  },
  howStepTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  howStepDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  optionCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionCardSelected: {
    borderColor: 'rgba(30, 155, 107, 0.42)',
    backgroundColor: '#F1FAF6',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  optionSubtitle: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  radio: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD4DE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surface,
  },
  radioSelected: {
    borderColor: semanticColors.success,
    backgroundColor: semanticColors.success,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: semanticColors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statusCopy: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  statusDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  inlineAction: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  inlineActionText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  fieldLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  fieldGroup: {
    gap: 6,
  },
  sleepTimeCards: {
    flexDirection: 'row',
    gap: 12,
  },
  sleepTimeCard: {
    flex: 1,
    position: 'relative',
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  sleepTimeCardActive: {
    borderColor: 'rgba(30, 155, 107, 0.35)',
    backgroundColor: '#F1FAF6',
  },
  sleepSelectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD4DE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surface,
  },
  sleepSelectionIndicatorActive: {
    borderColor: semanticColors.success,
    backgroundColor: semanticColors.success,
  },
  sleepTimeIcon: {
    fontSize: 20,
  },
  sleepTimeLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: semanticColors.textSecondary,
  },
  sleepTimeValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    color: semanticColors.primary,
  },
  inlineTimePicker: {
    borderRadius: 16,
    backgroundColor: semanticColors.surfaceSubtle,
    overflow: 'hidden',
    paddingVertical: Platform.OS === 'ios' ? 0 : 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingBottom: 6,
  },
  secondaryButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surfaceSubtle,
  },
  secondaryButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.primary,
  },
  primaryButton: {
    flex: 1,
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  primaryButtonDisabled: {
    backgroundColor: semanticColors.primaryDisabled,
  },
  primaryButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
});

export default GuidedMonitoringSetupSheet;
