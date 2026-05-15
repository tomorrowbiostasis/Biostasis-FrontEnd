import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSleepSchedule,
  saveSleepSchedule,
  formatTime,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import {semanticColors} from '~/theme/tokens';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

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

  const handleBedtimeConfirm = useCallback(
    (date: Date) => {
      setShowBedtimePicker(false);
      persistSchedule({
        ...schedule,
        enabled: true,
        bedtimeHour: date.getHours(),
        bedtimeMinute: date.getMinutes(),
      });
    },
    [schedule, persistSchedule],
  );

  const handleWakeConfirm = useCallback(
    (date: Date) => {
      setShowWakePicker(false);
      persistSchedule({
        ...schedule,
        enabled: true,
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      });
    },
    [schedule, persistSchedule],
  );

  const handleSave = useCallback(() => {
    persistSchedule({...schedule, enabled: true});
    onDismiss();
  }, [schedule, persistSchedule, onDismiss]);

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);
  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

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
      </View>

      <DateTimePickerModal
        isVisible={showBedtimePicker}
        mode="time"
        date={bedtimeDate}
        onConfirm={handleBedtimeConfirm}
        onCancel={() => setShowBedtimePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
      <DateTimePickerModal
        isVisible={showWakePicker}
        mode="time"
        date={wakeDate}
        onConfirm={handleWakeConfirm}
        onCancel={() => setShowWakePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: semanticColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: semanticColors.borderStrong,
    alignSelf: 'center',
    marginBottom: 20,
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
    height: 48,
    borderRadius: 14,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
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
