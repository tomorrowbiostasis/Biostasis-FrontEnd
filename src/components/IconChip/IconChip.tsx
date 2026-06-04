import React, {FC, ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {iconSizes} from '~/theme/tokens';

interface IconChipProps {
  children: ReactNode;
  background: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Rounded tinted square that wraps a line icon (dashboard / system-card chips). */
const IconChip: FC<IconChipProps> = ({
  children,
  background,
  size = iconSizes.rowChip,
  radius = iconSizes.rowChipRadius,
  style,
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: background,
        },
        styles.base,
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconChip;
