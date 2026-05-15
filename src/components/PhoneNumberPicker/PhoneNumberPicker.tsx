import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {View} from 'native-base';
import {Text, TouchableWithoutFeedback} from 'react-native';
import PhoneInput from 'react-native-phone-input';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';
import CheckMarkIcon from '~/assets/icons/CheckMarkIcon';

export interface IPhoneNumber {
  phone: string;
  prefix: number;
  countryCode?: string;
}

interface IPhoneNumberPickerProps {
  initialPhone?: string;
  initialPrefix?: number;
  label?: string;
  variant?: 'default' | 'figma';
  onChangePhoneNumber?: (obj: IPhoneNumber) => void;
  onCheckIfValid?: (isValid: boolean) => void;
  onTouched?: () => void;
  onSubmit?: () => void;
}

export const PhoneNumberPicker: FC<IPhoneNumberPickerProps> = ({
  initialPhone,
  initialPrefix,
  label,
  variant = 'default',
  onChangePhoneNumber,
  onCheckIfValid,
  onTouched,
  onSubmit,
}) => {
  const isFigma = variant === 'figma';
  const {t} = useAppTranslation();
  const [isTouched, setIsTouched] = useState(false);
  const phoneNumberPickerRef = useRef<PhoneInput>(null);

  const isNumberValid =
    phoneNumberPickerRef.current?.isValidNumber() as boolean;

  const prepareValues = useCallback((number: string): IPhoneNumber => {
    const countryCode =
      phoneNumberPickerRef.current?.getCountryCode() as string;
    const prefix = Number.parseInt(countryCode, 10);
    const phone = number.replace(countryCode, '').replace('+', '');
    return {
      phone,
      prefix,
      countryCode: phoneNumberPickerRef.current?.getISOCode() || '',
    };
  }, []);

  const handlePhoneNumberChange = useCallback(
    (number: string) => {
      if (onChangePhoneNumber) {
        setIsTouched(true);
        onChangePhoneNumber(prepareValues(number));
      }
    },
    [prepareValues, onChangePhoneNumber],
  );

  useEffect(() => {
    if (onCheckIfValid) {
      onCheckIfValid(isNumberValid);
    }
  }, [isNumberValid, onCheckIfValid]);

  const initialPhoneNumber = useMemo(() => {
    if (initialPrefix && initialPhone) {
      return `+${initialPrefix}${initialPhone}`;
    }
    return '';
  }, [initialPhone, initialPrefix]);

  const inputStyles = useMemo(() => {
    if (isFigma) {
      if (isTouched && !isNumberValid) return styles.figmaInvalid;
      return null;
    }
    if (isTouched || (initialPhone && !isTouched)) {
      return isNumberValid ? styles.valid : styles.invalid;
    }
    return null;
  }, [isFigma, isTouched, initialPhone, isNumberValid]);

  const handleInputBlur = useCallback(() => {
    setIsTouched(true);
    onTouched?.();
  }, [onTouched]);
  const isCurrentNumberValid =
    (initialPhone && !isTouched) || (isTouched && isNumberValid);
  const focusInput = () => {
    if(phoneNumberPickerRef.current){
      return phoneNumberPickerRef.current.focus();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={focusInput}>
      <View>
        <Text style={isFigma ? styles.figmaLabel : styles.label}>
          {label || t('userPhone.phoneNumber')}
        </Text>
        <View
          style={[
            isFigma ? styles.figmaInputContainer : styles.inputContainer,
            inputStyles,
          ]}>
          <PhoneInput
            style={isFigma ? styles.figmaInput : styles.input}
            ref={phoneNumberPickerRef}
            initialCountry={'de'}
            // @ts-ignore
            initialValue={initialPhoneNumber}
            onChangePhoneNumber={handlePhoneNumberChange}
            onPressFlag={() => {
              // @ts-ignore
              if (phoneNumberPickerRef.current?.getValue()?.length <= 1) {
                // @ts-ignore
                phoneNumberPickerRef.current?.picker?.show();
              }
            }}
            cancelText={t('common.cancel')}
            confirmText={t('common.confirm')}
            textProps={{
              onBlur: handleInputBlur,
              keyboardType: 'number-pad',
              onSubmitEditing: () => {
                if (isNumberValid) {
                  onSubmit?.();
                }
              },
            }}
            textStyle={
              isFigma ? styles.figmaInputContainerText : styles.inputContainerText
            }
          />
          {!isFigma && isCurrentNumberValid && <CheckMarkIcon />}
        </View>
        <View style={isFigma ? undefined : styles.errorMessageContainer}>
          {!isNumberValid && isTouched && (
            <Text
              style={isFigma ? styles.figmaErrorMessage : styles.errorMessage}>
              {t('userPhone.invalidPhoneNumber')}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
