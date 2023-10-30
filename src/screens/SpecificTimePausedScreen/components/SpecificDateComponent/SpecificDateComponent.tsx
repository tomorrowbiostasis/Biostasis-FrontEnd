import React, {FC, useCallback, useMemo} from 'react';
import {Text, View} from 'native-base';
import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {DaysOfTheWeekEnum, parseDaysOfTheWeekEnumToString} from '../../util';
import styles from './styles';
import {TouchableOpacity} from 'react-native';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {TimeFormatService} from '../../services/TimeFormat.service';
import IconEntypo from 'react-native-vector-icons/Entypo';
import colors from '~/theme/colors';

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
  onDelete: (id: SpecificDateComponentItemIdType) => void;
}

export const SpecificDateComponent: FC<ISpecificDateComponentProps> = ({
  item: {id, startDay, startTime, endDay, endTime, isActive},
  onEdit,
  onSave,
  onDelete,
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
        `specificTimesScreen.specificTimes.daysShortName.${parseDaysOfTheWeekEnumToString(
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

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <View style={styles.container}>
      <View style={[styles.containerItem, styles.containerSwitch]}>
        <SwitchButton value={isActive} onSwitchPress={handleSave} />
      </View>
      <View style={[styles.containerItem, styles.containerDays]}>
        <View style={styles.flexRow}>
          <Text fontSize={'sm'} style={styles.textOpacity}>
            {t('specificTimesScreen.specificTimes.start')}
          </Text>
          <Text style={styles.text}>{startDayName}</Text>
        </View>
        <View style={styles.flexRow}>
          <Text fontSize={'sm'} style={styles.textOpacity}>
            {t('specificTimesScreen.specificTimes.end')}
          </Text>
          <Text fontSize={'sm'} style={styles.text}>
            {endDayName}
          </Text>
        </View>
      </View>
      <View style={[styles.containerItem, styles.containerTime]}>
        <Text fontSize={'sm'}>{startTimeFormatted}</Text>
        <Text fontSize={'sm'}>{endTimeFormatted}</Text>
      </View>
      <TouchableOpacity
        style={[styles.containerItem, styles.containerEdit]}
        onPress={handleEdit}>
        <IconEntypo name="edit" size={26} color={colors.blue[600]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={styles.containerItem}>
        <IconEntypo name="trash" size={26} color={colors.red[600]} />
      </TouchableOpacity>
    </View>
  );
};
