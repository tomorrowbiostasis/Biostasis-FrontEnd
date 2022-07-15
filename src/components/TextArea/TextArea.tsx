import {FormControl} from 'native-base';
import React, {useCallback, useMemo, useState, VFC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  View,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import CheckMarkIcon from '~/assets/icons/CheckMarkIcon';
import colors from '~/theme/colors';
import styles from './styles';

interface ITextAreaProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  isValid?: boolean;
  inputStyle?: TextInputProps['style'];
  containerStyle?: StyleProp<ViewStyle>;
}

const TextArea: VFC<ITextAreaProps> = ({
  label,
  errorMessage,
  isValid,
  inputStyle,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const validationColor = useMemo(() => {
    if (isFocused) {
      return colors.blue[400];
    }
    if (isValid) {
      return colors.green[400];
    }
    if (errorMessage) {
      return colors.red[400];
    }
    return colors.blue[300];
  }, [isFocused, errorMessage, isValid]);

  const handleFocus: (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => void = useCallback(
    e => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void =
    useCallback(
      e => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

  return (
    <FormControl
      isInvalid={!!errorMessage && !isFocused}
      style={containerStyle}>
      <View style={[styles.container, {borderColor: validationColor}]}>
        <View style={styles.inputContainer}>
          <FormControl.Label>{label}</FormControl.Label>
          <TextInput
            placeholderTextColor={colors.gray[500]}
            multiline={true}
            {...props}
            style={[styles.input, inputStyle]}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
        {isValid && (
          <View style={styles.validCheckMarkContainer}>
            <CheckMarkIcon />
          </View>
        )}
      </View>

      <FormControl.ErrorMessage style={styles.errorMessage}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};

export default TextArea;
