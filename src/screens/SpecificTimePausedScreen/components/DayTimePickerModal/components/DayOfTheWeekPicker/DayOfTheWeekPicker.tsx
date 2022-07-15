import React, {FC, useCallback, useMemo} from 'react';
import {View} from 'native-base';

import {DayOfTheWeekPickerItem} from './DayOfTheWeekPickerItem';
import {
  DaysOfTheWeekEnum,
  parseDaysOfTheWeekEnumToString,
} from '../../../../util';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

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
    (day: DaysOfTheWeekEnum) => {
      const index = days.findIndex(i => i === day);
      if (index === -1) {
        return false;
      }
      return true;
    },
    [days],
  );

  const getLabel = useCallback(
    (day: DaysOfTheWeekEnum) => {
      return t(
        `specificTimesScreen.daysShortName.${parseDaysOfTheWeekEnumToString([
          day,
        ]).toLocaleLowerCase()}`,
      );
    },
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
