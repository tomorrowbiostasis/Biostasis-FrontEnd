import React, {FC, ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import IconChip from '~/components/IconChip';
import {ChevronRightIcon} from '~/assets/icons/AppIcons';

interface SettingsRowProps {
  /** Line icon rendered inside the tinted chip. */
  icon: ReactNode;
  /** Chip background tint (from Figma icon set 382-18912). */
  iconBackground: string;
  label: string;
  onPress: () => void;
}

/** Navigation row for the Settings scene — white card, tinted icon chip, chevron. */
const SettingsRow: FC<SettingsRowProps> = ({
  icon,
  iconBackground,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <IconChip background={iconBackground} size={36} radius={8}>
        {icon}
      </IconChip>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <ChevronRightIcon size={18} color={semanticColors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 10,
    gap: 12,
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
  },
  label: {
    flex: 1,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.textPrimary,
  },
});

export default SettingsRow;
