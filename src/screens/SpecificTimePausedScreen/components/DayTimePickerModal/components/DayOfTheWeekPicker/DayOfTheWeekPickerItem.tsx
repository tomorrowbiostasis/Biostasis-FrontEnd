import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {DaysOfTheWeekEnum} from '~/screens/SpecificTimePausedScreen/util';

import styles from './styles';

interface IDayOfTheWeekPickerItemProps {
  isActive: boolean;
  label: string;
  day: DaysOfTheWeekEnum;
  onSelectDay: (day: DaysOfTheWeekEnum) => void;
}

export const DayOfTheWeekPickerItem: FC<IDayOfTheWeekPickerItemProps> = ({
  isActive,
  label,
  day,
  onSelectDay,
}) => {
  return (
    <TouchableOpacity
      style={[styles.item, isActive ? styles.itemActive : null]}
      onPress={() => onSelectDay(day)}>
      <Text
        style={[isActive ? styles.itemActiveText : styles.itemInactiveText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
