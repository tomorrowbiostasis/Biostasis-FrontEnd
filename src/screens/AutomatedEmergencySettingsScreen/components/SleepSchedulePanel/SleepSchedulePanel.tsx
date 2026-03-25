import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Text} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSleepSchedule,
  saveSleepSchedule,
  formatTime,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import colors from '~/theme/colors';
import styles from '../../styles';

interface Props {
  refreshKey?: number;
}

const SleepSchedulePanel = ({refreshKey}: Props) => {
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

  const handleToggle = useCallback(
    (value: boolean) => {
      persistSchedule({...schedule, enabled: value});
    },
    [schedule, persistSchedule],
  );

  const handleBedtimeConfirm = useCallback(
    (date: Date) => {
      setShowBedtimePicker(false);
      persistSchedule({
        ...schedule,
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
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      });
    },
    [schedule, persistSchedule],
  );

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);

  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={[styles.circle, styles.icon]}>
          <IconIonicons name="moon" size={20} color="#4682B4" />
        </View>
        <Text style={styles.panelTitle} fontWeight={700}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.title',
          )}
        </Text>
      </View>
      <View style={styles.lineStyle} />

      <View style={styles.panelBody}>
        <Text style={styles.panelInfoText}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.description',
          )}
        </Text>

        <SwitchButton
          value={schedule.enabled}
          title={t(
            'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.enableSchedule',
          )}
          containerStyle={styles.switchButton}
          onSwitchPress={handleToggle}
        />

        {schedule.enabled && (
          <View style={{marginTop: 16}}>
            <TouchableOpacity
              onPress={() => setShowBedtimePicker(true)}
              style={[styles.activeButton, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconIonicons
                  name="moon"
                  size={18}
                  color="#4682B4"
                  style={{marginRight: 12}}
                />
                <Text style={styles.buttonText}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.bedtime',
                  )}
                </Text>
              </View>
              <Text style={[styles.buttonText, {color: colors.blue[800]}]}>
                {formatTime(schedule.bedtimeHour, schedule.bedtimeMinute)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowWakePicker(true)}
              style={[styles.activeButton, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconIonicons
                  name="sunny"
                  size={18}
                  color="#F4BB44"
                  style={{marginRight: 12}}
                />
                <Text style={styles.buttonText}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.wakeTime',
                  )}
                </Text>
              </View>
              <Text style={[styles.buttonText, {color: colors.blue[800]}]}>
                {formatTime(schedule.wakeHour, schedule.wakeMinute)}
              </Text>
            </TouchableOpacity>

            <Text
              fontSize="xs"
              style={{
                color: colors.gray[600],
                textAlign: 'center',
                marginTop: 8,
              }}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.sleepWindow',
                {
                  bedtime: formatTime(
                    schedule.bedtimeHour,
                    schedule.bedtimeMinute,
                  ),
                  wakeTime: formatTime(
                    schedule.wakeHour,
                    schedule.wakeMinute,
                  ),
                },
              )}
            </Text>
          </View>
        )}
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
    </View>
  );
};

export default SleepSchedulePanel;
