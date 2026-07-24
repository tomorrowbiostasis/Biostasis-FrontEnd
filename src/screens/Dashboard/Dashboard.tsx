import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  InteractionManager,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useDispatch} from 'react-redux';

import {UseAppState} from '~/hooks/UseAppState.hook';
import {Screens} from '~/models/Navigation.model';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {
  EmergencyButtonSettings,
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {
  getGoogleMapsUrl,
  getLocation,
  hasLocationPermission,
} from '~/services/Location.service';
import {hasNotificationPermission} from '~/services/Push.service';
import {
  getUser,
  updateEmergencyButtonSettings,
  updateUser,
} from '~/redux/user/thunks';
import {requestLatestHealthData, getHealthDataEmitter, isIOS} from '~/utils';
import {recentBioData} from '~/services/GoogleFit.service';
import {IUser} from '~/redux/user/user.slice';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import {setHealthData, setAllHealthData} from '~/redux/health/health.slice';
import {iconSizes, semanticColors} from '~/theme/tokens';
import {timeFromNow} from '~/services/Date.service';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';

import SystemCard from '~/components/SystemCard';
import AnimatedHeaderSurface from '~/components/AnimatedHeaderSurface';
import {
  ChevronRightIcon,
  FootprintsIcon,
  HeartPulseIcon,
  RefreshCwIcon,
} from '~/assets/icons/AppIcons';
import GoogleIcon from '~/assets/icons/GoogleIcon';
import TmrBioLogo from '~/assets/icons/TmrBioLogo';
import {
  BioAccountSettingsFillAlertWarning,
  BioHomeFillBroadcastSignal,
  BioHomeFillCircleCheck,
  BioHomeFillClipboard,
  BioHomeFillMenuHamburger,
  BioHomeOutlineHeartEcg,
  BioSettingsFillUserVerified,
} from '~/assets/icons/BiostasisIcons';
import styles from './styles';

const normalizeHealthTimestamp = (timestamp?: number | null): number | null => {
  if (!timestamp) {
    return null;
  }
  return timestamp < 10000000000 ? timestamp * 1000 : timestamp;
};

const formatCollectedAt = (timestamp?: number | null): string | null => {
  const normalizedTimestamp = normalizeHealthTimestamp(timestamp);
  if (!normalizedTimestamp) {
    return null;
  }
  const date = new Date(normalizedTimestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}${suffix}`;
};

type RefreshPhase = 'idle' | 'refreshing' | 'success';
type VisibleHealthData = {
  heartRate: number | null;
  steps: number | null;
};

const MIN_REFRESH_FEEDBACK_MS = 550;
const REFRESH_SUCCESS_LOCK_MS = 60000;
const FOCUS_HEALTH_REFRESH_THROTTLE_MS = 60000;
const PERMISSION_CHECK_THROTTLE_MS = 5 * 60000;
const LOCATION_UPDATE_THROTTLE_MS = 5 * 60000;

const normalizeHealthTimestampMs = (
  value?: number | string | null,
): number | null => {
  if (!value) {
    return null;
  }
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return numeric < 10000000000 ? numeric * 1000 : numeric;
};

const isSameDay = (timestampMs: number, reference: Date): boolean => {
  const date = new Date(timestampMs);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
};

// Steps from the native side are a cumulative daily total, but the latest
// entry in `allData` may carry a stale per-sample count. To keep the displayed
// value monotonic for the day, take the max step count across today's entries.
const getTodayCumulativeSteps = (allData: any[]): number | null => {
  const today = new Date();
  let maxSteps: number | null = null;

  for (const entry of allData ?? []) {
    const entryTime = normalizeHealthTimestampMs(entry?.stepsEndDate);
    if (entryTime == null || !isSameDay(entryTime, today)) {
      continue;
    }
    const stepValue =
      typeof entry?.totalSteps === 'number'
        ? entry.totalSteps
        : typeof entry?.steps === 'number'
        ? entry.steps
        : null;
    if (stepValue != null && (maxSteps == null || stepValue > maxSteps)) {
      maxSteps = stepValue;
    }
  }

  return maxSteps;
};

const getVisibleHealthData = (
  data: any,
  allData: any[],
): VisibleHealthData => ({
  heartRate: data?.heartRate ?? null,
  steps:
    getTodayCumulativeSteps(allData) ??
    data?.totalSteps ??
    data?.steps ??
    null,
});

const Dashboard = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const scrollRef = useRef<ScrollView>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshSuccessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const refreshLockedUntilRef = useRef<number | null>(null);
  const refreshSpin = useRef(new Animated.Value(0)).current;
  const shouldShowRefreshFeedbackRef = useRef(false);
  const refreshStartedAtRef = useRef<number | null>(null);
  const lastFocusHealthRefreshAtRef = useRef(0);
  const lastPermissionCheckAtRef = useRef(0);
  const lastLocationUpdateAtRef = useRef(0);
  const latestVisibleHealthRef = useRef<VisibleHealthData>({
    heartRate: null,
    steps: null,
  });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [refreshPhase, setRefreshPhase] = useState<RefreshPhase>('idle');
  const [visibleHealth, setVisibleHealth] = useState<VisibleHealthData>({
    heartRate: null,
    steps: null,
  });
  const [lastHealthCheckedAt, setLastHealthCheckedAt] = useState<Date | null>(
    null,
  );
  const [renderBelowFold, setRenderBelowFold] = useState(false);

  const {user} = useAppSelector(userSelector);
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const {automatedEmergency} = useAppSelector(
    automatedEmergencySettingsSelector,
  );
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const health = useAppSelector(state => state.health.data);
  const allHealthData = useAppSelector(state => state.health.allData);
  const {isActive} = UseAppState();
  const isFocused = useIsFocused();
  const {isSlotPause} = useTimeSlotPauseStatus();

  const markRefreshComplete = useCallback(() => {
    if (shouldShowRefreshFeedbackRef.current && refreshStartedAtRef.current) {
      const elapsed = Date.now() - refreshStartedAtRef.current;
      if (elapsed < MIN_REFRESH_FEEDBACK_MS) {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
          markRefreshComplete();
        }, MIN_REFRESH_FEEDBACK_MS - elapsed);
        return;
      }
    }

    setLastHealthCheckedAt(new Date());
    setVisibleHealth(latestVisibleHealthRef.current);
    setIsRefreshingHealth(false);
    const shouldLockRefresh = shouldShowRefreshFeedbackRef.current;

    if (shouldLockRefresh) {
      refreshLockedUntilRef.current = Date.now() + REFRESH_SUCCESS_LOCK_MS;
      setRefreshPhase('success');

      if (refreshSuccessTimeoutRef.current) {
        clearTimeout(refreshSuccessTimeoutRef.current);
      }
      refreshSuccessTimeoutRef.current = setTimeout(() => {
        refreshLockedUntilRef.current = null;
        setRefreshPhase('idle');
      }, REFRESH_SUCCESS_LOCK_MS);
    } else if (
      refreshLockedUntilRef.current &&
      refreshLockedUntilRef.current > Date.now()
    ) {
      setRefreshPhase('success');
    } else {
      setRefreshPhase('idle');
    }

    shouldShowRefreshFeedbackRef.current = false;
    refreshStartedAtRef.current = null;
  }, []);

  const refreshHealthData = useCallback(
    (showSpinner = false) => {
      shouldShowRefreshFeedbackRef.current = showSpinner;
      if (showSpinner) {
        refreshStartedAtRef.current = Date.now();
        setIsRefreshingHealth(true);
        setRefreshPhase('refreshing');
      }
      // iOS pulls fresh HealthKit data through the native module (results
      // arrive via the HealthDataEvent emitter). Android has no such module —
      // requestLatestHealthData() is a no-op there — so fetch Google Fit
      // samples directly. recentBioData() dispatches the values into
      // state.health for display WITHOUT running emergency escalation (that
      // stays owned by the background bio check), so a foreground refresh on an
      // empty window can't trip the "no data" health-condition flow.
      const refresh = isIOS ? requestLatestHealthData() : recentBioData();
      refresh.catch(error => {
        console.log('Could not refresh latest health data', error);
      });

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        markRefreshComplete();
      }, 3500);
    },
    [markRefreshComplete],
  );

  const handleRefreshPress = useCallback(() => {
    if (isRefreshingHealth || refreshPhase === 'success') {
      return;
    }
    refreshHealthData(true);
  }, [isRefreshingHealth, refreshHealthData, refreshPhase]);

  useEffect(() => {
    if (refreshPhase !== 'refreshing') {
      refreshSpin.stopAnimation();
      refreshSpin.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(refreshSpin, {
        toValue: 1,
        duration: 780,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [refreshPhase, refreshSpin]);

  useEffect(() => {
    const nextVisibleHealth = getVisibleHealthData(health, allHealthData);
    latestVisibleHealthRef.current = nextVisibleHealth;

    if (!isRefreshingHealth) {
      setVisibleHealth(nextVisibleHealth);
    }
  }, [health, allHealthData, isRefreshingHealth]);

  /* ----- preserved side-effects (data fetching, triggers, location) ----- */
  useEffect(() => {
    const subscription = getHealthDataEmitter()?.addListener(
      'HealthDataEvent',
      (data: any) => {
        let lastEntryKey: string | null = null;

        if (Array.isArray(data.allHealthData)) {
          const normalizedArray = [...data.allHealthData]
            .filter((entry: any) => {
              const currentKey = `${entry.heartRateEndDate || null}|${
                entry.restingHeartRateEndDate || null
              }|${entry.stepsEndDate || null}`;
              if (currentKey === lastEntryKey) {
                return false;
              }
              lastEntryKey = currentKey;
              return true;
            })
            .map((entry: any) => {
              const heartRateEndDate = normalizeHealthTimestamp(
                entry.heartRateEndDate,
              );
              const restingHeartRateEndDate = normalizeHealthTimestamp(
                entry.restingHeartRateEndDate,
              );
              const stepsEndDate = normalizeHealthTimestamp(entry.stepsEndDate);
              const steps = typeof entry.steps === 'number' ? entry.steps : 0;
              return {
                ...entry,
                heartRateEndDate,
                restingHeartRateEndDate,
                stepsEndDate,
                totalSteps: steps,
              };
            });
          dispatch(setAllHealthData(normalizedArray));
        } else {
          dispatch(
            setHealthData({
              ...data,
              heartRateEndDate: data.heartRateEndDate || null,
              restingHeartRateEndDate: data.restingHeartRateEndDate || null,
              stepsEndDate: data.stepsEndDate || null,
            }),
          );
        }
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        markRefreshComplete();
      },
    );
    return () => subscription?.remove();
  }, [dispatch, markRefreshComplete]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (refreshSuccessTimeoutRef.current) {
        clearTimeout(refreshSuccessTimeoutRef.current);
      }
      refreshLockedUntilRef.current = null;
    };
  }, []);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch(getUser());
    });

    return () => task.cancel();
  }, [dispatch]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setRenderBelowFold(true);
    });

    return () => task.cancel();
  }, []);

  const handleHealthTriggerCheck = useCallback(async () => {
    const healthStatus = await AsyncStorageService.getItem(
      AsyncStorageEnum.HealthTrigger,
    );
    if (healthStatus === 'true') {
      // @ts-ignore
      navigate(Screens.HealthConditionError, {healthCheck: true});
    }
  }, [navigate]);

  const handleTimeTriggerCheck = useCallback(async () => {
    const timeStatus = await AsyncStorageService.getItem(
      AsyncStorageEnum.TimeTrigger,
    );
    if (timeStatus === 'true') {
      // @ts-ignore
      navigate(Screens.HealthConditionError, {regularCheck: true});
    }
  }, [navigate]);

  const handleLocationChange = useCallback(async () => {
    const payload: Partial<IUser> = {
      timezone: timestampToISOWithOffset().slice(-6),
    };
    const location = await getLocation(5000, false);
    payload.location = getGoogleMapsUrl(location);
    dispatch(updateUser(payload));
  }, [dispatch]);

  useEffect(() => {
    if (!isActive || !isFocused) {
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      handleHealthTriggerCheck();
      handleTimeTriggerCheck();
    });

    return () => task.cancel();
  }, [handleHealthTriggerCheck, handleTimeTriggerCheck, isActive, isFocused]);

  const refreshHealthOnFocus = useCallback(() => {
    const now = Date.now();
    const shouldRefreshHealth =
      now - lastFocusHealthRefreshAtRef.current >
      FOCUS_HEALTH_REFRESH_THROTTLE_MS;

    if (shouldRefreshHealth) {
      lastFocusHealthRefreshAtRef.current = now;
      refreshHealthData(false);
    }
  }, [refreshHealthData]);

  const checkRequiredPermissions = useCallback(async () => {
    const now = Date.now();
    const shouldCheckPermissions =
      now - lastPermissionCheckAtRef.current > PERMISSION_CHECK_THROTTLE_MS;

    if (shouldCheckPermissions) {
      lastPermissionCheckAtRef.current = now;

      try {
        const isLocationGranted = await hasLocationPermission();
        const values: EmergencyButtonSettings = {
          locationAccess: isLocationGranted,
        };
        dispatch(updateEmergencyButtonSettings(values));

        const shouldUpdateLocation =
          isLocationGranted &&
          now - lastLocationUpdateAtRef.current > LOCATION_UPDATE_THROTTLE_MS;

        if (shouldUpdateLocation) {
          lastLocationUpdateAtRef.current = now;
          handleLocationChange();
        }
      } catch {
        console.log('Could not get location permissions');
      }

      await hasNotificationPermission();
    }
  }, [dispatch, handleLocationChange]);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({y: 0, animated: false});

      const task = InteractionManager.runAfterInteractions(() => {
        checkRequiredPermissions();
        refreshHealthOnFocus();
      });

      return () => task.cancel();
    }, [checkRequiredPermissions, refreshHealthOnFocus]),
  );

  useEffect(() => {
    if (!isActive || !isFocused) {
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      checkRequiredPermissions();
    });

    return () => task.cancel();
  }, [checkRequiredPermissions, isActive, isFocused]);

  useEffect(() => {
    if (!isActive || !isFocused) {
      return;
    }

    (async () => {
      const isInEmergencyState = await AsyncStorageService.getItem(
        AsyncStorageEnum.IsEmergencyEscalationStarted,
      );
      if (JSON.parse(isInEmergencyState ?? 'false')) {
        navigate(Screens.HealthConditionError as never);
      }
    })();
  }, [isActive, isFocused, navigate]);

  /* ----- navigation ----- */
  const goSettings = useCallback(
    () => navigate(Screens.Settings as never),
    [navigate],
  );
  const goHealthLogs = useCallback(
    () => navigate(Screens.CurrentHealthLog as never),
    [navigate],
  );
  const goEmergencyContacts = useCallback(
    () => navigate(Screens.EmergencyContactSettings as never),
    [navigate],
  );
  const goAutomatedEmergency = useCallback(
    () => navigate(Screens.AutomatedEmergencySettings as never),
    [navigate],
  );

  /* ----- derived state ----- */
  const contactsReady = hasContacts && areContactsEnabled;
  const systemOn = !!automatedEmergency;
  const timeActive = systemOn && user.regularPushNotification === true;
  const bioActive = systemOn && user.regularPushNotification === false;
  const monitoringActive = timeActive || bioActive;
  const displayedMonitoringActive = contactsReady && monitoringActive;
  const fullySetUp = contactsReady && displayedMonitoringActive;

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboardHome.greeting.morning')
      : hour < 18
      ? t('dashboardHome.greeting.afternoon')
      : t('dashboardHome.greeting.evening');

  const lastHealthCheckedAtText = lastHealthCheckedAt
    ? formatCollectedAt(lastHealthCheckedAt.getTime())
    : null;

  const heartRate = visibleHealth.heartRate;
  const steps = visibleHealth.steps;
  const refreshIconRotation = refreshSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const healthMonitoringSource =
    steps != null
      ? t(
          Platform.OS === 'ios'
            ? 'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceBioIos'
            : 'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceBioAndroid',
        )
      : null;

  const readiness = useMemo(() => {
    if (fullySetUp) {
      return {
        tone: 'active' as const,
        statusLabel: t('dashboardHome.readiness.status.active'),
        title: t('dashboardHome.readiness.states.active.title'),
        subtitle: timeActive
          ? t('dashboardHome.readiness.states.active.subtitleTime')
          : bioActive
          ? t('dashboardHome.readiness.states.active.subtitleBio')
          : t('dashboardHome.readiness.states.active.subtitleGeneric'),
        actionLabel: t('dashboardHome.readiness.actions.viewSettings'),
        onActionPress: goAutomatedEmergency,
      };
    }

    if (!contactsReady) {
      return {
        tone: 'setup' as const,
        statusLabel: t('dashboardHome.readiness.status.setupRequired'),
        title: t('dashboardHome.readiness.states.incomplete.title'),
        subtitle: t('dashboardHome.readiness.states.incomplete.subtitle'),
        actionLabel: t('dashboardHome.readiness.actions.addContact'),
        onActionPress: goEmergencyContacts,
      };
    }

    if (!monitoringActive) {
      return {
        tone: 'attention' as const,
        statusLabel: t('dashboardHome.readiness.status.needsAttention'),
        title: t('dashboardHome.readiness.states.inactive.title'),
        subtitle: t('dashboardHome.readiness.states.inactive.subtitle'),
        actionLabel: t('dashboardHome.readiness.actions.enableMonitoring'),
        onActionPress: goAutomatedEmergency,
      };
    }

    return {
      tone: 'attention' as const,
      statusLabel: t('dashboardHome.readiness.status.needsAttention'),
      title: t('dashboardHome.readiness.states.inactive.title'),
      subtitle: t('dashboardHome.readiness.states.inactive.subtitle'),
      actionLabel: t('dashboardHome.readiness.actions.enableMonitoring'),
      onActionPress: goAutomatedEmergency,
    };
  }, [
    bioActive,
    contactsReady,
    fullySetUp,
    goAutomatedEmergency,
    goEmergencyContacts,
    monitoringActive,
    t,
    timeActive,
  ]);
  const readinessActive = readiness.tone === 'active';

  const readinessRows = useMemo(
    () => [
      {
        label: t('dashboardHome.readiness.items.contacts'),
        value: contactsReady
          ? t('dashboardHome.readiness.contacts.added')
          : t('dashboardHome.readiness.contacts.missing'),
        tone: contactsReady ? ('success' as const) : ('warning' as const),
        onPress: goEmergencyContacts,
      },
      {
        label: t('dashboardHome.readiness.items.monitoring'),
        value: !contactsReady
          ? t('dashboardHome.readiness.monitoring.setupRequired')
          : displayedMonitoringActive
          ? t('dashboardHome.readiness.monitoring.active')
          : t('dashboardHome.readiness.monitoring.off'),
        tone: !contactsReady
          ? ('warning' as const)
          : displayedMonitoringActive
          ? ('success' as const)
          : ('muted' as const),
        onPress: contactsReady ? goAutomatedEmergency : goEmergencyContacts,
      },
    ],
    [
      contactsReady,
      displayedMonitoringActive,
      goAutomatedEmergency,
      goEmergencyContacts,
      t,
    ],
  );

  const emergencySystemStatus = useMemo(() => {
    const modeLabel = timeActive
      ? t('dashboardHome.cards.emergencySystem.mode.time')
      : bioActive
      ? t('dashboardHome.cards.emergencySystem.mode.bio')
      : t('dashboardHome.cards.emergencySystem.mode.inactive');
    const pauseUntil = Math.max(pausedDate?.timestamp ?? 0, isSlotPause ?? 0);
    const isPaused = monitoringActive && pauseUntil > Date.now();

    if (!contactsReady) {
      return {
        subtitle: t('dashboardHome.cards.emergencySystem.mode.setup'),
        statusTitle: t('dashboardHome.cards.emergencySystem.live.setupTitle'),
        statusDescription: t(
          'dashboardHome.cards.emergencySystem.live.setupDescription',
        ),
        actionLabel: t('dashboardHome.cards.emergencySystem.actions.complete'),
        tone: 'warning' as const,
      };
    }

    if (isPaused) {
      return {
        subtitle: modeLabel,
        statusTitle: t('dashboardHome.cards.emergencySystem.live.pausedTitle'),
        statusDescription: t(
          'dashboardHome.cards.emergencySystem.live.pausedDescription',
          {time: timeFromNow(pauseUntil)},
        ),
        actionLabel: t('dashboardHome.cards.emergencySystem.actions.view'),
        tone: 'muted' as const,
      };
    }

    if (monitoringActive) {
      return {
        subtitle: t('dashboardHome.cards.emergencySystem.active'),
        statusBadge: t('dashboardHome.cards.emergencySystem.badge.enabled'),
        actionLabel: t('dashboardHome.cards.emergencySystem.actions.view'),
        tone: 'success' as const,
      };
    }

    return {
      subtitle: modeLabel,
      statusTitle: t('dashboardHome.cards.emergencySystem.live.inactiveTitle'),
      statusDescription: t(
        'dashboardHome.cards.emergencySystem.live.inactiveDescription',
      ),
      actionLabel: t('dashboardHome.cards.emergencySystem.actions.enable'),
      tone: 'warning' as const,
    };
  }, [
    bioActive,
    contactsReady,
    isSlotPause,
    monitoringActive,
    pausedDate?.timestamp,
    t,
    timeActive,
  ]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <AnimatedHeaderSurface style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.logoWrap}>
              <TmrBioLogo
                width={96}
                height={16}
                color="#FFFFFF"
                opacity={0.52}
              />
            </View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {user.name || ''}
            </Text>
          </View>
          <View style={styles.menuButtonWrap}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={goSettings}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('headers.accountSettings')}>
              <BioHomeFillMenuHamburger />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedHeaderSurface>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: tabBarHeight + 18},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingHealth}
            onRefresh={handleRefreshPress}
            tintColor={semanticColors.primary}
            colors={[semanticColors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.readinessCard,
            readiness.tone === 'active'
              ? styles.readinessCardActive
              : readiness.tone === 'attention'
              ? styles.readinessCardAttention
              : styles.readinessCardSetup,
          ]}>
          <View style={styles.readinessTopRow}>
            <View
              style={[
                styles.readinessStatusIcon,
                readiness.tone === 'active'
                  ? styles.readinessStatusIconActive
                  : readiness.tone === 'attention'
                  ? styles.readinessIconAttention
                  : styles.readinessIconSetup,
              ]}>
              {readiness.tone === 'active' ? (
                <BioHomeFillCircleCheck size={24} />
              ) : (
                <BioAccountSettingsFillAlertWarning size={24} />
              )}
            </View>
            <Text style={styles.readinessEyebrow}>
              {t('dashboardHome.readiness.eyebrow')}
            </Text>
            <View
              style={[
                styles.readinessStatusPill,
                readiness.tone === 'active'
                  ? styles.readinessStatusPillActive
                  : readiness.tone === 'attention'
                  ? styles.readinessStatusPillAttention
                  : styles.readinessStatusPillSetup,
              ]}>
              <Text
                style={[
                  styles.readinessStatusPillText,
                  readiness.tone === 'active'
                    ? styles.readinessStatusPillTextActive
                    : styles.readinessStatusPillTextWarning,
                ]}>
                {readiness.statusLabel}
              </Text>
            </View>
          </View>

          {!readinessActive ? (
            <View style={styles.readinessTitleBlock}>
              <Text style={styles.readinessTitle}>{readiness.title}</Text>
              <Text style={styles.readinessSubtitle}>{readiness.subtitle}</Text>
            </View>
          ) : null}

          {!readinessActive ? (
            <>
              <View style={styles.readinessChecklist}>
                {readinessRows.map(item => (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.75}
                    onPress={item.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.label}: ${item.value}`}>
                    <View style={styles.readinessRow}>
                      <Text style={styles.readinessRowLabel}>{item.label}</Text>
                      <View
                        style={[
                          styles.readinessRowValuePill,
                          item.tone === 'success'
                            ? styles.readinessRowValuePillSuccess
                            : item.tone === 'muted'
                            ? styles.readinessRowValuePillMuted
                            : styles.readinessRowValuePillWarning,
                        ]}>
                        <Text
                          style={[
                            styles.readinessRowValue,
                            item.tone === 'success'
                              ? styles.readinessRowValueDone
                              : item.tone === 'muted'
                              ? styles.readinessRowValueMuted
                              : styles.readinessRowValueTodo,
                          ]}
                          numberOfLines={1}>
                          {item.value}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.readinessAction}
                activeOpacity={0.82}
                onPress={readiness.onActionPress}
                accessibilityRole="button">
                <Text style={styles.readinessActionText}>
                  {readiness.actionLabel}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>
          {t('dashboardHome.healthData.title')}
        </Text>

        <View style={styles.metricsCard}>
          <View style={styles.metricsTopRow}>
            <View style={styles.metricsRow}>
              <HealthMetric
                icon={
                  <BioHomeOutlineHeartEcg
                    size={iconSizes.metric}
                    color="#D6455D"
                  />
                }
                label={t('dashboardHome.metrics.heartRate')}
                value={heartRate != null ? String(heartRate) : '—'}
                unit={heartRate != null ? 'bpm' : undefined}
              />
              <HealthMetric
                icon={
                  <FootprintsIcon size={iconSizes.metric} color="#2B6E99" />
                }
                label={t('dashboardHome.metrics.steps')}
                value={steps != null ? String(steps) : '—'}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.82}
              style={[
                styles.refreshIconButton,
                refreshPhase === 'refreshing'
                  ? styles.refreshIconButtonRefreshing
                  : undefined,
                refreshPhase === 'success'
                  ? styles.refreshIconButtonSuccess
                  : undefined,
              ]}
              onPress={handleRefreshPress}
              disabled={isRefreshingHealth || refreshPhase === 'success'}
              accessibilityRole="button"
              accessibilityState={{
                disabled: isRefreshingHealth || refreshPhase === 'success',
              }}
              accessibilityLabel={t('dashboardHome.healthData.refreshA11y')}>
              {refreshPhase === 'success' ? (
                <BioHomeFillCircleCheck size={24} />
              ) : (
                <Animated.View
                  style={{
                    transform: [{rotate: refreshIconRotation}],
                  }}>
                  <RefreshCwIcon
                    size={18}
                    color={
                      refreshPhase === 'refreshing'
                        ? semanticColors.primary
                        : '#6B7A8E'
                    }
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.lastCheckedRow}>
            <Text style={styles.lastCheckedText}>
              {t('dashboardHome.healthData.lastCheckedLabel')}
            </Text>
            <Text style={styles.lastCheckedTime}>
              {lastHealthCheckedAtText || '—'}
            </Text>
          </View>
          {healthMonitoringSource ? (
            <View style={styles.monitoringSourceRow}>
              <Text style={styles.monitoringSourceLabel}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.guidance.activeSummary.sourceLabel',
                )}
              </Text>
              <View style={styles.monitoringSourceValueGroup}>
                {Platform.OS === 'ios' ? (
                  <HeartPulseIcon size={16} color="#D6455D" />
                ) : (
                  <GoogleIcon size={16} />
                )}
                <Text style={styles.monitoringSourceValue}>
                  {healthMonitoringSource}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {renderBelowFold ? (
          <>
            <Text style={styles.sectionLabel}>
              {t('dashboardHome.sectionEmergencySystem')}
            </Text>

            <View style={styles.cards}>
              <SystemCard
                chip={<BioHomeFillBroadcastSignal />}
                title={t('dashboardHome.cards.emergencySystem.title')}
                subtitle={emergencySystemStatus.subtitle}
                footer={
                  emergencySystemStatus.statusBadge ? (
                    <StatusFooter
                      status={emergencySystemStatus.statusBadge}
                      action={emergencySystemStatus.actionLabel}
                      tone={emergencySystemStatus.tone}
                    />
                  ) : (
                    <EmergencySystemStatusFooter
                      title={emergencySystemStatus.statusTitle ?? ''}
                      description={
                        emergencySystemStatus.statusDescription ?? ''
                      }
                      action={emergencySystemStatus.actionLabel}
                      tone={emergencySystemStatus.tone}
                    />
                  )
                }
                onPress={goAutomatedEmergency}
              />
              <SystemCard
                chip={<BioSettingsFillUserVerified />}
                title={t('dashboardHome.cards.contacts.title')}
                subtitle={
                  contactsReady
                    ? t('dashboardHome.cards.contacts.ready')
                    : t('dashboardHome.cards.contacts.missing')
                }
                footer={
                  <StatusFooter
                    status={
                      contactsReady
                        ? t('dashboardHome.cards.contacts.badgeReady')
                        : t('dashboardHome.cards.contacts.badgeMissing')
                    }
                    action={
                      contactsReady
                        ? t('dashboardHome.cards.contacts.actions.manage')
                        : t('dashboardHome.cards.contacts.actions.add')
                    }
                    tone={contactsReady ? 'success' : 'warning'}
                  />
                }
                onPress={goEmergencyContacts}
              />
            </View>

            <Text style={styles.sectionLabel}>
              {t('dashboardHome.sectionHealthLogs')}
            </Text>

            <View style={styles.cards}>
              <SystemCard
                chip={<BioHomeFillClipboard />}
                title={t('dashboardHome.cards.healthLogs.title')}
                subtitle={t('dashboardHome.cards.healthLogs.subtitle')}
                right="chevron"
                onPress={goHealthLogs}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const badgeColors = {
  success: {
    background: 'rgba(30, 155, 107, 0.2)',
    text: '#1E9B6B',
  },
  warning: {
    background: 'rgba(245, 166, 35, 0.2)',
    text: '#D4820A',
  },
  muted: {
    background: 'rgba(107, 122, 142, 0.16)',
    text: '#6B7A8E',
  },
};

const normalizeActionLabel = (value: string) => value.replace(/\s*[→›]$/, '');

const StatusAction = React.memo(({label}: {label: string}) => (
  <View style={styles.statusActionRow}>
    <Text style={styles.statusActionText}>{normalizeActionLabel(label)}</Text>
    <ChevronRightIcon
      size={iconSizes.chevron}
      color={semanticColors.iconChevron}
    />
  </View>
));

const HealthMetric = React.memo(
  ({
    icon,
    label,
    value,
    unit,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit?: string;
  }) => (
    <View style={styles.healthMetric}>
      <View style={styles.healthMetricLabelRow}>
        {icon}
        <Text style={styles.healthMetricLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.healthMetricValueRow}>
        <Text style={styles.healthMetricValue} numberOfLines={1}>
          {value}
        </Text>
        {unit ? (
          <Text style={styles.healthMetricUnit} numberOfLines={1}>
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  ),
);

type BadgeTone = keyof typeof badgeColors;

const StatusFooter = React.memo(
  ({
    status,
    action,
    tone,
  }: {
    status: string;
    action: string;
    tone: BadgeTone;
  }) => (
    <View style={styles.statusFooter}>
      <View
        style={[
          styles.statusPill,
          {backgroundColor: badgeColors[tone].background},
        ]}>
        <Text style={[styles.statusPillText, {color: badgeColors[tone].text}]}>
          {status}
        </Text>
      </View>
      <StatusAction label={action} />
    </View>
  ),
);

const EmergencySystemStatusFooter = React.memo(
  ({
    title,
    description,
    action,
    tone,
  }: {
    title: string;
    description: string;
    action: string;
    tone: BadgeTone;
  }) => (
    <View style={styles.emergencyStatusFooter}>
      <View
        style={[
          styles.emergencyStatusStrip,
          tone === 'success'
            ? styles.emergencyStatusStripSuccess
            : tone === 'muted'
            ? styles.emergencyStatusStripMuted
            : styles.emergencyStatusStripWarning,
        ]}>
        <View
          style={[
            styles.emergencyStatusIcon,
            tone === 'success'
              ? styles.emergencyStatusIconSuccess
              : tone === 'muted'
              ? styles.emergencyStatusIconMuted
              : styles.emergencyStatusIconWarning,
          ]}>
          {tone === 'success' ? (
            <BioHomeFillCircleCheck size={28} />
          ) : (
            <View
              style={[
                styles.emergencyStatusDot,
                tone === 'muted'
                  ? styles.emergencyStatusDotMuted
                  : styles.emergencyStatusDotWarning,
              ]}
            />
          )}
        </View>
        <View style={styles.emergencyStatusTextBlock}>
          <Text style={styles.emergencyStatusTitle}>{title}</Text>
          <Text style={styles.emergencyStatusDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.emergencyStatusDivider} />
      <StatusAction label={action} />
    </View>
  ),
);

export default Dashboard;
