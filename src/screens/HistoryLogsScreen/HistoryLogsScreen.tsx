import React, {useCallback, useMemo} from 'react';
import {FlatList, Text, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import ScreenHeader from '~/components/ScreenHeader';
import styles from './styles';

type HealthEntry = {
  heartRate?: number | null;
  steps?: number | null;
  totalSteps?: number | null;
  heartRateEndDate?: number | string | null;
  restingHeartRateEndDate?: number | string | null;
  stepsEndDate?: number | string | null;
};

type DayLog = {
  key: string;
  timestamp: number;
  dateLabel: string;
  totalSteps: number | null;
  latestHeartRate: number | null;
  averageHeartRate: number | null;
  sampleCount: number;
  lastChecked: number | null;
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

const getLocalDayKey = (timestamp?: number | null): string => {
  if (!timestamp) {
    return 'unknown';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const formatDay = (timestamp?: number | null): string => {
  if (!timestamp) {
    return 'Unknown day';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown day';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
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

const getStepsValue = (entry: HealthEntry): number | null => {
  const value = entry.totalSteps ?? entry.steps;
  return value == null ? null : value;
};

const buildDailyLogs = (entries: HealthEntry[]): DayLog[] => {
  const grouped = new Map<string, HealthEntry[]>();

  entries.forEach(entry => {
    const dayKey = getLocalDayKey(getLatestTimestamp(entry));
    grouped.set(dayKey, [...(grouped.get(dayKey) ?? []), entry]);
  });

  return Array.from(grouped.entries())
    .map(([key, dayEntries]) => {
      const timestamps = dayEntries
        .map(getLatestTimestamp)
        .filter((value): value is number => value != null);
      const lastChecked = timestamps.length ? Math.max(...timestamps) : null;
      const stepsValues = dayEntries
        .map(getStepsValue)
        .filter((value): value is number => value != null);
      const heartRateEntries = dayEntries
        .filter(entry => entry.heartRate != null)
        .sort(
          (a, b) =>
            (getLatestTimestamp(b) ?? 0) - (getLatestTimestamp(a) ?? 0),
        );
      const heartRates = dayEntries
        .map(entry => entry.heartRate)
        .filter((value): value is number => value != null);
      const averageHeartRate = heartRates.length
        ? Math.round(
            heartRates.reduce((sum, value) => sum + value, 0) /
              heartRates.length,
          )
        : null;

      return {
        key,
        timestamp: lastChecked ?? 0,
        dateLabel: formatDay(lastChecked),
        totalSteps: stepsValues.length ? Math.max(...stepsValues) : null,
        latestHeartRate: heartRateEntries[0]?.heartRate ?? null,
        averageHeartRate,
        sampleCount: dayEntries.length,
        lastChecked,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

const HistoryLogsScreen = () => {
  const {t} = useAppTranslation();
  const allData = useAppSelector(state => state.health.allData) as HealthEntry[];
  const dailyData = useMemo(() => buildDailyLogs(allData), [allData]);

  const stats = useMemo(() => {
    const totalSteps = dailyData.reduce(
      (sum, day) => sum + (day.totalSteps ?? 0),
      0,
    );
    const bestDay = dailyData.reduce<DayLog | null>((best, day) => {
      if (!best) {
        return day;
      }
      return (day.totalSteps ?? 0) > (best.totalSteps ?? 0) ? day : best;
    }, null);
    const averageSteps = dailyData.length
      ? Math.round(totalSteps / dailyData.length)
      : null;

    return [
      {
        label: t('historyLogs.stats.daysTracked'),
        value: formatNumber(dailyData.length),
      },
      {
        label: t('historyLogs.stats.totalSteps'),
        value: formatNumber(totalSteps),
      },
      {
        label: t('historyLogs.stats.averageSteps'),
        value: formatNumber(averageSteps),
      },
      {
        label: t('historyLogs.stats.bestDay'),
        value: bestDay?.dateLabel ?? '—',
      },
    ];
  }, [dailyData, t]);

  const renderHeader = useCallback(
    () =>
      dailyData.length ? (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>{t('historyLogs.stats.title')}</Text>
          <View style={styles.statsGrid}>
            {stats.map(item => (
              <View key={item.label} style={styles.statTile}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null,
    [dailyData.length, stats, t],
  );

  const renderEntry = useCallback(
    ({item}: {item: DayLog}) => {
      const metrics = [
        {
          label: t('historyLogs.totalSteps'),
          value: formatNumber(item.totalSteps),
          unit: '',
        },
        {
          label: t('historyLogs.latestHeartRate'),
          value:
            item.latestHeartRate != null
              ? formatNumber(item.latestHeartRate)
              : '—',
          unit: item.latestHeartRate != null ? 'bpm' : '',
        },
        {
          label: t('historyLogs.averageHeartRate'),
          value:
            item.averageHeartRate != null
              ? formatNumber(item.averageHeartRate)
              : '—',
          unit: item.averageHeartRate != null ? 'bpm' : '',
        },
      ];

      return (
        <View style={styles.entry}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>{item.dateLabel}</Text>
              <Text style={styles.entryMeta}>
                {t('historyLogs.samples', {count: item.sampleCount})}
              </Text>
            </View>
            <Text style={styles.entryDate}>{formatDateTime(item.lastChecked)}</Text>
          </View>

          <View style={styles.chips}>
            {metrics.map(metric => (
              <View key={metric.label} style={styles.chip}>
                <Text style={styles.chipLabel}>{metric.label}</Text>
                <Text style={styles.chipValue}>
                  {metric.value}
                  {metric.unit ? (
                    <Text style={styles.chipUnit}> {metric.unit}</Text>
                  ) : null}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    },
    [t],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('historyLogs.title')} />
      <FlatList
        style={styles.list}
        data={dailyData}
        keyExtractor={item => item.key}
        renderItem={renderEntry}
        ListHeaderComponent={renderHeader}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        removeClippedSubviews
        windowSize={7}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('historyLogs.empty')}</Text>
        }
      />
    </View>
  );
};

export default HistoryLogsScreen;
