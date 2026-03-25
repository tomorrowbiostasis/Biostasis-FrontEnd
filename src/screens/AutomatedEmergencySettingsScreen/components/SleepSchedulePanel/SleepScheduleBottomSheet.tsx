import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import {Text} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSleepSchedule,
  saveSleepSchedule,
  formatTime,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import colors from '~/theme/colors';

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
        <View style={bsStyles.overlay} />
      </TouchableWithoutFeedback>

      <View style={bsStyles.sheet}>
        <View style={bsStyles.handle} />

        <View style={bsStyles.headerRow}>
          <View style={bsStyles.iconCircle}>
            <IconIonicons name="moon" size={22} color="#4682B4" />
          </View>
          <Text style={bsStyles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.title',
            )}
          </Text>
        </View>

        <Text style={bsStyles.description}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.description',
          )}
        </Text>

        <View style={bsStyles.timeRow}>
          <TouchableOpacity
            onPress={() => setShowBedtimePicker(true)}
            style={bsStyles.timeCard}>
            <IconIonicons name="moon" size={20} color="#4682B4" />
            <Text style={bsStyles.timeLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.bedtime',
              )}
            </Text>
            <Text style={bsStyles.timeValue}>
              {formatTime(schedule.bedtimeHour, schedule.bedtimeMinute)}
            </Text>
          </TouchableOpacity>

          <View style={bsStyles.arrowContainer}>
            <IconFeather name="arrow-right" size={18} color={colors.gray[400]} />
          </View>

          <TouchableOpacity
            onPress={() => setShowWakePicker(true)}
            style={bsStyles.timeCard}>
            <IconIonicons name="sunny" size={20} color="#F4BB44" />
            <Text style={bsStyles.timeLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.wakeTime',
              )}
            </Text>
            <Text style={bsStyles.timeValue}>
              {formatTime(schedule.wakeHour, schedule.wakeMinute)}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={bsStyles.hint}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.hint',
          )}
        </Text>

        <TouchableOpacity style={bsStyles.saveButton} onPress={handleSave}>
          <Text style={bsStyles.saveButtonText}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.sleepScheduleSheet.save',
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={bsStyles.skipButton} onPress={onDismiss}>
          <Text style={bsStyles.skipButtonText}>
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

const bsStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.gray[300],
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4682B418',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    flex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray[700],
    marginBottom: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeCard: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  timeLabel: {
    fontSize: 13,
    color: colors.gray[600],
    marginTop: 6,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
    marginTop: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4682B4',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    color: colors.gray[600],
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SleepScheduleBottomSheet;
