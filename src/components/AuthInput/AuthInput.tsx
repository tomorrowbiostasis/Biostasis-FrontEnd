import React, {FC, useCallback, useMemo, useRef} from 'react';
import {StyleProp, View, ViewStyle, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Input, IInputProps, FormControl, Stack} from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import colors from '~/theme/colors';
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
          InputLeftElement: (
            <EvilIcons name="lock" size={29} color={colors.gray[600]} />
          ),
        };
      case 'email':
        return {
          placeholder: t('placeholder.email'),
          autoComplete: 'email',
          keyboardType: 'email-address',
          textContentType: 'emailAddress',
          autoCapitalize: 'none',
          //TODO: the icon doesn't look like on mockups, find better icon
          InputLeftElement: (
            <EntypoIcon name="newsletter" size={20} color={colors.gray[600]} />
          ),
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
