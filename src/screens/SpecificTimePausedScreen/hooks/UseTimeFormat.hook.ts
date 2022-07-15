import {useEffect} from 'react';
import {checkIfIs24HourFormat} from '../util';

export interface IUseTimeFormatReturn {
  is24TimeFormat: boolean | null;
}

let is24HourTimeFormat: boolean | null = null;

export const useTimeFormat = () => {
  useEffect(() => {
    const check = async () => {
      const is24h = await checkIfIs24HourFormat();
      if (is24h !== is24HourTimeFormat) {
        is24HourTimeFormat = is24h;
      }
    };
    check();
  }, []);

  return {
    is24TimeFormat: is24HourTimeFormat,
  };
};
