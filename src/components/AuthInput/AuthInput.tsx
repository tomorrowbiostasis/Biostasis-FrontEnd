import React, {FC, useCallback, useMemo, useRef} from 'react';
import {StyleProp, View, ViewStyle, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Input, IInputProps, FormControl, Stack} from 'native-base';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  BioLogInSignUpEmail,
  BioLogInSignUpLock,
} from '~/assets/icons/BiostasisIcons';
import styles from './styles';

interface AuthInputProps extends IInputProps {
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const AuthInput: FC<AuthInputProps> = props => {
  const {t} = useAppTranslation();

  const inputTypeProps = useMemo((): Partial<AuthInputProps> => {
    switch (props.type) {
      case 'password':
        return {
          placeholder: t('placeholder.password'),
          autoComplete: 'password',
          textContentType: 'password',
          secureTextEntry: true,
          autoCapitalize: 'none',
          InputLeftElement: <BioLogInSignUpLock />,
        };
      case 'email':
        return {
          placeholder: t('placeholder.email'),
          autoComplete: 'email',
          keyboardType: 'email-address',
          textContentType: 'emailAddress',
          autoCapitalize: 'none',
          InputLeftElement: <BioLogInSignUpEmail />,
        };
      default:
        return {};
    }
  }, [props.type, t]);

  const InputLeftElement = useCallback(() => {
    return (
      <View style={styles.iconContainer}>
        {inputTypeProps.InputLeftElement}
      </View>
    );
  }, [inputTypeProps.InputLeftElement]);

  const inputRef = useRef<TextInput>(null);
    const focusInput = () => {
      if(inputRef.current){
        return inputRef.current.focus();
      }
  };

  return (
    <TouchableWithoutFeedback onPress={focusInput}>
      <View style={props.containerStyle}>
        <FormControl isInvalid={!!props.errorMessage}>
          <Stack>
            <Input
              ref={inputRef}
              {...inputTypeProps}
              {...props}
              style={[styles.input, props.style]}
              InputLeftElement={<InputLeftElement />}
            />
            <FormControl.ErrorMessage>
              {props.errorMessage}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AuthInput;
