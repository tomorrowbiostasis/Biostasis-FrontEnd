import React from 'react';
import {FC} from 'react';
import GoogleIcon from '~/assets/icons/GoogleIcon';
import {RootAuthButton, IRootAuthButtonProps} from './RootAuthButton';

interface IGoogleButtonProps
  extends Pick<
    IRootAuthButtonProps,
    'style' | 'text' | 'disabled' | 'onClick'
  > {}

export const GoogleButton: FC<IGoogleButtonProps> = ({
  style,
  text,
  disabled,
  onClick,
}) => {
  return (
    <RootAuthButton
      disabled={disabled}
      text={text}
      variant="outline"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      style={style}
    />
  );
};
