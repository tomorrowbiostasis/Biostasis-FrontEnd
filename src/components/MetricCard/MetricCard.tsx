import React, {FC, ReactNode} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {semanticColors} from '~/theme/tokens';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  caption?: string;
  style?: StyleProp<ViewStyle>;
}

/** Bordered white metric tile — icon + uppercase label + display value + caption. */
const MetricCard: FC<MetricCardProps> = ({icon, label, value, caption, style}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.labelRow}>
        {icon}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {caption ? (
        <Text style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    padding: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: '#96A3B3',
  },
  value: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 36,
    color: semanticColors.primary,
    marginTop: 4,
  },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: semanticColors.textSecondary,
    marginTop: 2,
  },
});

export default React.memo(MetricCard);
