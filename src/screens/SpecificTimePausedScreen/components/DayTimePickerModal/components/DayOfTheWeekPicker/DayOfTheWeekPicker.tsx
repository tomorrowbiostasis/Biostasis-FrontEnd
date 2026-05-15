import React, {FC, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {DayOfTheWeekPickerItem} from './DayOfTheWeekPickerItem';
import {
  DaysOfTheWeekEnum,
  parseDaysOfTheWeekEnumToString,
} from '../../../../util';

const initialDaysSelected: DaysOfTheWeekEnum[] = [0, 1, 2, 3, 4, 5, 6];

interface IDayOfTheWeekPickerProps {
  days: DaysOfTheWeekEnum[];
  onChangeDays: (days: DaysOfTheWeekEnum[]) => void;
}

export const DayOfTheWeekPicker: FC<IDayOfTheWeekPickerProps> = ({
  days,
  onChangeDays,
}) => {
  const {t} = useAppTranslation();

  const handleSelectOneDay = useCallback(
    (day: DaysOfTheWeekEnum) => {
      onChangeDays([day]);
    },
    [onChangeDays],
  );

  const handleSelectAllDays = useCallback(() => {
    onChangeDays(initialDaysSelected);
  }, [onChangeDays]);

  const handleSelectDay = useCallback(
    (day: DaysOfTheWeekEnum) => {
      if (days.length === 7) {
        handleSelectOneDay(day);
      } else {
        const index = days.findIndex(i => i === day);
        if (index < 0) {
          handleSelectOneDay(day);
        } else {
          handleSelectAllDays();
        }
      }
    },
    [handleSelectAllDays, handleSelectOneDay, days],
  );

  const checkIfActive = useCallback(
    (day: DaysOfTheWeekEnum) => days.findIndex(i => i === day) !== -1,
    [days],
  );

  const getLabel = useCallback(
    (day: DaysOfTheWeekEnum) =>
      t(
        `specificTimesScreen.specificTimes.daysShortName.${parseDaysOfTheWeekEnumToString(
          [day],
        ).toLocaleLowerCase()}`,
      ),
    [t],
  );

  const items = useMemo(() => {
    const keys = Object.keys(DaysOfTheWeekEnum).filter(i => i.length > 1);
    return keys.map(day => {
      const d = day as keyof typeof DaysOfTheWeekEnum;
      return (
        <DayOfTheWeekPickerItem
          key={day}
          label={getLabel(DaysOfTheWeekEnum[d])}
          day={DaysOfTheWeekEnum[d]}
          isActive={checkIfActive(DaysOfTheWeekEnum[d])}
          onSelectDay={handleSelectDay}
        />
      );
    });
  }, [checkIfActive, getLabel, handleSelectDay]);

  return <View style={styles.container}>{items}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
