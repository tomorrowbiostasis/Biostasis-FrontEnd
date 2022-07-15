import React, {useCallback, useState} from 'react';
import {Text, View} from 'native-base';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useTimeFormat} from './hooks/UseTimeFormat.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  addTimeSlot,
  deleteTimeSlot,
  updateTimeSlot,
} from '~/redux/automatedEmergency/thunks';

import Container from '~/components/Container';
import BottomButton from '~/components/BottomButton';
import {
  ISpecificDateComponentItem,
  SpecificDateComponentItemIdType,
} from './components/SpecificDateComponent/SpecificDateComponent';
import {SpecificDateList} from './components/SpecificDateComponent/SpecificDateList';
import {DayTimePicker} from './components/DayTimePickerModal/DayTimePickerModal';
import PlusIcon from '~/assets/icons/PlusIcon';
import {
  automatedEmergencyPausedTimesSelector,
  timeSlotPatchLoading,
} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPauseTimes} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {serializePausedTimes} from './util';

import styles from './styles';

const SpecificTimesScreen = () => {
  // Needed here to get async timeFormatValue before usage
  useTimeFormat();
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedTimes = useAppSelector(automatedEmergencyPausedTimesSelector);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const loadingPatch = useAppSelector(timeSlotPatchLoading);
  const [editedId, setEditedId] =
    useState<SpecificDateComponentItemIdType | null>(null);

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
    },
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
    <Container
      loading={loadingPatch}
      title={t('emergencyContacts.automatedEmergencySettings.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'static'}>
      <View style={styles.content}>
        <Text style={styles.infoText}>
          {t('specificTimesScreen.description')}
        </Text>
        <SpecificDateList
          items={pausedTimes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      </View>
      {isAddNewModalOpen && (
        <DayTimePicker
          item={pausedTimes.find(i => i.id === editedId)}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
      <View style={styles.bottomContent}>
        <BottomButton
          leftIcon={<PlusIcon />}
          withBottomBorder
          title={t('specificTimesScreen.addAdditionalTime')}
          onPress={handleAddNew}
        />
      </View>
    </Container>
  );
};

export default SpecificTimesScreen;
