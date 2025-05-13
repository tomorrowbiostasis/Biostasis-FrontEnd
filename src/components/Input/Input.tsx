import React, {FC, useMemo, useRef} from 'react';
import {StyleProp, ViewStyle, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Input as NBInput, IInputProps, FormControl, Stack} from 'native-base';
import CheckMarkIcon from '~/assets/icons/CheckMarkIcon';

import styles from './styles';
interface InputProps extends IInputProps {
  label: string;
  isValid?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface ValidProps extends Partial<IInputProps> {}

const Input: FC<InputProps> = props => {
  const validProps: ValidProps = useMemo(() => {
    return props.isValid
      ? {
          _android: styles.validBorder,
          _ios: styles.validBorder,
          InputRightElement: <CheckMarkIcon />,
        }
      : // Used <></> here because without this, input component is rerendered and loses focus
        {InputRightElement: <></>};
  }, [props.isValid]);
  const inputRef = useRef<TextInput>(null);
  const focusInput = () => {
    if(inputRef.current){
      return inputRef.current.focus();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={focusInput}>
      <FormControl style={props.containerStyle} isInvalid={!!props.errorMessage}>
        <Stack>
          <FormControl.Label>{props.label}</FormControl.Label>
          <NBInput
            ref={inputRef}
            size="lg"
            variant="underlined"
            {...props}
            {...validProps}
            style={[props.style, validProps.style]}
            isInvalid={!!(props.isInvalid || props.errorMessage)}
          />
          <FormControl.ErrorMessage>
            {props.errorMessage}
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>
    </TouchableWithoutFeedback>
  );
};

export default Input;
