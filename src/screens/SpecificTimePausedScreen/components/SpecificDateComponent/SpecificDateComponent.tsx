import React, {FC, useCallback, useMemo} from 'react';
import {Text, View} from 'native-base';
import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {DaysOfTheWeekEnum, parseDaysOfTheWeekEnumToString} from '../../util';
import styles from './styles';
import {TouchableOpacity} from 'react-native';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {TimeFormatService} from '../../services/TimeFormat.service';
import IconFeather from 'react-native-vector-icons/Feather';
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

  const getTimeFormatted = useCallback(
    (time: Date | null) => new TimeFormatService(time).format(is24TimeFormat),
    [is24TimeFormat],
  );

  const getLabel = useCallback(
    (days: DaysOfTheWeekEnum[]) =>
      t(
        `specificTimesScreen.specificTimes.daysShortName.${parseDaysOfTheWeekEnumToString(
          days,
        ).toLocaleLowerCase()}`,
      ),
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
    () => getTimeFormatted(startTime),
    [getTimeFormatted, startTime],
  );
  const endTimeFormatted = useMemo(
    () => getTimeFormatted(endTime),
    [getTimeFormatted, endTime],
  );

  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  const handleToggle = useCallback(() => {
    onSave({id, startDay, startTime, endDay, endTime, isActive: !isActive});
  }, [endDay, endTime, id, isActive, onSave, startDay, startTime]);
  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  return (
    <View style={[styles.card, !isActive && styles.cardInactive]}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusBadge,
            isActive ? styles.statusActive : styles.statusInactive,
          ]}>
          <View
            style={[
              styles.statusDot,
              isActive ? styles.statusDotActive : styles.statusDotInactive,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isActive ? styles.statusTextActive : styles.statusTextInactive,
            ]}>
            {isActive
              ? t('specificTimesScreen.specificTimes.active')
              : t('specificTimesScreen.specificTimes.inactive')}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <IconFeather name="edit-2" size={14} color={colors.blue[700]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <IconFeather name="trash-2" size={14} color={colors.red[200]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>
            {t('specificTimesScreen.specificTimes.start')}
          </Text>
          <View style={styles.timeDayRow}>
            <Text style={styles.timeDay}>{startDayName}</Text>
            <Text style={styles.timeHour}>{startTimeFormatted}</Text>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <IconFeather name="arrow-right" size={16} color={colors.gray[400]} />
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>
            {t('specificTimesScreen.specificTimes.end')}
          </Text>
          <View style={styles.timeDayRow}>
            <Text style={styles.timeDay}>{endDayName}</Text>
            <Text style={styles.timeHour}>{endTimeFormatted}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <SwitchButton value={isActive} onSwitchPress={handleToggle} />
      </View>
    </View>
  );
};
