import {Modal, ScrollView, Text} from 'native-base';
import React, {FC, useCallback, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import colors from '~/theme/colors';
import {DaysOfTheWeekEnum, getUniqueId} from '../../util';
import {ISpecificDateComponentItem} from '../SpecificDateComponent/SpecificDateComponent';
import {DayOfTheWeekPicker} from './components/DayOfTheWeekPicker/DayOfTheWeekPicker';
import styles from './styles';

const initialDaysSelected: DaysOfTheWeekEnum[] = [0, 1, 2, 3, 4, 5, 6];

const initialItem: Omit<ISpecificDateComponentItem, 'id'> = {
  startDay: initialDaysSelected,
  startTime: null,
  endDay: initialDaysSelected,
  endTime: null,
  isActive: true,
};

type StartEndDayType = 'startDay' | 'endDay';

const formatTimeDisplay = (date: Date | null): string => {
  if (!date) {
    return '--:--';
  }
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

interface IDayTimePickerProps {
  item?: ISpecificDateComponentItem;
  onSave: (item: ISpecificDateComponentItem) => void;
  onClose: () => void;
}

export const DayTimePicker: FC<IDayTimePickerProps> = ({
  item,
  onClose,
  onSave,
}) => {
  const {t} = useAppTranslation();
  const [dayTimeItem, setDayTimeItem] = useState(
    item || {...initialItem, id: getUniqueId()},
  );
  const [activeTimePicker, setActiveTimePicker] = useState<
    'startTime' | 'endTime' | null
  >(null);

  const handleSave = useCallback(() => {
    onSave(dayTimeItem);
  }, [dayTimeItem, onSave]);

  const handleDayOfTheWeek = useCallback(
    (days: DaysOfTheWeekEnum[], startEnd: StartEndDayType) => {
      const start = dayTimeItem.startDay;
      const end = dayTimeItem.endDay;
      if (
        (days.length === 1 && end.length === 7) ||
        (days.length === 7 && end.length === 1) ||
        (days.length === 1 && start.length === 7) ||
        (days.length === 7 && start.length === 1)
      ) {
        return setDayTimeItem(prev => ({
          ...prev,
          startDay: days,
          endDay: days,
        }));
      }

      setDayTimeItem({
        ...dayTimeItem,
        [startEnd]: days,
      });
    },
    [dayTimeItem],
  );

  const handleTimeConfirm = useCallback(
    (date: Date) => {
      if (activeTimePicker) {
        setDayTimeItem(prev => ({...prev, [activeTimePicker]: date}));
      }
      setActiveTimePicker(null);
    },
    [activeTimePicker],
  );

  const canSave = !!dayTimeItem.startTime && !!dayTimeItem.endTime;

  const pickerDate =
    activeTimePicker && dayTimeItem[activeTimePicker]
      ? (dayTimeItem[activeTimePicker] as Date)
      : new Date();

  return (
    <Modal isOpen={true} style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconFeather name="x" size={18} color={colors.gray[700]} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {t('specificTimesScreen.specificTimes.title')}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={[styles.panel, styles.startPanel]}>
            <Text style={[styles.sectionLabel, styles.startLabel]}>
              {t('specificTimesScreen.specificTimes.startSection.pickDay')}
            </Text>
            <DayOfTheWeekPicker
              days={dayTimeItem.startDay}
              onChangeDays={days => handleDayOfTheWeek(days, 'startDay')}
            />
            <Text style={styles.timePickerLabel}>
              {t('specificTimesScreen.specificTimes.startSection.pickTime')}
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setActiveTimePicker('startTime')}>
              <IconIonicons
                name="time-outline"
                size={20}
                color={
                  dayTimeItem.startTime ? '#4CAF50' : colors.gray[400]
                }
              />
              <Text
                style={[
                  styles.timePickerValue,
                  !dayTimeItem.startTime && styles.timePickerPlaceholder,
                ]}>
                {formatTimeDisplay(dayTimeItem.startTime)}
              </Text>
              <IconFeather
                name="chevron-right"
                size={18}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.panel, styles.endPanel]}>
            <Text style={[styles.sectionLabel, styles.endLabel]}>
              {t('specificTimesScreen.specificTimes.endSection.pickDay')}
            </Text>
            <DayOfTheWeekPicker
              days={dayTimeItem.endDay}
              onChangeDays={days => handleDayOfTheWeek(days, 'endDay')}
            />
            <Text style={styles.timePickerLabel}>
              {t('specificTimesScreen.specificTimes.endSection.pickTime')}
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setActiveTimePicker('endTime')}>
              <IconIonicons
                name="time-outline"
                size={20}
                color={
                  dayTimeItem.endTime ? colors.blue[700] : colors.gray[400]
                }
              />
              <Text
                style={[
                  styles.timePickerValue,
                  !dayTimeItem.endTime && styles.timePickerPlaceholder,
                ]}>
                {formatTimeDisplay(dayTimeItem.endTime)}
              </Text>
              <IconFeather
                name="chevron-right"
                size={18}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}>
              <Text style={styles.saveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={!!activeTimePicker}
          mode="time"
          date={pickerDate}
          onConfirm={handleTimeConfirm}
          onCancel={() => setActiveTimePicker(null)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      </SafeAreaView>
    </Modal>
  );
};
