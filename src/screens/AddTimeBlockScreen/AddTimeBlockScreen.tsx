import React, {FC, useCallback, useMemo, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencyPausedTimesSelector} from '~/redux/automatedEmergency/selectors';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
import {semanticColors} from '~/theme/tokens';
import ScreenHeader from '~/components/ScreenHeader';
import {ChevronRightIcon, ClockIcon} from '~/assets/icons/AppIcons';

import {DayOfTheWeekPicker} from '~/screens/SpecificTimePausedScreen/components/DayTimePickerModal/components/DayOfTheWeekPicker/DayOfTheWeekPicker';
import {ISpecificDateComponentItem} from '~/screens/SpecificTimePausedScreen/components/SpecificDateComponent/SpecificDateComponent';
import {DaysOfTheWeekEnum, getUniqueId} from '~/screens/SpecificTimePausedScreen/util';
import {useTimeFormat} from '~/screens/SpecificTimePausedScreen/hooks/UseTimeFormat.hook';
import {useSavePausedTime} from '~/screens/SpecificTimePausedScreen/hooks/UseSavePausedTime.hook';
import {TimeFormatService} from '~/screens/SpecificTimePausedScreen/services/TimeFormat.service';
import styles from './styles';

const ALL_DAYS: DaysOfTheWeekEnum[] = [0, 1, 2, 3, 4, 5, 6];

type StartEndDayType = 'startDay' | 'endDay';
type ActiveTimePicker = 'startTime' | 'endTime' | null;

interface TimeFieldProps {
  value: string;
  filled: boolean;
  onPress: () => void;
}

const TimeField: FC<TimeFieldProps> = ({value, filled, onPress}) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.timeField} onPress={onPress}>
    <View style={styles.timeFieldLeft}>
      <ClockIcon
        size={16}
        color={filled ? semanticColors.primaryDeep : semanticColors.textMuted}
      />
      <Text style={[styles.timeFieldValue, !filled && styles.timeFieldPlaceholder]}>
        {value}
      </Text>
    </View>
    <View style={styles.chevron}>
      <ChevronRightIcon size={16} color={semanticColors.textMuted} />
    </View>
  </TouchableOpacity>
);

const AddTimeBlockScreen = () => {
  const {t} = useAppTranslation();
  const {goBack} = useNavigation();
  const {is24TimeFormat} = useTimeFormat();
  const savePausedTime = useSavePausedTime();
  const pausedTimes = useAppSelector(automatedEmergencyPausedTimesSelector);
  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'AddTimeBlock'>>();

  const [dayTimeItem, setDayTimeItem] = useState<ISpecificDateComponentItem>(
    () => {
      const existing = pausedTimes.find(i => i.id === params?.id);
      return (
        existing || {
          id: getUniqueId(),
          startDay: ALL_DAYS,
          startTime: null,
          endDay: ALL_DAYS,
          endTime: null,
          isActive: true,
        }
      );
    },
  );
  const [activeTimePicker, setActiveTimePicker] =
    useState<ActiveTimePicker>(null);

  const formatTime = useCallback(
    (time: Date | null) =>
      time ? new TimeFormatService(time).format(is24TimeFormat) : '--:--',
    [is24TimeFormat],
  );

  const startTimeFormatted = useMemo(
    () => formatTime(dayTimeItem.startTime),
    [formatTime, dayTimeItem.startTime],
  );
  const endTimeFormatted = useMemo(
    () => formatTime(dayTimeItem.endTime),
    [formatTime, dayTimeItem.endTime],
  );

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
        setDayTimeItem(prev => ({...prev, startDay: days, endDay: days}));
        return;
      }
      setDayTimeItem(prev => ({...prev, [startEnd]: days}));
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

  const handleSave = useCallback(() => {
    savePausedTime(dayTimeItem);
    goBack();
  }, [savePausedTime, dayTimeItem, goBack]);

  const pickerDate =
    (activeTimePicker && (dayTimeItem[activeTimePicker] as Date)) || new Date();

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('specificTimesScreen.addTimeBlock.title')} />
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            {t('specificTimesScreen.specificTimes.start')}
          </Text>
          <DayOfTheWeekPicker
            days={dayTimeItem.startDay}
            onChangeDays={days => handleDayOfTheWeek(days, 'startDay')}
          />
          <TimeField
            value={startTimeFormatted}
            filled={!!dayTimeItem.startTime}
            onPress={() => setActiveTimePicker('startTime')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            {t('specificTimesScreen.specificTimes.end')}
          </Text>
          <DayOfTheWeekPicker
            days={dayTimeItem.endDay}
            onChangeDays={days => handleDayOfTheWeek(days, 'endDay')}
          />
          <TimeField
            value={endTimeFormatted}
            filled={!!dayTimeItem.endTime}
            onPress={() => setActiveTimePicker('endTime')}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {t('specificTimesScreen.addTimeBlock.save')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={goBack}>
          <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <DateTimePickerModal
        isVisible={!!activeTimePicker}
        mode="time"
        date={pickerDate}
        onConfirm={handleTimeConfirm}
        onCancel={() => setActiveTimePicker(null)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </View>
  );
};

export default AddTimeBlockScreen;
