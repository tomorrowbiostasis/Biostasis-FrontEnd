import {ApiToLocal} from './TimeSlot.service';
import API from './API.service';

const pseudoTime = (time: number) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 100 + minutes;
};

export const getTimeSettings = async () => {
  const response = await API.getTimeSlot();
  return ApiToLocal.mapApiToLocalData(response.data);
};

const isHourInRange = (
  givenHour: number,
  startingHour: number,
  endingHour: number,
): boolean => {
  if (startingHour <= endingHour) {
    return givenHour >= startingHour && givenHour < endingHour;
  }
  return givenHour >= startingHour || givenHour < endingHour;
};

export const isPausedTime = (
  givenDate: any,
  pausedDate: any,
  specificPausedTimes: any,
) => {
  const timestamp = +new Date(givenDate);

  if (pausedDate?.timestamp && timestamp < pausedDate.timestamp) {
    return true;
  }

  if (!Array.isArray(specificPausedTimes)) return false;

  return specificPausedTimes.some((pausedTime: any) => {
    const {isActive, startTime, endTime, startDay, endDay} = pausedTime;
    if (!isActive) return false;

    const startingWeekDay = startDay?.[0];
    const endingWeekDay = endDay?.[endDay.length - 1];
    const startingHour = pseudoTime(startTime);
    const endingHour = pseudoTime(endTime);
    const givenWeekDay = givenDate.getDay();
    const givenHour = pseudoTime(timestamp);

    let dayMatch = false;
    let hourMatch = false;

    if (startDay.length === 7) {
      dayMatch = true;
      hourMatch = isHourInRange(givenHour, startingHour, endingHour);
    } else if (startingWeekDay === endingWeekDay) {
      if (startingWeekDay === givenWeekDay) {
        dayMatch = true;
        hourMatch = isHourInRange(givenHour, startingHour, endingHour);
      }
    } else if (startingWeekDay < endingWeekDay) {
      if (givenWeekDay >= startingWeekDay && givenWeekDay <= endingWeekDay) {
        dayMatch = true;

        if (givenWeekDay > startingWeekDay && givenWeekDay < endingWeekDay) {
          hourMatch = true;
        }

        if (givenWeekDay === startingWeekDay && givenHour >= startingHour) {
          hourMatch = true;
        }

        if (givenWeekDay === endingWeekDay && givenHour < endingHour) {
          hourMatch = true;
        }
      }
    } else {
      if (givenWeekDay >= startingWeekDay || givenWeekDay <= endingWeekDay) {
        dayMatch = true;

        if (givenWeekDay > startingWeekDay || givenWeekDay < endingWeekDay) {
          hourMatch = true;
        }

        if (givenWeekDay === startingWeekDay && givenHour >= startingHour) {
          hourMatch = true;
        }

        if (givenWeekDay === endingWeekDay && givenHour < endingHour) {
          hourMatch = true;
        }
      }
    }

    return dayMatch && hourMatch;
  });
};
