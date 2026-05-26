import React, {FC, ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import {ChevronRightIcon} from '~/assets/icons/AppIcons';

interface SystemCardProps {
  /** Pre-built IconChip (or any leading visual). */
  chip: ReactNode;
  title: string;
  subtitle?: string;
  /** 'chevron' renders the default chevron, or pass a custom node (badge / toggle). */
  right?: 'chevron' | ReactNode;
  onPress?: () => void;
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Row card used across the dashboard "Emergency system" list and the Profile hub. */
const SystemCard: FC<SystemCardProps> = ({
  chip,
  title,
  subtitle,
  right,
  onPress,
  highlighted,
  style,
}) => {
  const body = (
    <>
      {chip}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right === 'chevron' ? (
        <ChevronRightIcon size={18} color={semanticColors.iconChevron} />
      ) : (
        right ?? null
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.card, highlighted && styles.highlighted, style]}>
        {body}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, highlighted && styles.highlighted, style]}>
      {body}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 12,
  },
  highlighted: {
    backgroundColor: '#F5FBF9',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.primary,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#96A3B3',
  },
});

export default SystemCard;
