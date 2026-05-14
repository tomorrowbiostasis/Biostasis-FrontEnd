import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {Input as NBInput, IInputProps} from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import styles from './styles';

type FormInputType = 'email' | 'password';

interface FormInputProps extends Omit<IInputProps, 'type'> {
  label: string;
  type?: FormInputType;
  errorMessage?: string;
}

const renderLeftIcon = (type: FormInputType) => {
  if (type === 'email') {
    return (
      <View style={styles.leftIcon}>
        <EntypoIcon name="mail" size={18} color="#96A3B3" />
      </View>
    );
  }
  return (
    <View style={styles.leftIcon}>
      <EvilIcons name="lock" size={22} color="#96A3B3" />
    </View>
  );
};

const FormInput: FC<FormInputProps> = ({
  label,
  type,
  errorMessage,
  ...inputProps
}) => {
  let typeProps: Partial<IInputProps> = {};
  if (type === 'email') {
    typeProps = {
      keyboardType: 'email-address',
      autoComplete: 'email',
      textContentType: 'emailAddress',
      autoCapitalize: 'none',
    };
  } else if (type === 'password') {
    typeProps = {
      secureTextEntry: true,
      autoCapitalize: 'none',
      autoCorrect: false,
    };
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <NBInput
        variant={'figma' as never}
        height={44}
        InputLeftElement={type ? renderLeftIcon(type) : undefined}
        isInvalid={!!errorMessage}
        {...typeProps}
        {...inputProps}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

export default FormInput;
