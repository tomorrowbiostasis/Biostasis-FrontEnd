import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Text, View} from 'native-base';
import {Text as RNText, TouchableOpacity} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  addTimeSlot,
  deleteTimeSlot,
  updateTimeSlot,
} from '~/redux/automatedEmergency/thunks';
import {automatedEmergencyPausedTimesSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPauseTimes} from '~/redux/automatedEmergency/automatedEmergency.slice';

import {styles} from './styles';
import ToastService from '~/services/Toast.service';
import {getUser} from '~/redux/user/thunks';
import {
  ISpecificDateComponentItem,
  SpecificDateComponentItemIdType,
} from '../SpecificDateComponent/SpecificDateComponent';
import {DayTimePicker} from '../DayTimePickerModal/DayTimePickerModal';
import {SpecificDateList} from '../SpecificDateComponent/SpecificDateList';
import {useTimeFormat} from '../../hooks/UseTimeFormat.hook';
import {serializePausedTimes} from '../../util';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import colors from '~/theme/colors';

const SpecificTimesPanel = () => {
  useTimeFormat();
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedTimes = useAppSelector(automatedEmergencyPausedTimesSelector);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);

  const [editedId, setEditedId] =
    useState<SpecificDateComponentItemIdType | null>(null);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const setPausedTimes = useCallback(
    (times: ISpecificDateComponentItem[]) => {
      dispatch(setAutomatedEmergencyPauseTimes(serializePausedTimes(times)));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: SpecificDateComponentItemIdType) => {
      dispatch(deleteTimeSlot(id));
      setPausedTimes(pausedTimes.filter(i => i.id !== id));
    },
    [dispatch, pausedTimes, setPausedTimes],
  );

  const handleEdit = useCallback((id: SpecificDateComponentItemIdType) => {
    setEditedId(id);
    setIsAddNewModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (item: ISpecificDateComponentItem) => {
      const isSlotExists = pausedTimes.find(i => i.id === item.id);
      if (isSlotExists) {
        const tempItems = pausedTimes.map(i => i);
        let itemToUpdate = tempItems.find(i => i.id === item.id);
        if (itemToUpdate) {
          const {startDay, endDay, startTime, endTime, isActive} = item;
          itemToUpdate.startDay = startDay;
          itemToUpdate.endDay = endDay;
          itemToUpdate.startTime = startTime;
          itemToUpdate.endTime = endTime;
          itemToUpdate.isActive = isActive;

          const serialized = serializePausedTimes([itemToUpdate]);
          dispatch(updateTimeSlot({id: itemToUpdate.id, data: serialized[0]}));
        }

        setPausedTimes(tempItems);
      } else {
        const serialized = serializePausedTimes([item]);
        dispatch(addTimeSlot(serialized[0]));
        setPausedTimes([...pausedTimes, item]);
      }
      setIsAddNewModalOpen(false);

      ToastService.success(
        t('specificTimesScreen.specificTimes.changeSettings'),
        {
          visibilityTime: 1000,
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, pausedTimes, setPausedTimes],
  );

  const handleAddNew = useCallback(() => {
    setEditedId(null);
    setIsAddNewModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddNewModalOpen(false);
  }, []);

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <IconMaterialCommunityIcons
          style={styles.icon}
          name="calendar-clock"
          size={26}
        />
        <Text style={styles.panelTitle} fontWeight={700}>
          {t('specificTimesScreen.specificTimes.title')}
        </Text>
      </View>
      <View style={styles.lineStyle} />

      <View style={styles.panelBody}>
        <RNText style={styles.panelDescription}>
          {t('specificTimesScreen.specificTimes.description')}
        </RNText>

        <SpecificDateList
          items={pausedTimes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSave={handleSave}
        />

        {isAddNewModalOpen && (
          <DayTimePicker
            item={pausedTimes.find(i => i.id === editedId)}
            onSave={handleSave}
            onClose={handleModalClose}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <IconFeather name="plus" size={18} color={colors.gray[700]} />
          <Text style={styles.addButtonText}>
            {t('specificTimesScreen.specificTimes.addAdditionalTime')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpecificTimesPanel;
