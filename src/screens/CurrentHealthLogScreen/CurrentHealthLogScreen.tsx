import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {Screens} from '~/models/Navigation.model';
import ScreenHeader from '~/components/ScreenHeader';
import {HeartIcon} from '~/assets/icons/AppIcons';
import styles from './styles';

const formatDateTime = (value?: number | string | null): string => {
  if (!value) {
    return 'N/A';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(
    date.getMonth() + 1,
  )}.${date.getFullYear()} · ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
};

const CurrentHealthLogScreen = () => {
  const {t} = useAppTranslation();
  const navigation = useNavigation();
  const health = useAppSelector(state => state.health.data);

  const hasData = !!health;

  const dateRows = [
    {
      label: t('currentHealthLog.hrEndDate'),
      value: formatDateTime(health?.heartRateEndDate),
    },
    {
      label: t('currentHealthLog.restingHrEndDate'),
      value: formatDateTime(health?.restingHeartRateEndDate),
    },
    {
      label: t('currentHealthLog.stepsEndDate'),
      value: formatDateTime(health?.stepsEndDate),
    },
  ];

  const metrics = [
    {
      label: t('currentHealthLog.heartRate'),
      value: health?.heartRate != null ? String(health.heartRate) : '0',
      unit: 'bpm',
    },
    {
      label: t('currentHealthLog.steps'),
      value: health?.steps != null ? String(health.steps) : '0',
      unit: t('currentHealthLog.today'),
    },
    {
      label: t('currentHealthLog.restingHr'),
      value:
        health?.restingHeartRate != null
          ? String(health.restingHeartRate)
          : '0',
      unit: 'bpm',
    },
    {
      label: t('currentHealthLog.totalSteps'),
      value: health?.totalSteps != null ? String(health.totalSteps) : '0',
      unit: t('currentHealthLog.session'),
    },
  ];

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
        {!hasData ? (
          <View style={styles.rows}>
            {[
              t('currentHealthLog.heartRate'),
              t('currentHealthLog.restingHeartRate'),
              t('currentHealthLog.steps'),
              t('currentHealthLog.totalSteps'),
            ].map(label => (
              <View key={label} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValueMuted}>—</Text>
              </View>
            ))}
            {dateRows.map(row => (
              <View key={row.label} style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValueAccent}>N/A</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.rows}>
            {dateRows.map(row => (
              <View key={row.label} style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValueAccent}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!hasData}
          onPress={() =>
            navigation.dispatch(StackActions.push(Screens.HistoryLogs))
          }
          style={[styles.historyButton, !hasData && styles.historyButtonDisabled]}>
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
