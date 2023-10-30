/* eslint-disable no-undef */
import {Button} from 'native-base';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';
import {ResponsiveValue} from 'styled-system';
import colors from '~/theme/colors';

export interface IRootAuthButtonProps {
  variant: ResponsiveValue<'solid' | 'outline'>;
  text: string;
  startIcon: JSX.Element;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const RootAuthButton = ({
  startIcon,
  text,
  variant,
  onClick,
  style,
  disabled,
}: IRootAuthButtonProps) => {
  return (
    <Button
      variant={variant}
      onPress={onClick}
      style={[
        styles.button,
        variant === 'solid' ? styles.buttonSolid : styles.buttonOutlined,
        style,
      ]}
      _text={styles.text}
      disabled={disabled}
      startIcon={startIcon}>
      {text}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    paddingLeft: 1,
  },
  pressed: {
    borderRadius: 0,
  },
  buttonSolid: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  buttonOutlined: {
    borderColor: colors.gray[500],
  },
});
