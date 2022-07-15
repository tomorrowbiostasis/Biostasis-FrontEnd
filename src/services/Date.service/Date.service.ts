import dayjs from 'dayjs';
import i18n from '~/i18n/i18n';

const sToMs = (sec: number) => sec * 1000;
const minToMs = (min: number) => min * 60000;
const hToMs = (h: number) => h * 3.6e6;

const getSecondPrecision = (value: number, suffix: string) => {
  if (value > 0) {
    return ` ${value} ${suffix}`;
  }
  return '';
};
export const parseTimeFromTimeSlotToToday = (timestamp: number) => {
  const hour = dayjs(timestamp).hour();
  const minutes = dayjs(timestamp).minute();
  return new Date().setHours(hour, minutes).valueOf();
};

export const timeFromNow = (timestamp: number | Date) => {
  const today = dayjs(new Date());
  const day = dayjs(timestamp);

  const diff = day.diff(today);
  const h = day.diff(today, 'hour');
  const m = day.diff(today, 'minute');
  const s = day.diff(today, 'second');

  if (diff <= minToMs(1)) {
    return i18n.t('time.lessThanMinute');
  } else if (diff < minToMs(1.5)) {
    return i18n.t('time.m');
  } else if (diff < minToMs(45)) {
    const minutes = Math.round(s / 60);
    return i18n.t('time.mm', {m: minutes});
  } else if (diff < minToMs(120)) {
    const sec = s - 60 * 60;
    const minutes = Math.round(sec / 60);
    return i18n.t('time.h', {
      secondPrecision: getSecondPrecision(minutes, i18n.t('time.short.m')),
    });
  } else if (diff < hToMs(22) - sToMs(30)) {
    const sec = s - h * 60 * 60;
    const minutes = Math.round(sec / 60);
    return i18n.t('time.hh', {
      h,
      secondPrecision: getSecondPrecision(minutes, i18n.t('time.short.m')),
    });
  } else if (diff < hToMs(47)) {
    const hours = Math.round(m / 60 - 24);
    return i18n.t('time.d', {
      secondPrecision: getSecondPrecision(hours, i18n.t('time.short.h')),
    });
  } else {
    const days = Math.round(h / 24);
    const hours = Math.round(m / 60) - days * 24;
    return i18n.t('time.dd', {
      d: days,
      secondPrecision: getSecondPrecision(hours, i18n.t('time.short.h')),
    });
  }
};

export const isBetweenStartAndEnd = (
  startTime: Date | null | string,
  endTime: Date | null | string,
) => {
  const startH = dayjs(startTime).hour();
  const startM = dayjs(startTime).minute();
  const endH = dayjs(endTime).hour();
  const endM = dayjs(endTime).minute();
  console.log(
    dayjs().isAfter(dayjs().hour(startH).minute(startM)),
    dayjs().isBefore(dayjs().hour(endH).minute(endM)),
  );
  return (
    (dayjs().isAfter(dayjs().hour(startH).minute(startM)) ||
      dayjs().isSame(dayjs().hour(startH).minute(startM))) &&
    dayjs().isBefore(dayjs().hour(endH).minute(endM))
  );
};

export const convertDateToTimestamp = (date: Date): number => {
  return date.valueOf();
};

export const convertTimestampToDate = (timestamp: number): Date => {
  return new Date(timestamp);
};
