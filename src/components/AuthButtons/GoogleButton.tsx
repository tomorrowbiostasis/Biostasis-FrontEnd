import React from 'react';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
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
      startIcon={
        <View style={styles.iconFrame}>
          <GoogleIcon size={20} />
        </View>
      }
      onClick={onClick}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  iconFrame: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
