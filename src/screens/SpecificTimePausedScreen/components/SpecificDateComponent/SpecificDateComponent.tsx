import React, {FC, useCallback, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {semanticColors} from '~/theme/tokens';
import Toggle from '~/components/Toggle';
import {PencilIcon, TrashIcon} from '~/assets/icons/AppIcons';
import {DaysOfTheWeekEnum, parseDaysOfTheWeekEnumToString} from '../../util';
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
        <View style={styles.badge}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isActive
                  ? semanticColors.success
                  : semanticColors.textMuted,
              },
            ]}
          />
          <Text
            style={[
              styles.badgeText,
              {
                color: isActive
                  ? semanticColors.success
                  : semanticColors.textMuted,
              },
            ]}>
            {isActive
              ? t('specificTimesScreen.specificTimes.active')
              : t('specificTimesScreen.specificTimes.inactive')}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity hitSlop={8} onPress={handleEdit}>
            <PencilIcon size={18} color="#343330" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} onPress={handleDelete}>
            <TrashIcon size={18} color="#343330" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeBlockLabel}>
            {t('specificTimesScreen.specificTimes.start')}
          </Text>
          <Text style={styles.timeBlockValue}>
            {`${startDayName} ${startTimeFormatted}`}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeBlockLabel}>
            {t('specificTimesScreen.specificTimes.end')}
          </Text>
          <Text style={styles.timeBlockValue}>
            {`${endDayName} ${endTimeFormatted}`}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Toggle value={isActive} onChange={handleToggle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  cardInactive: {
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  badgeText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBlock: {
    flex: 1,
    gap: 2,
  },
  timeBlockLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: semanticColors.textMuted,
  },
  timeBlockValue: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
  },
  arrow: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: semanticColors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
