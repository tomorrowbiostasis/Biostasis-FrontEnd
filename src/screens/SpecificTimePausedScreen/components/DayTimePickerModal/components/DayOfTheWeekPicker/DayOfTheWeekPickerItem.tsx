import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {DaysOfTheWeekEnum} from '~/screens/SpecificTimePausedScreen/util';
import {semanticColors} from '~/theme/tokens';

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
      activeOpacity={0.7}
      style={[styles.item, isActive ? styles.itemActive : styles.itemInactive]}
      onPress={() => onSelectDay(day)}>
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 37,
    height: 37,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: semanticColors.primaryDeep,
    borderColor: semanticColors.primaryDeep,
  },
  itemInactive: {
    backgroundColor: semanticColors.surface,
    borderColor: '#E2E9F0',
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    color: '#3D5470',
  },
  labelActive: {
    color: semanticColors.textInverse,
  },
});
