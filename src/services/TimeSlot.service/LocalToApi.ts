import dayjs from 'dayjs';
import {ISpecificPausedTime} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {IApiPostTimeSlot} from '../API.types';

const allDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const timestampToISOWithOffset = (date?: number) => dayjs(date).format();

function* generateDaysIndex(
  fromIndex: number,
  toIndex: number,
  maxIndex: number,
): any {
  let index = fromIndex;
  while (index !== toIndex) {
    yield index;
    index = index >= maxIndex ? 0 : index + 1;
  }
  yield toIndex;
  return;
}

const parseFromToToDays = (
  data: ISpecificPausedTime,
): IApiPostTimeSlot['days'] => {
  const fromIndex = data.startDay[0];
  const toIndex = data.endDay[data.endDay.length - 1];
  const result: IApiPostTimeSlot['days'] = [];
  for (let index of generateDaysIndex(fromIndex, toIndex, allDays.length - 1)) {
    result.push(allDays[index]);
  }
  return result;
};

export const mapLocalFromNowToApiTimeSLot = (
  timestamp: number,
): IApiPostTimeSlot => {
  return {
    active: true,
    from: undefined,
    to: timestampToISOWithOffset(timestamp),
    days: allDays,
    timezone: timestampToISOWithOffset(timestamp).slice(-6),
  };
};

export const mapLocalSpecificPausedTimeToApiTimeSLot = (
  data: ISpecificPausedTime,
): IApiPostTimeSlot => {
  return {
    active: data.isActive,
    from: timestampToISOWithOffset(data.startTime),
    to: timestampToISOWithOffset(data.endTime),
    days: parseFromToToDays(data),
    timezone: timestampToISOWithOffset(Date.now()).slice(-6),
  };
};
