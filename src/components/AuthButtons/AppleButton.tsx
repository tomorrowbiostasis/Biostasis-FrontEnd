import React, {FC} from 'react';
import {RootAuthButton, IRootAuthButtonProps} from './RootAuthButton';
import {StyleSheet, View} from 'react-native';
import {AppleIcon} from '~/assets/icons/AppIcons';

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
      startIcon={
        <View style={styles.iconFrame}>
          <AppleIcon size={19} color="white" />
        </View>
      }
      style={style}
      disabled={disabled}
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
