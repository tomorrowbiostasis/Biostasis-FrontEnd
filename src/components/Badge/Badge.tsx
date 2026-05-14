import React, {FC} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

export type BadgeVariant =
  | 'info'
  | 'danger'
  | 'success'
  | 'warning'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const variantBg: Record<BadgeVariant, string> = {
  info: semanticColors.infoSurface,
  danger: semanticColors.dangerSurface,
  success: semanticColors.successSurface,
  warning: semanticColors.warningSurface,
  neutral: semanticColors.surfaceMuted,
};

const variantText: Record<BadgeVariant, string> = {
  info: semanticColors.primaryAccent,
  danger: semanticColors.dangerStrong,
  success: semanticColors.success,
  warning: semanticColors.warningStrong,
  neutral: semanticColors.textSecondary,
};

const Badge: FC<BadgeProps> = ({
  label,
  variant,
  uppercase = true,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[styles.container, {backgroundColor: variantBg[variant]}, style]}>
      <Text
        style={[
          styles.label,
          {color: variantText[variant]},
          uppercase && styles.upper,
        ]}>
        {label}
      </Text>
    </View>
  );
};

export default React.memo(Badge);
