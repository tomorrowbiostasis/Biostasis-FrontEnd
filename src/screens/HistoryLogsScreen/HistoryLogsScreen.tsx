import React, {useMemo} from 'react';
import {FlatList, Text, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import ScreenHeader from '~/components/ScreenHeader';
import styles from './styles';

const pad = (n: number) => n.toString().padStart(2, '0');

const formatDateTime = (value?: number | string | null): string => {
  const timestamp = normalizeTimestamp(value);
  if (!timestamp) {
    return 'N/A';
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return `${pad(date.getDate())}.${pad(
    date.getMonth() + 1,
  )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

const normalizeTimestamp = (value?: number | string | null): number | null => {
  if (!value) {
    return null;
  }
  const numericValue =
    typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return null;
  }
  return numericValue < 10000000000 ? numericValue * 1000 : numericValue;
};

const formatDay = (value?: number | string | null): string => {
  const timestamp = normalizeTimestamp(value);
  if (!timestamp) {
    return 'N/A';
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return `${pad(date.getDate())}.${pad(
    date.getMonth() + 1,
  )}.${date.getFullYear()}`;
};

const toDayKey = (value?: number | string | null): string => {
  const timestamp = normalizeTimestamp(value);
  if (!timestamp) {
    return 'unknown';
  }
  return new Date(timestamp).toISOString().slice(0, 10);
};

const HistoryLogsScreen = () => {
  const {t} = useAppTranslation();
  const allData = useAppSelector(state => state.health.allData);
  const dailyData = useMemo(() => {
    const byDay = new Map<string, any>();

    allData.forEach(item => {
      const daySource =
        item.stepsEndDate || item.heartRateEndDate || item.restingHeartRateEndDate;
      const dayKey = toDayKey(daySource);
      const current = byDay.get(dayKey);
      const itemSteps = item.totalSteps ?? item.steps ?? 0;
      const currentSteps = current?.totalSteps ?? current?.steps ?? 0;
      const itemTimestamp =
        normalizeTimestamp(daySource) ?? 0;
      const currentTimestamp = current
        ? normalizeTimestamp(
            current.stepsEndDate ||
              current.heartRateEndDate ||
              current.restingHeartRateEndDate,
          ) ?? 0
        : 0;

      const latestItem = currentTimestamp > itemTimestamp ? current : item;

      byDay.set(dayKey, {
        ...latestItem,
        steps: Math.max(itemSteps, currentSteps),
        totalSteps: Math.max(itemSteps, currentSteps),
      });
    });

    return Array.from(byDay.values()).sort((a, b) => {
      const aTime =
        normalizeTimestamp(a.stepsEndDate || a.heartRateEndDate) ?? 0;
      const bTime =
        normalizeTimestamp(b.stepsEndDate || b.heartRateEndDate) ?? 0;
      return bTime - aTime;
    });
  }, [allData]);

  const renderEntry = ({item, index}: {item: any; index: number}) => {
    const chips = [
      {
        label: t('currentHealthLog.totalSteps'),
        value: item.totalSteps != null ? String(item.totalSteps) : '0',
        unit: '',
      },
      {
        label: t('currentHealthLog.heartRate'),
        value: item.heartRate != null ? `${item.heartRate} ` : '0 ',
        unit: 'bpm',
      },
      {
        label: t('currentHealthLog.restingHeartRate'),
        value: item.restingHeartRate != null ? `${item.restingHeartRate} ` : '0 ',
        unit: 'bpm',
      },
      {
        label: t('historyLogs.hrEndDate'),
        value: formatDateTime(item.heartRateEndDate),
        unit: '',
      },
      {
        label: t('historyLogs.stepsEndDate'),
        value: formatDateTime(item.stepsEndDate),
        unit: '',
      },
      {
        label: t('historyLogs.restingHrEndDate'),
        value: formatDateTime(item.restingHeartRateEndDate),
        unit: '',
      },
    ];

    return (
      <View style={styles.entry}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryTitle}>
            {t('historyLogs.entry', {index: index + 1})}
          </Text>
          <Text style={styles.entryDate}>
            {formatDay(item.stepsEndDate || item.heartRateEndDate)}
          </Text>
        </View>
        <View style={styles.chips}>
          {chips.map(chip => (
            <View key={chip.label} style={styles.chip}>
              <Text style={styles.chipLabel}>{chip.label}</Text>
              <Text style={styles.chipValue}>
                {chip.value}
                {chip.unit ? <Text style={styles.chipUnit}>{chip.unit}</Text> : null}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('historyLogs.title')} />
      <FlatList
        style={styles.list}
        data={dailyData}
        keyExtractor={(_, index) => `entry-${index}`}
        renderItem={renderEntry}
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
