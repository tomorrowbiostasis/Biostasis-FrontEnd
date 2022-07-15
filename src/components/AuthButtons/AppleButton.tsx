import React, {FC} from 'react';
import {RootAuthButton, IRootAuthButtonProps} from './RootAuthButton';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IAppleButtonProps
  extends Pick<
    IRootAuthButtonProps,
    'style' | 'text' | 'disabled' | 'onClick'
  > {}

export const AppleButton: FC<IAppleButtonProps> = ({
  style,
  text,
  disabled,
  onClick,
}) => {
  return (
    <RootAuthButton
      onClick={onClick}
      text={text}
      variant="solid"
      startIcon={<Icon name="apple" size={25} color="white" />}
      style={style}
      disabled={disabled}
    />
  );
};
