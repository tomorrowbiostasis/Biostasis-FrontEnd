import {is24HourFormat} from 'react-native-device-time-format';
import {ISpecificPausedTime} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {convertDateToTimestamp} from '~/services/Date.service';
import {ISpecificDateComponentItem} from './components/SpecificDateComponent/SpecificDateComponent';

export enum DaysOfTheWeekEnum {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// FIXME: should use the enum from top
export const parseDaysOfTheWeekEnumToString = (days: DaysOfTheWeekEnum[]) => {
  if (days.length > 1) {
    return 'Everyday';
  }
  switch (days[0]) {
    case 1: {
      return 'Monday';
    }
    case 2: {
      return 'Tuesday';
    }
    case 3: {
      return 'Wednesday';
    }
    case 4: {
      return 'Thursday';
    }
    case 5: {
      return 'Friday';
    }
    case 6: {
      return 'Saturday';
    }
    default: {
      return 'Sunday';
    }
  }
};

export const parseDayOfTheWeekStringToJsWeekDay = (
  day: string,
): DaysOfTheWeekEnum => {
  switch (day.toLowerCase() as WeekDay) {
    case 'monday': {
      return 1;
    }
    case 'tuesday': {
      return 2;
    }
    case 'wednesday': {
      return 3;
    }
    case 'thursday': {
      return 4;
    }
    case 'friday': {
      return 5;
    }
    case 'saturday': {
      return 6;
    }
    case 'sunday': {
      return 0;
    }
  }
};

export const getUniqueId = () => new Date().valueOf();

export const checkIfIs24HourFormat = async () => {
  const is24h = await is24HourFormat();
  return is24h;
};

export const serializePausedTimes = (
  items: ISpecificDateComponentItem[],
): ISpecificPausedTime[] => {
  return items.map(i => ({
    ...i,
    startTime: convertDateToTimestamp(i.startTime as Date),
    endTime: convertDateToTimestamp(i.endTime as Date),
  }));
};
