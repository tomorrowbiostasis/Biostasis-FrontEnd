import React, {FC, useCallback, useMemo, useState} from 'react';
import {View} from 'native-base';
import {Text} from 'react-native';
import {MaskedTextInput} from 'react-native-mask-text';

import CheckMarkIcon from '~/assets/icons/CheckMarkIcon';
import styles from './styles';
import colors from '~/theme/colors';

interface IMaskedTimeInput {
  initialValue: string;
  label?: string;
  isValid?: boolean;
  errorMessage?: string;
  onChangeValue: (time: string) => void;
}

export const MaskedTimeInput: FC<IMaskedTimeInput> = ({
  label,
  initialValue,
  isValid,
  errorMessage,
  onChangeValue,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const inputStyles = useMemo(() => {
    if (isTouched) {
      return isValid ? styles.valid : styles.invalid;
    }
    return null;
  }, [isTouched, isValid]);

  const handleTime = useCallback(
    (time: string) => {
      onChangeValue(time);
      if (!isTouched && time) {
        setIsTouched(true);
      }
    },
    [isTouched, onChangeValue],
  );

  return (
    <View>
      <Text style={styles.label}>{label || 'HH:mm'}</Text>
      <View style={[styles.inputContainer, inputStyles]}>
        <MaskedTextInput
          mask="99:99"
          onChangeText={handleTime}
          style={styles.input}
          keyboardType="numeric"
          placeholder={'08:30'}
          defaultValue={initialValue}
          placeholderTextColor={colors.gray[500]}
        />
        {isTouched && isValid && <CheckMarkIcon />}
      </View>
      <View style={styles.errorMessageContainer}>
        {!isValid && isTouched && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    </View>
  );
};
