import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Text, View} from 'native-base';

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
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconFeather from 'react-native-vector-icons/Feather';
import colors from '~/theme/colors';

const SpecificTimesPanel = () => {
  // Needed here to get async timeFormatValue before usage
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
        <Text fontSize={'md'} fontWeight={700}>
          {t('specificTimesScreen.specificTimes.title')}
        </Text>
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.panelBody}>
        <Text fontSize={'sm'} p={1}>
          {t('specificTimesScreen.specificTimes.description')}
        </Text>

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
      </View>
      <View style={styles.lineStyleBottom} />
      <View style={styles.panelFooter}>
        <TouchableOpacity style={styles.panelFooter} onPress={handleAddNew}>
          <IconFeather
            name="plus"
            style={styles.icon}
            size={20}
            color={colors.gray[642]}
          />
          <Text fontSize={'sm'} color={colors.gray[642]}>
            {t('specificTimesScreen.specificTimes.addAdditionalTime')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpecificTimesPanel;
