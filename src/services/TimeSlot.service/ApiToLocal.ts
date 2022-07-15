import {
  IPausedDate,
  ISpecificPausedTime,
} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {parseDayOfTheWeekStringToJsWeekDay} from '~/screens/SpecificTimePausedScreen/util';
import {IApiTimeSlot} from '../API.types';

export type TimeSlot = {
  pausedDate: IPausedDate | null;
  specificPausedTimes: ISpecificPausedTime[];
};

const ISOToTimestamp = (date: string) => new Date(date).valueOf();

const getAndSplicePauseFromNow = (
  data: IApiTimeSlot[],
): TimeSlot['pausedDate'] => {
  const index = data.findIndex(item => !item.from);
  if (index !== -1) {
    const timestamp = ISOToTimestamp(data[index].to);
    const id = data[index].id;
    data.splice(index, 1);
    return {
      timestamp,
      id,
    };
  }
  return null;
};

const parseApiToLocalStartEndDay = (
  data: IApiTimeSlot,
): Pick<ISpecificPausedTime, 'startDay' | 'endDay'> => {
  if (data.days.length === 2) {
    const startDay = parseDayOfTheWeekStringToJsWeekDay(data.days[0]);
    const endDay = parseDayOfTheWeekStringToJsWeekDay(data.days[1]);

    return {
      startDay: [startDay],
      endDay: [endDay],
    };
  }

  const everydayParsed = data.days.map(item =>
    parseDayOfTheWeekStringToJsWeekDay(item),
  );

  return {
    startDay: everydayParsed,
    endDay: everydayParsed,
  };
};

export const mapApiToSpecificPausedTimesItem = (item: IApiTimeSlot) => ({
  id: item.id,
  startTime: ISOToTimestamp(item.from as string),
  endTime: ISOToTimestamp(item.to),
  isActive: item.active,
  ...parseApiToLocalStartEndDay(item),
});

const mapApiToSpecificPausedTimes = (
  data: IApiTimeSlot[],
): TimeSlot['specificPausedTimes'] => {
  return data.map(mapApiToSpecificPausedTimesItem);
};

export const mapApiToLocalData = (data: IApiTimeSlot[]): TimeSlot => {
  return {
    pausedDate: getAndSplicePauseFromNow(data),
    specificPausedTimes: mapApiToSpecificPausedTimes(data),
  };
};
