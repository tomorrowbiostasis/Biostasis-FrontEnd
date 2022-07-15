import dayjs from 'dayjs';
import {useCallback, useEffect, useState} from 'react';
import {automatedEmergencyActiveTimeSlots} from '~/redux/automatedEmergency/selectors';
import {useAppSelector} from '~/redux/store/hooks';
import {
  isBetweenStartAndEnd,
  parseTimeFromTimeSlotToToday,
} from '~/services/Date.service';

const isPauseSetToday = (days: number[]) => days.includes(dayjs().day());

export const useTimeSlotPauseStatus = () => {
  const activeTimeSlots = useAppSelector(automatedEmergencyActiveTimeSlots);
  const [isSlotPause, setIsSlotPause] = useState<number | undefined>();

  const isPauseTimeFromTimeSlot = useCallback((): number | undefined => {
    if (!activeTimeSlots.length) {
      return undefined;
    }

    const slotPause: number[] = [];
    activeTimeSlots.forEach(({endDay, startDay, startTime, endTime}) => {
      const pauseDay = isPauseSetToday(endDay) || isPauseSetToday(startDay);
      pauseDay &&
        isBetweenStartAndEnd(startTime, endTime) &&
        slotPause.push(parseTimeFromTimeSlotToToday(+endTime!));
    });
    return slotPause.length ? Math.max(...slotPause) : undefined;
  }, [activeTimeSlots]);

  useEffect(() => {
    setIsSlotPause(isPauseTimeFromTimeSlot());
  }, [activeTimeSlots, isPauseTimeFromTimeSlot]);

  return {isSlotPause};
};
