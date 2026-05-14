import React, {FC, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

export type IconCardVariant = 'info' | 'danger' | 'success' | 'neutral';
type IconCardSize = 'md' | 'lg';

interface IconCardProps {
  variant: IconCardVariant;
  children: ReactNode;
  size?: IconCardSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const variantBg: Record<IconCardVariant, string> = {
  info: semanticColors.infoSurface,
  danger: semanticColors.dangerSurface,
  success: semanticColors.successSurface,
  neutral: semanticColors.surfaceMuted,
};

const sizeMap: Record<IconCardSize, number> = {
  md: 160,
  lg: 200,
};

const IconCard: FC<IconCardProps> = ({
  variant,
  children,
  size = 'lg',
  style,
  testID,
}) => {
  const dimension = sizeMap[size];
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          backgroundColor: variantBg[variant],
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default React.memo(IconCard);
