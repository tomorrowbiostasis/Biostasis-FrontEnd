import React from 'react';
import {FlatList, Text, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import ScreenHeader from '~/components/ScreenHeader';
import styles from './styles';

const pad = (n: number) => n.toString().padStart(2, '0');

const formatDateTime = (value?: number | string | null): string => {
  if (!value) {
    return 'N/A';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return `${pad(date.getDate())}.${pad(
    date.getMonth() + 1,
  )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

const HistoryLogsScreen = () => {
  const {t} = useAppTranslation();
  const allData = useAppSelector(state => state.health.allData);

  const renderEntry = ({item, index}: {item: any; index: number}) => {
    const chips = [
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
        label: t('currentHealthLog.steps'),
        value: item.steps != null ? String(item.steps) : '0',
        unit: '',
      },
      {
        label: t('currentHealthLog.totalSteps'),
        value: item.totalSteps != null ? String(item.totalSteps) : '0',
        unit: '',
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
            {formatDateTime(item.heartRateEndDate || item.stepsEndDate)}
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
        data={allData}
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
