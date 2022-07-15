import {useState} from 'react';

interface IUseDataValidStateReturn<T> {
  value: T | undefined;
  isValid: boolean;
  setValue: (val: T) => void;
  setIsValid: (val: boolean) => void;
}

export const useDataValidState = <T>(
  initialValue?: T,
  initialIsValid: boolean = false,
): IUseDataValidStateReturn<T> => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(initialIsValid);
  return {
    value,
    isValid,
    setValue,
    setIsValid,
  };
};
