import React, {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSleepSchedule,
  saveSleepSchedule,
  formatTime,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import {semanticColors} from '~/theme/tokens';
import Toggle from '~/components/Toggle';
import {BioEmergencySettingsFillFlame} from '~/assets/icons/BiostasisIcons';
import ToastService from '~/services/Toast.service';

interface Props {
  refreshKey?: number;
  required?: boolean;
}

const schedulesEqual = (a: SleepSchedule, b: SleepSchedule) =>
  a.enabled === b.enabled &&
  a.bedtimeHour === b.bedtimeHour &&
  a.bedtimeMinute === b.bedtimeMinute &&
  a.wakeHour === b.wakeHour &&
  a.wakeMinute === b.wakeMinute;

const SleepSchedulePanel = ({refreshKey, required = false}: Props) => {
  const {t} = useAppTranslation();
  const [schedule, setSchedule] = useState<SleepSchedule>({
    enabled: false,
    bedtimeHour: 22,
    bedtimeMinute: 0,
    wakeHour: 7,
    wakeMinute: 0,
  });
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);

  useEffect(() => {
    getSleepSchedule().then(setSchedule);
  }, [refreshKey]);

  const persistSchedule = useCallback(async (updated: SleepSchedule) => {
    setSchedule(updated);
    await saveSleepSchedule(updated);
  }, []);

  const showUpdatedToast = useCallback(() => {
    ToastService.success(
      t(
        'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.updatedToast',
      ),
    );
  }, [t]);

  const handleToggle = useCallback(
    async (value: boolean) => {
      if (required && !value) {
        return;
      }
      const updated = {...schedule, enabled: value};
      if (schedulesEqual(schedule, updated)) {
        return;
      }
      await persistSchedule(updated);
      showUpdatedToast();
    },
    [persistSchedule, required, schedule, showUpdatedToast],
  );

  const handleBedtimeConfirm = useCallback(
    async (date: Date) => {
      setShowBedtimePicker(false);
      const updated = {
        ...schedule,
        enabled: required ? true : schedule.enabled,
        bedtimeHour: date.getHours(),
        bedtimeMinute: date.getMinutes(),
      };
      if (schedulesEqual(schedule, updated)) {
        return;
      }
      await persistSchedule(updated);
      showUpdatedToast();
    },
    [persistSchedule, required, schedule, showUpdatedToast],
  );

  const handleWakeConfirm = useCallback(
    async (date: Date) => {
      setShowWakePicker(false);
      const updated = {
        ...schedule,
        enabled: required ? true : schedule.enabled,
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      };
      if (schedulesEqual(schedule, updated)) {
        return;
      }
      await persistSchedule(updated);
      showUpdatedToast();
    },
    [persistSchedule, required, schedule, showUpdatedToast],
  );

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);
  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <BioEmergencySettingsFillFlame />
        <Text style={styles.title}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.title',
          )}
        </Text>
      </View>
      <Text style={styles.description}>
        {t(
          required
            ? 'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.requiredDescription'
            : 'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.description',
        )}
      </Text>

      {!required ? (
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.enableSchedule',
            )}
          </Text>
          <Toggle value={schedule.enabled} onChange={handleToggle} />
        </View>
      ) : null}

      {required || schedule.enabled ? (
        <View style={styles.timeCards}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.timeCard}
            onPress={() => setShowBedtimePicker(true)}>
            <Text style={styles.timeEmoji}>🌙</Text>
            <Text style={styles.timeCardLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.bedtime',
              )}
            </Text>
            <Text style={styles.timeCardValue}>
              {formatTime(schedule.bedtimeHour, schedule.bedtimeMinute)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.timeCard}
            onPress={() => setShowWakePicker(true)}>
            <Text style={styles.timeEmoji}>☀️</Text>
            <Text style={styles.timeCardLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.wakeTime',
              )}
            </Text>
            <Text style={styles.timeCardValue}>
              {formatTime(schedule.wakeHour, schedule.wakeMinute)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <DateTimePickerModal
        isVisible={showBedtimePicker}
        mode="time"
        date={bedtimeDate}
        onConfirm={handleBedtimeConfirm}
        onCancel={() => setShowBedtimePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        isDarkModeEnabled={false}
        themeVariant="light"
        textColor={semanticColors.primary}
        accentColor={semanticColors.primary}
        buttonTextColorIOS={semanticColors.primary}
      />
      <DateTimePickerModal
        isVisible={showWakePicker}
        mode="time"
        date={wakeDate}
        onConfirm={handleWakeConfirm}
        onCancel={() => setShowWakePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        isDarkModeEnabled={false}
        themeVariant="light"
        textColor={semanticColors.primary}
        accentColor={semanticColors.primary}
        buttonTextColorIOS={semanticColors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#3D5470',
  },
  toggleRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLabel: {
    flex: 1,
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  timeCards: {
    flexDirection: 'row',
    gap: 10,
  },
  timeCard: {
    flex: 1,
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  timeEmoji: {
    fontSize: 18,
  },
  timeCardLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: semanticColors.textSecondary,
  },
  timeCardValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    color: semanticColors.primary,
  },
});

export default SleepSchedulePanel;
