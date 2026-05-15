import React, {FC, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

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
  size = 36,
  radius = 8,
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
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default IconChip;
