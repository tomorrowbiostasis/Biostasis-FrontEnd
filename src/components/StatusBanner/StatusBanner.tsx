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
  active: semanticColors.successSurface,
  degraded: semanticColors.warningSurface,
  offline: semanticColors.dangerSurface,
  noInternet: semanticColors.surfaceSubtle,
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
      style={[styles.container, {backgroundColor: surfaceColor[variant]}, style]}>
      <View style={[styles.dot, {backgroundColor: dotColor[variant]}]} />
      <View style={styles.textBlock}>
        <Text
          style={[
            styles.title,
            variant === 'noInternet' && styles.titleMuted,
          ]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              variant === 'noInternet' && styles.subtitleMuted,
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
    </View>
  );
};

export default React.memo(StatusBanner);
