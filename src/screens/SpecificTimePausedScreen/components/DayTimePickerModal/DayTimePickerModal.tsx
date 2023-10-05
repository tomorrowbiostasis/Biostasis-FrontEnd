import {Button, Modal, ScrollView, Text} from 'native-base';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {DaysOfTheWeekEnum, getUniqueId} from '../../util';
import {DayOfTheWeekPicker} from './components/DayOfTheWeekPicker/DayOfTheWeekPicker';
import {ISpecificDateComponentItem} from '../SpecificDateComponent/SpecificDateComponent';
import styles from './styles';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {TimeFormatService} from '../../services/TimeFormat.service';
import {MaskedTimeView} from './components/MaskedTimeInput/MaskedTimeView';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '~/theme/colors';
import {View} from 'react-native';

const initialDaysSelected: DaysOfTheWeekEnum[] = [0, 1, 2, 3, 4, 5, 6];

const initialItem: Omit<ISpecificDateComponentItem, 'id'> = {
  startDay: initialDaysSelected,
  startTime: null,
  endDay: initialDaysSelected,
  endTime: null,
  isActive: true,
};

type StartEndDayType = 'startDay' | 'endDay';
type StartEndHourType = 'startTime' | 'endTime';

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
  const {is24TimeFormat} = useTimeFormat();
  const [dayTimeItem, setDayTimeItem] = useState(
    item || {...initialItem, id: getUniqueId()},
  );
  const [isStartHourValid, setIsStartHourValid] = useState(!!item);
  const [isEndHourValid, setIsEndHourValid] = useState(!!item);

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

  const handleHours = useCallback((time: Date, startEnd: StartEndHourType) => {
    setDayTimeItem(prev => ({
      ...prev,
      [startEnd]: time,
    }));
  }, []);

  const handleHoursValidation = useCallback(
    (isValid: boolean, startEnd: StartEndHourType) => {
      if (startEnd === 'startTime') {
        return setIsStartHourValid(isValid);
      }
      setIsEndHourValid(isValid);
    },
    [],
  );

  const getStartTimeFormatted = useCallback(() => {
    return new TimeFormatService(dayTimeItem.startTime).format(is24TimeFormat);
  }, [dayTimeItem.startTime, is24TimeFormat]);

  const getEndTimeFormatted = useCallback(() => {
    return new TimeFormatService(dayTimeItem.endTime).format(is24TimeFormat);
  }, [dayTimeItem.endTime, is24TimeFormat]);

  const startTimeFormatted = useMemo(
    () => getStartTimeFormatted(),
    [getStartTimeFormatted],
  );

  const endTimeFormatted = useMemo(
    () => getEndTimeFormatted(),
    [getEndTimeFormatted],
  );

  return (
    <Modal isOpen={true} style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.title}>
          {t('specificTimesScreen.specificTimes.title')}
        </Text>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.panel}>
            <Text style={styles.label}>
              {t('specificTimesScreen.specificTimes.startSection.pickDay')}
            </Text>
            <DayOfTheWeekPicker
              days={dayTimeItem.startDay}
              onChangeDays={days => handleDayOfTheWeek(days, 'startDay')}
            />
            <MaskedTimeView
              label={t(
                'specificTimesScreen.specificTimes.startSection.pickTime',
              )}
              initialValue={startTimeFormatted}
              name="startTime"
              onChangeValue={(time, name) =>
                handleHours(time, name as StartEndHourType)
              }
              onChangeValidation={(isValid, name) =>
                handleHoursValidation(isValid, name as StartEndHourType)
              }
            />
          </View>
          <View style={styles.panel}>
            <Text style={styles.label}>
              {t('specificTimesScreen.specificTimes.endSection.pickDay')}
            </Text>
            <DayOfTheWeekPicker
              days={dayTimeItem.endDay}
              onChangeDays={days => handleDayOfTheWeek(days, 'endDay')}
            />

            <MaskedTimeView
              label={t(
                'specificTimesScreen.specificTimes.startSection.pickTime',
              )}
              initialValue={endTimeFormatted}
              name="endTime"
              onChangeValue={(time, name) =>
                handleHours(time, name as StartEndHourType)
              }
              onChangeValidation={(isValid, name) =>
                handleHoursValidation(isValid, name as StartEndHourType)
              }
            />
          </View>
          <Button
            variant={'solid'}
            disabled={!isStartHourValid || !isEndHourValid}
            style={styles.saveButton}
            onPress={handleSave}>
            <Text color={colors.white} fontSize={'md'} fontWeight={700}>
              {t('common.save')}
            </Text>
          </Button>
          <Button variant={'unstyled'} onPress={onClose}>
            <Text color={colors.red[600]} fontSize={'md'} fontWeight={700}>
              {t('common.cancel')}
            </Text>
          </Button>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
