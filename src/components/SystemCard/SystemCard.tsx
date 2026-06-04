import React, {FC, ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {iconSizes, layout, semanticColors} from '~/theme/tokens';
import {ChevronRightIcon} from '~/assets/icons/AppIcons';

interface SystemCardProps {
  /** Pre-built IconChip (or any leading visual). */
  chip: ReactNode;
  title: string;
  subtitle?: string;
  /** 'chevron' renders the default chevron, or pass a custom node (badge / toggle). */
  right?: 'chevron' | ReactNode;
  footer?: ReactNode;
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
  footer,
  onPress,
  highlighted,
  style,
}) => {
  const body = (
    <>
      <View style={styles.mainRow}>
        {chip}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={footer ? 3 : 2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right === 'chevron' ? (
          <ChevronRightIcon
            size={iconSizes.chevron}
            color={semanticColors.iconChevron}
          />
        ) : (
          right ?? null
        )}
      </View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    minHeight: 64,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 12,
    gap: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 19,
    color: '#6B7A8E',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.06)',
    paddingTop: 10,
  },
});

export default React.memo(SystemCard);
