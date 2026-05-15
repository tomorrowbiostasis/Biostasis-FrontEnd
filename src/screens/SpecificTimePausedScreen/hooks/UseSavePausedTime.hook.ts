import {useCallback} from 'react';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  addTimeSlot,
  updateTimeSlot,
} from '~/redux/automatedEmergency/thunks';
import {automatedEmergencyPausedTimesSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPauseTimes} from '~/redux/automatedEmergency/automatedEmergency.slice';
import ToastService from '~/services/Toast.service';
import {ISpecificDateComponentItem} from '../components/SpecificDateComponent/SpecificDateComponent';
import {serializePausedTimes} from '../util';

/**
 * Add-or-update a recurring paused-time slot. Shared by `SpecificTimesPanel`
 * (the active toggle) and `AddTimeBlockScreen` (create / edit).
 */
export const useSavePausedTime = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedTimes = useAppSelector(automatedEmergencyPausedTimesSelector);

  return useCallback(
    (item: ISpecificDateComponentItem) => {
      const isSlotExists = pausedTimes.find(i => i.id === item.id);
      if (isSlotExists) {
        const tempItems = pausedTimes.map(i => i);
        const itemToUpdate = tempItems.find(i => i.id === item.id);
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
        dispatch(setAutomatedEmergencyPauseTimes(serializePausedTimes(tempItems)));
      } else {
        const serialized = serializePausedTimes([item]);
        dispatch(addTimeSlot(serialized[0]));
        dispatch(
          setAutomatedEmergencyPauseTimes(
            serializePausedTimes([...pausedTimes, item]),
          ),
        );
      }
      ToastService.success(
        t('specificTimesScreen.specificTimes.changeSettings'),
        {visibilityTime: 1000},
      );
    },
    [dispatch, pausedTimes, t],
  );
};
