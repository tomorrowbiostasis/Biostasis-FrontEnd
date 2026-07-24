import React, {useMemo} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {Screens} from '~/models/Navigation.model';
import ScreenHeader from '~/components/ScreenHeader';
import {HeartIcon} from '~/assets/icons/AppIcons';
import styles from './styles';

type HealthEntry = {
  heartRate?: number | null;
  steps?: number | null;
  totalSteps?: number | null;
  heartRateEndDate?: number | string | null;
  restingHeartRateEndDate?: number | string | null;
  stepsEndDate?: number | string | null;
};

const normalizeTimestamp = (value?: number | string | null): number | null => {
  if (!value) {
    return null;
  }

  const numericValue = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return numericValue < 10000000000 ? numericValue * 1000 : numericValue;
};

const getLatestTimestamp = (entry?: HealthEntry | null): number | null => {
  if (!entry) {
    return null;
  }

  const timestamps = [
    normalizeTimestamp(entry.heartRateEndDate),
    normalizeTimestamp(entry.restingHeartRateEndDate),
    normalizeTimestamp(entry.stepsEndDate),
  ].filter((value): value is number => value != null);

  return timestamps.length ? Math.max(...timestamps) : null;
};

const formatDateTime = (timestamp?: number | null): string => {
  if (!timestamp) {
    return '—';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatNumber = (value?: number | null): string => {
  if (value == null) {
    return '—';
  }

  return new Intl.NumberFormat().format(value);
};

const toLocalDayKey = (timestamp?: number | null): string | null => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const CurrentHealthLogScreen = () => {
  const {t} = useAppTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const health = useAppSelector(state => state.health.data) as HealthEntry | null;
  const allData = useAppSelector(state => state.health.allData);

  const hasData = !!health;
  const lastChecked = useMemo(() => getLatestTimestamp(health), [health]);
  const historyDayCount = useMemo(() => {
    const days = new Set<string>();
    allData.forEach(entry => {
      const dayKey = toLocalDayKey(getLatestTimestamp(entry));
      if (dayKey) {
        days.add(dayKey);
      }
    });
    return days.size;
  }, [allData]);

  const metrics = useMemo(
    () => [
      {
        label: t('currentHealthLog.heartRate'),
        value: formatNumber(health?.heartRate),
        unit: 'bpm',
      },
      {
        label: t('currentHealthLog.steps'),
        value: formatNumber(health?.steps),
        unit: t('currentHealthLog.today'),
      },
    ],
    [health, t],
  );

  const readings = useMemo(
    () => [
      {
        label: t('currentHealthLog.heartRate'),
        value:
          health?.heartRate != null
            ? `${formatNumber(health.heartRate)} bpm`
            : '—',
        detail: formatDateTime(normalizeTimestamp(health?.heartRateEndDate)),
      },
      {
        label: t('currentHealthLog.stepsToday'),
        value: formatNumber(health?.steps),
        detail: formatDateTime(normalizeTimestamp(health?.stepsEndDate)),
      },
    ],
    [health, t],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('currentHealthLog.title')}>
        {hasData ? (
          <View style={styles.metricGrid}>
            {metrics.map(metric => (
              <View key={metric.label} style={styles.metricTile}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyHeader}>
            <HeartIcon size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyTitle}>
              {t('currentHealthLog.emptyTitle')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('currentHealthLog.emptySubtitle')}
            </Text>
          </View>
        )}
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>
            {t('currentHealthLog.snapshotTitle')}
          </Text>
          <Text style={styles.cardDescription}>
            {hasData
              ? t('currentHealthLog.snapshotDescription')
              : t('currentHealthLog.emptySnapshotDescription')}
          </Text>
          <View style={styles.summaryDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('currentHealthLog.lastChecked')}</Text>
            <Text style={styles.rowValueAccent}>{formatDateTime(lastChecked)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('currentHealthLog.historyDays')}</Text>
            <Text style={styles.rowValueAccent}>
              {new Intl.NumberFormat().format(historyDayCount)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>
            {t('currentHealthLog.latestReadings')}
          </Text>
          <View style={styles.readings}>
            {readings.map(reading => (
              <View key={reading.label} style={styles.readingRow}>
                <View>
                  <Text style={styles.rowLabel}>{reading.label}</Text>
                  <Text style={styles.readingDetail}>{reading.detail}</Text>
                </View>
                <Text style={styles.rowValueAccent}>{reading.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!hasData}
          onPress={() =>
            navigation.dispatch(StackActions.push(Screens.HistoryLogs))
          }
          style={[
            styles.historyButton,
            !hasData && styles.historyButtonDisabled,
          ]}>
          <Text
            style={[
              styles.historyButtonText,
              !hasData && styles.historyButtonTextDisabled,
            ]}>
            {t('currentHealthLog.viewHistory')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CurrentHealthLogScreen;
