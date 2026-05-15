import React, {useCallback, useLayoutEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {automatedEmergencyPausedTimesSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPauseTimes} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {getUser} from '~/redux/user/thunks';
import {Screens} from '~/models/Navigation.model';
import {semanticColors} from '~/theme/tokens';
import IconChip from '~/components/IconChip';
import {CalendarClockIcon, CirclePlusIcon} from '~/assets/icons/AppIcons';

import {SpecificDateComponentItemIdType} from '../SpecificDateComponent/SpecificDateComponent';
import {SpecificDateList} from '../SpecificDateComponent/SpecificDateList';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {useSavePausedTime} from '../../hooks/UseSavePausedTime.hook';
import {serializePausedTimes} from '../../util';

const SpecificTimesPanel = () => {
  useTimeFormat();
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const pausedTimes = useAppSelector(automatedEmergencyPausedTimesSelector);
  const savePausedTime = useSavePausedTime();

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleDelete = useCallback(
    (id: SpecificDateComponentItemIdType) => {
      dispatch(deleteTimeSlot(id));
      dispatch(
        setAutomatedEmergencyPauseTimes(
          serializePausedTimes(pausedTimes.filter(i => i.id !== id)),
        ),
      );
    },
    [dispatch, pausedTimes],
  );

  const handleEdit = useCallback(
    (id: SpecificDateComponentItemIdType) => {
      // @ts-ignore — loose route params, matches existing call sites
      navigate(Screens.AddTimeBlock, {id});
    },
    [navigate],
  );

  const handleAddNew = useCallback(() => {
    navigate(Screens.AddTimeBlock as never);
  }, [navigate]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <IconChip background="rgba(228, 219, 247, 0.6)" size={36} radius={8}>
          <CalendarClockIcon size={18} color="#6D4CCB" />
        </IconChip>
        <Text style={styles.title}>
          {t('specificTimesScreen.specificTimes.title')}
        </Text>
      </View>
      <Text style={styles.description}>
        {t('specificTimesScreen.specificTimes.description')}
      </Text>

      <SpecificDateList
        items={pausedTimes}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSave={savePausedTime}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.addButton}
        onPress={handleAddNew}>
        <CirclePlusIcon size={16} color="#3D5470" />
        <Text style={styles.addButtonText}>
          {t('specificTimesScreen.specificTimes.addAdditionalTime')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: semanticColors.primary,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19.5,
    color: '#3D5470',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C8D5E2',
  },
  addButtonText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: '#3D5470',
  },
});

export default SpecificTimesPanel;
