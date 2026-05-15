import React, {FC} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

export type StatusBannerVariant =
  | 'active'
  | 'degraded'
  | 'offline'
  | 'noInternet';

interface StatusBannerProps {
  variant: StatusBannerVariant;
  title: string;
  subtitle?: string;
  timestamp?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const dotColor: Record<StatusBannerVariant, string> = {
  active: semanticColors.success,
  degraded: semanticColors.warning,
  offline: semanticColors.danger,
  noInternet: semanticColors.textDisabled,
};

const surfaceColor: Record<StatusBannerVariant, string> = {
  active: '#E6F6F0',
  degraded: semanticColors.warningSurface,
  offline: semanticColors.dangerSurface,
  noInternet: semanticColors.surfaceSubtle,
};

const borderColor: Record<StatusBannerVariant, string> = {
  active: 'rgba(30, 155, 107, 0.2)',
  degraded: 'rgba(245, 166, 35, 0.25)',
  offline: 'rgba(229, 55, 58, 0.25)',
  noInternet: semanticColors.border,
};

const titleColor: Record<StatusBannerVariant, string> = {
  active: semanticColors.success,
  degraded: semanticColors.warningStrong,
  offline: semanticColors.danger,
  noInternet: semanticColors.textMuted,
};

const StatusBanner: FC<StatusBannerProps> = ({
  variant,
  title,
  subtitle,
  timestamp,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: surfaceColor[variant],
          borderColor: borderColor[variant],
        },
        style,
      ]}>
      <View style={[styles.dot, {backgroundColor: dotColor[variant]}]} />
      <View style={styles.textBlock}>
        <Text style={[styles.title, {color: titleColor[variant]}]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
    </View>
  );
};

export default React.memo(StatusBanner);
