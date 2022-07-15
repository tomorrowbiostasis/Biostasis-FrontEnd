import React, {FC, useCallback, useMemo} from 'react';
import {Text, View} from 'native-base';

import SwitchButton from '~/components/SwitchButton';

import PencilIcon from '~/assets/icons/PencilIcon';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {DaysOfTheWeekEnum, parseDaysOfTheWeekEnumToString} from '../../util';

import styles from './styles';
import {TouchableOpacity} from 'react-native';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {TimeFormatService} from '../../services/TimeFormat.service';

export type SpecificDateComponentItemIdType = number;

export interface ISpecificDateComponentItem {
  id: SpecificDateComponentItemIdType;
  startDay: DaysOfTheWeekEnum[];
  startTime: Date | null;
  endDay: DaysOfTheWeekEnum[];
  endTime: Date | null;
  isActive: boolean;
}
interface ISpecificDateComponentProps {
  item: ISpecificDateComponentItem;
  onEdit: (id: SpecificDateComponentItemIdType) => void;
  onSave: (id: ISpecificDateComponentItem) => void;
}

export const SpecificDateComponent: FC<ISpecificDateComponentProps> = ({
  item: {id, startDay, startTime, endDay, endTime, isActive},
  onEdit,
  onSave,
}) => {
  const {t} = useAppTranslation();
  const {is24TimeFormat} = useTimeFormat();

  const getStartTimeFormatted = useCallback(() => {
    const time = new TimeFormatService(startTime);
    return time.format(is24TimeFormat);
  }, [is24TimeFormat, startTime]);

  const getEndTimeFormatted = useCallback(() => {
    const time = new TimeFormatService(endTime);
    return time.format(is24TimeFormat);
  }, [endTime, is24TimeFormat]);

  const getLabel = useCallback(
    (days: DaysOfTheWeekEnum[]) => {
      const trans = t(
        `specificTimesScreen.daysShortName.${parseDaysOfTheWeekEnumToString(
          days,
        ).toLocaleLowerCase()}`,
      );
      return trans;
    },
    [t],
  );

  const startDayName = useMemo(
    () => getLabel([startDay[0]]),
    [getLabel, startDay],
  );

  const endDayName = useMemo(
    () => getLabel([endDay[endDay.length - 1]]),
    [getLabel, endDay],
  );

  const startTimeFormatted = useMemo(
    () => getStartTimeFormatted(),
    [getStartTimeFormatted],
  );

  const endTimeFormatted = useMemo(
    () => getEndTimeFormatted(),
    [getEndTimeFormatted],
  );

  const handleEdit = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);

  const handleSave = useCallback(() => {
    onSave({id, startDay, startTime, endDay, endTime, isActive: !isActive});
  }, [endDay, endTime, id, isActive, onSave, startDay, startTime]);

  return (
    <View style={styles.container}>
      <View style={[styles.containerItem, styles.containerSwitch]}>
        <SwitchButton value={isActive} title={''} onSwitchPress={handleSave} />
      </View>
      <View style={[styles.containerItem, styles.containerDays]}>
        <View style={styles.flexRow}>
          <Text style={styles.textOpacity}>
            {t('specificTimesScreen.start')}
          </Text>
          <Text style={styles.text}>{startDayName}</Text>
        </View>
        <View style={styles.flexRow}>
          <Text style={styles.textOpacity}>{t('specificTimesScreen.end')}</Text>
          <Text style={styles.text}>{endDayName}</Text>
        </View>
      </View>
      <View style={[styles.containerItem, styles.containerTime]}>
        <Text>{startTimeFormatted}</Text>
        <Text>{endTimeFormatted}</Text>
      </View>
      <TouchableOpacity
        style={[styles.containerItem, styles.containerEdit]}
        onPress={handleEdit}>
        <PencilIcon />
      </TouchableOpacity>
    </View>
  );
};
