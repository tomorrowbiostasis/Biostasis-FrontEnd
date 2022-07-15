import React, {FC, useCallback, useMemo, useState} from 'react';
import {View} from 'native-base';
import {Text} from 'react-native';
import dayjs from 'dayjs';
import {MaskedTextInput} from 'react-native-mask-text';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import CheckMarkIcon from '~/assets/icons/CheckMarkIcon';

import styles from './styles';

const minAge = 18;
const dateFormat = 'DD/MM/YYYY';

interface IMaskedDateInput {
  label?: string;
  initialValue?: string;
  onChangeValidation: (isValid: boolean) => void;
  onChangeValue: (dateOfBirth: string) => void;
  type: 'birth' | 'maxToday';
}

export const MaskedDateInput: FC<IMaskedDateInput> = ({
  initialValue,
  label,
  type,
  onChangeValidation,
  onChangeValue,
}) => {
  const {t} = useAppTranslation();

  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState<string>(initialValue || '');
  const [errorMessageKey, setErrorMessageKey] = useState(
    'userDateOfBirth.invalidDate',
  );

  const setValidation = useCallback(
    (value: boolean) => {
      setIsValid(value);
      onChangeValidation(value);
    },
    [onChangeValidation],
  );

  const prepareDate = (date: string) => {
    const dateParts = date.split('/');
    const year = Number.parseInt(dateParts[2], 10);
    const month = Number.parseInt(dateParts[1], 10) - 1;
    const day = Number.parseInt(dateParts[0], 10);
    return new Date(year, month, day);
  };

  const validateDateOfBirth = useCallback(
    (date: string) => {
      if (date.length < 10) {
        setValidation(false);
        setErrorMessageKey('userDateOfBirth.invalidDate');
      } else {
        const selectedDate = prepareDate(date);
        const formattedDate = dayjs(selectedDate).format(dateFormat);
        let maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() - 12 * minAge);
        const maxDateTimestamp = +maxDate;
        const selectedDateTimestamp = +selectedDate;

        setDateOfBirth(formattedDate);
        onChangeValue(formattedDate);

        if (maxDateTimestamp >= selectedDateTimestamp) {
          setValidation(true);
          setErrorMessageKey('');
        } else {
          setValidation(false);
          setErrorMessageKey('userDateOfBirth.invalidUserAge');
        }
      }
    },
    [onChangeValue, setValidation],
  );

  const validateMaxToday = useCallback(
    (date: string) => {
      if (date.length < 10) {
        setValidation(false);
        setErrorMessageKey('userDateOfBirth.invalidDate');
      } else {
        const selectedDate = prepareDate(date);
        const formattedDate = dayjs(selectedDate).format(dateFormat);
        let maxDate = new Date();
        const maxDateTimestamp = +maxDate;
        const selectedDateTimestamp = +selectedDate;

        setDateOfBirth(formattedDate);
        onChangeValue(formattedDate);

        if (maxDateTimestamp >= selectedDateTimestamp) {
          setValidation(true);
          setErrorMessageKey('');
        } else {
          setValidation(false);
          setErrorMessageKey('userDateOfBirth.invalidDate');
        }
      }
    },
    [onChangeValue, setValidation],
  );

  const validate = useCallback(
    (date: string) => {
      switch (type) {
        case 'birth': {
          return validateDateOfBirth(date);
        }
        default: {
          validateMaxToday(date);
        }
      }
    },
    [type, validateDateOfBirth, validateMaxToday],
  );

  const setDate = useCallback(
    (date: string) => {
      setDateOfBirth(date);
      onChangeValue(date);
      validate(date);
      if (!isTouched && date) {
        setIsTouched(true);
      }
    },
    [isTouched, onChangeValue, validate],
  );

  const inputStyles = useMemo(() => {
    if (isTouched) {
      return isValid ? styles.valid : styles.invalid;
    }
    return null;
  }, [isTouched, isValid]);

  return (
    <View>
      <Text style={styles.label}>{label || dateFormat}</Text>
      <View style={[styles.inputContainer, inputStyles]}>
        <MaskedTextInput
          mask="99/99/9999"
          onChangeText={text => {
            setDate(text);
          }}
          style={styles.input}
          keyboardType="numeric"
          placeholder={dateFormat}
          value={dateOfBirth}
          defaultValue={initialValue}
        />
        {isTouched && isValid && <CheckMarkIcon />}
      </View>
      <View style={styles.errorMessageContainer}>
        {!isValid && isTouched && (
          <Text style={styles.errorMessage}>{t(errorMessageKey)}</Text>
        )}
      </View>
    </View>
  );
};
