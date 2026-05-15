import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
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
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {
  getGoogleMapsUrl,
  getLocation,
  requestLocationPermission,
} from '~/services/Location.service';
import {
  getUser,
  updateEmergencyButtonSettings,
  updateUser,
} from '~/redux/user/thunks';
import {isIOS, updateDataCollectionStatus, getHealthDataEmitter} from '~/utils';
import {IUser} from '~/redux/user/user.slice';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import {setHealthData, setAllHealthData} from '~/redux/health/health.slice';

import StatusBanner from '~/components/StatusBanner';
import MetricCard from '~/components/MetricCard';
import SystemCard from '~/components/SystemCard';
import IconChip from '~/components/IconChip';
import Toggle from '~/components/Toggle';
import {
  HeartPulseIcon,
  FootprintsIcon,
  EmergencySystemIcon,
  ClipboardListIcon,
  BroadcastIcon,
  CircleCheckIcon,
} from '~/assets/icons/AppIcons';
import styles from './styles';

const formatCollectedAt = (timestamp?: number | null): string | null => {
  if (!timestamp) {
    return null;
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}${suffix}`;
};

const Dashboard = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  const {user} = useAppSelector(userSelector);
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const {automatedEmergency} = useAppSelector(automatedEmergencySettingsSelector);
  const health = useAppSelector(state => state.health.data);
  const {isActive} = UseAppState();

  /* ----- preserved side-effects (data fetching, triggers, location) ----- */
  useEffect(() => {
    const subscription = getHealthDataEmitter()?.addListener(
      'HealthDataEvent',
      (data: any) => {
        let cumulativeSteps = 0;
        let lastEntryKey: string | null = null;
        let lastStepsEndDate: string | null = null;

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
              const stepsEndDate = entry.stepsEndDate || null;
              const steps = typeof entry.steps === 'number' ? entry.steps : 0;
              if (stepsEndDate !== lastStepsEndDate) {
                cumulativeSteps += steps;
                lastStepsEndDate = stepsEndDate;
              }
              return {
                ...entry,
                heartRateEndDate: entry.heartRateEndDate || null,
                restingHeartRateEndDate: entry.restingHeartRateEndDate || null,
                stepsEndDate,
                totalSteps: cumulativeSteps,
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
      },
    );
    return () => subscription?.remove();
  }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

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
    const location = await getLocation(5000);
    payload.location = getGoogleMapsUrl(location);
    dispatch(updateUser(payload));
  }, [dispatch]);

  useEffect(() => {
    handleHealthTriggerCheck();
    handleTimeTriggerCheck();
  }, [handleHealthTriggerCheck, handleTimeTriggerCheck]);

  useEffect(() => {
    requestLocationPermission(false)
      .then(isGranted => {
        const values: EmergencyButtonSettings = {locationAccess: isGranted};
        dispatch(updateEmergencyButtonSettings(values));
        isGranted && handleLocationChange();
        updateDataCollectionStatus();
      })
      .catch(() => console.log('Could not get location'));
  }, [dispatch, handleLocationChange]);

  useEffect(() => {
    isActive &&
      (async () => {
        const isInEmergencyState = await AsyncStorageService.getItem(
          AsyncStorageEnum.IsEmergencyEscalationStarted,
        );
        if (JSON.parse(isInEmergencyState ?? 'false')) {
          navigate(Screens.HealthConditionError as never);
        }
      })();
  }, [isActive, navigate]);

  /* ----- derived state ----- */
  const contactsReady = hasContacts && areContactsEnabled;
  const fullySetUp = contactsReady && !!automatedEmergency;

  const bannerVariant = fullySetUp ? 'active' : 'degraded';
  const bannerText = fullySetUp
    ? t('dashboardHome.banner.active')
    : !contactsReady
    ? t('dashboardHome.banner.noContacts')
    : t('dashboardHome.banner.systemOff');

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboardHome.greeting.morning')
      : hour < 18
      ? t('dashboardHome.greeting.afternoon')
      : t('dashboardHome.greeting.evening');

  const collectedAt = formatCollectedAt(
    health?.heartRateEndDate || health?.stepsEndDate,
  );

  const heartRate = health?.heartRate;
  const steps = health?.totalSteps ?? health?.steps;

  const hrCaption = (() => {
    if (heartRate == null) {
      return t('dashboardHome.metrics.noData');
    }
    if (heartRate < 60) {
      return `bpm · ${t('dashboardHome.metrics.low')}`;
    }
    if (heartRate > 100) {
      return `bpm · ${t('dashboardHome.metrics.high')}`;
    }
    return `bpm · ${t('dashboardHome.metrics.normal')}`;
  })();

  const stepsCaption = (() => {
    if (steps == null) {
      return t('dashboardHome.metrics.noData');
    }
    const level =
      steps < 5000
        ? t('dashboardHome.metrics.low')
        : steps < 10000
        ? t('dashboardHome.metrics.moderate')
        : t('dashboardHome.metrics.high');
    return `${t('dashboardHome.metrics.today')} · ${level}`;
  })();

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

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>{t('welcome.eyebrow')}</Text>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {user.name || ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={goSettings}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t('headers.accountSettings')}>
            <View style={[styles.menuLine, styles.menuLineLong]} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={[styles.menuLine, styles.menuLineLong]} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: tabBarHeight + 12},
        ]}
        showsVerticalScrollIndicator={false}>
        <StatusBanner variant={bannerVariant} title={bannerText} />

        <View style={styles.metricsCard}>
          <Text style={styles.collectedAt}>
            {collectedAt
              ? t('dashboardHome.collectedAt', {time: collectedAt})
              : t('dashboardHome.collectedAtNone')}
          </Text>
          <View style={styles.metricsRow}>
            <MetricCard
              icon={<HeartPulseIcon size={14} color="#D6455D" />}
              label={t('dashboardHome.metrics.heartRate')}
              value={heartRate != null ? String(heartRate) : '—'}
              caption={hrCaption}
            />
            <MetricCard
              icon={<FootprintsIcon size={14} color="#2B6E99" />}
              label={t('dashboardHome.metrics.steps')}
              value={steps != null ? String(steps) : '—'}
              caption={stepsCaption}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          {t('dashboardHome.sectionEmergencySystem')}
        </Text>

        <View style={styles.cards}>
          <SystemCard
            chip={
              <IconChip background="rgba(207, 233, 223, 0.5)">
                <EmergencySystemIcon size={18} color="#2F9E7A" />
              </IconChip>
            }
            title={t('dashboardHome.cards.emergencySystem.title')}
            subtitle={
              automatedEmergency
                ? t('dashboardHome.cards.emergencySystem.active')
                : t('dashboardHome.cards.emergencySystem.inactive')
            }
            onPress={goAutomatedEmergency}
            right={
              <Toggle
                value={!!automatedEmergency}
                onChange={goAutomatedEmergency}
              />
            }
          />
          <SystemCard
            chip={
              <IconChip background="rgba(243, 222, 199, 0.6)">
                <ClipboardListIcon size={18} color="#B7791F" />
              </IconChip>
            }
            title={t('dashboardHome.cards.healthLogs.title')}
            subtitle={t('dashboardHome.cards.healthLogs.subtitle')}
            right="chevron"
            onPress={goHealthLogs}
          />
          <SystemCard
            chip={
              <IconChip background="rgba(251, 188, 5, 0.15)">
                <BroadcastIcon size={18} color="#B7791F" />
              </IconChip>
            }
            title={t('dashboardHome.cards.manageSettings.title')}
            subtitle={
              contactsReady
                ? t('dashboardHome.cards.manageSettings.subtitle')
                : t('dashboardHome.cards.manageSettings.subtitleEmpty')
            }
            right="chevron"
            onPress={goEmergencyContacts}
          />
          <SystemCard
            chip={
              <IconChip background="rgba(217, 239, 230, 0.6)">
                <CircleCheckIcon size={18} color="#1E9B6B" />
              </IconChip>
            }
            title={t('dashboardHome.cards.emergencySetup.title')}
            subtitle={
              fullySetUp
                ? t('dashboardHome.cards.emergencySetup.done')
                : t('dashboardHome.cards.emergencySetup.todo')
            }
            highlighted={fullySetUp}
            onPress={goAutomatedEmergency}
            right={
              <Badge
                label={
                  fullySetUp
                    ? t('dashboardHome.cards.emergencySetup.badgeDone')
                    : t('dashboardHome.cards.emergencySetup.badgeTodo')
                }
                tone={fullySetUp ? 'success' : 'warning'}
              />
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Badge = ({label, tone}: {label: string; tone: 'success' | 'warning'}) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor:
          tone === 'success'
            ? 'rgba(30, 155, 107, 0.2)'
            : 'rgba(245, 166, 35, 0.2)',
      },
    ]}>
    <Text
      style={[
        styles.badgeText,
        {color: tone === 'success' ? '#1E9B6B' : '#D4820A'},
      ]}>
      {label}
    </Text>
  </View>
);

export default Dashboard;
