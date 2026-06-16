import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {XIcon} from '~/assets/icons/AppIcons';
import NativeBottomSheet from '~/components/NativeBottomSheet';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSleepSchedule,
  saveSleepSchedule,
  formatTime,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import {layout, semanticColors, typography} from '~/theme/tokens';
import ToastService from '~/services/Toast.service';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const schedulesEqual = (a: SleepSchedule, b: SleepSchedule) =>
  a.enabled === b.enabled &&
  a.bedtimeHour === b.bedtimeHour &&
  a.bedtimeMinute === b.bedtimeMinute &&
  a.wakeHour === b.wakeHour &&
  a.wakeMinute === b.wakeMinute;

const SleepScheduleBottomSheet = ({visible, onDismiss}: Props) => {
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
    if (visible) {
      getSleepSchedule().then(setSchedule);
    }
  }, [visible]);

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

  const handleBedtimeConfirm = useCallback(
    async (date: Date) => {
      setShowBedtimePicker(false);
      const updated = {
        ...schedule,
        enabled: true,
        bedtimeHour: date.getHours(),
        bedtimeMinute: date.getMinutes(),
      };
      if (schedulesEqual(schedule, updated)) {
        return;
      }
      await persistSchedule(updated);
      showUpdatedToast();
    },
    [schedule, persistSchedule, showUpdatedToast],
  );

  const handleWakeConfirm = useCallback(
    async (date: Date) => {
      setShowWakePicker(false);
      const updated = {
        ...schedule,
        enabled: true,
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      };
      if (schedulesEqual(schedule, updated)) {
        return;
      }
      await persistSchedule(updated);
      showUpdatedToast();
    },
    [schedule, persistSchedule, showUpdatedToast],
  );

  const handleSave = useCallback(async () => {
    const updated = {...schedule, enabled: true};
    const changed = !schedulesEqual(schedule, updated);
    await persistSchedule(updated);
    onDismiss();
    if (changed) {
      showUpdatedToast();
    }
  }, [schedule, persistSchedule, onDismiss, showUpdatedToast]);

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);
  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  return (
    <>
      <NativeBottomSheet
        visible={visible}
        onDismiss={onDismiss}
        sheetStyle={styles.sheet}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
            onPress={onDismiss}
            style={styles.closeButton}>
            <XIcon size={20} color={semanticColors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.title',
          )}
        </Text>
        <Text style={styles.description}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.description',
          )}
        </Text>

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

        <Text style={styles.hint}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.hint',
          )}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.save',
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={onDismiss}>
          <Text style={styles.cancelButtonText}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.skip',
            )}
          </Text>
        </TouchableOpacity>
      </NativeBottomSheet>

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
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  headerSpacer: {
    width: 20,
    height: 20,
  },
  closeButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 22,
    color: semanticColors.primary,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  timeCards: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  timeEmoji: {
    fontSize: 20,
  },
  timeCardLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: semanticColors.textSecondary,
  },
  timeCardValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    color: semanticColors.primary,
  },
  hint: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: semanticColors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  saveButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  saveButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelButtonText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: semanticColors.danger,
  },
});

export default SleepScheduleBottomSheet;
