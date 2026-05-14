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
      _text={variant === 'solid' ? styles.textSolid : styles.textOutline}
      disabled={disabled}
      startIcon={startIcon}>
      {text}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
  },
  textSolid: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: colors.white,
  },
  textOutline: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: '#0B1F3A',
  },
  pressed: {
    borderRadius: 0,
  },
  buttonSolid: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  buttonOutlined: {
    borderColor: 'rgba(11, 31, 58, 0.18)',
    backgroundColor: colors.white,
  },
});
