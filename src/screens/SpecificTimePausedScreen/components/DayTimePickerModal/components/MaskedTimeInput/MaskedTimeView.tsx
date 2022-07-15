import React, {useEffect, useMemo, useState, VFC} from 'react';
import {Radio} from 'native-base';
import {View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useTimeFormat} from '~/screens/SpecificTimePausedScreen/hooks/UseTimeFormat.hook';
import {TimeFormatService} from '~/screens/SpecificTimePausedScreen/services/TimeFormat.service';
import {MaskedTimeInput} from './MaskedTimeInput';

import styles from './styles';

const amPm = {
  am: 'am',
  pm: 'pm',
};

interface IMaskedTimeView {
  name: string;
  initialValue: string;
  label?: string;
  onChangeValue: (time: Date, name: string) => void;
  onChangeValidation: (isValid: boolean, name: string) => void;
}

const setInitialRadioButtonValue = (value: string) => {
  const result = value.includes(amPm.pm) ? amPm.pm : amPm.am;
  return result;
};

export const MaskedTimeView: VFC<IMaskedTimeView> = ({
  name,
  initialValue,
  label,
  onChangeValue,
  onChangeValidation,
}) => {
  const {t} = useAppTranslation();
  const {is24TimeFormat} = useTimeFormat();
  const [radioButton, setRadioButton] = useState(
    setInitialRadioButtonValue(initialValue),
  );

  const [internalValue, setInternalValue] = useState<string>(initialValue);

  const isValid = useMemo(
    () => TimeFormatService.isValid(is24TimeFormat, internalValue, radioButton),
    [internalValue, is24TimeFormat, radioButton],
  );

  useEffect(() => {
    if (isValid && initialValue !== internalValue) {
      onChangeValue(
        TimeFormatService.createDate(
          is24TimeFormat,
          internalValue,
          radioButton,
        ),
        name,
      );
      onChangeValidation(isValid, name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, radioButton]);

  const handleValueChange = (value: string) => {
    setInternalValue(value);
    onChangeValidation(
      TimeFormatService.isValid(is24TimeFormat, value, radioButton),
      name,
    );
  };

  return (
    <View>
      {is24TimeFormat !== null && (
        <MaskedTimeInput
          label={label}
          initialValue={initialValue}
          onChangeValue={handleValueChange}
          isValid={isValid}
          errorMessage={t('emergencyContacts.dayTimePicker.invalidDate')}
        />
      )}
      {is24TimeFormat !== null && !is24TimeFormat && (
        <Radio.Group
          name="myRadioGroup"
          value={radioButton}
          style={styles.radioContainer}
          onChange={setRadioButton}>
          <Radio
            style={styles.radioItem}
            value={amPm.am}
            my={1}
            aria-label={amPm.am}>
            AM
          </Radio>
          <Radio
            style={styles.radioItem}
            value={amPm.pm}
            my={1}
            aria-label={amPm.pm}>
            PM
          </Radio>
        </Radio.Group>
      )}
    </View>
  );
};
