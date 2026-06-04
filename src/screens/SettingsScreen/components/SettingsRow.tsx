import React, {FC, ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {iconSizes, layout, semanticColors, typography} from '~/theme/tokens';
import IconChip from '~/components/IconChip';
import {ChevronRightIcon} from '~/assets/icons/AppIcons';

interface SettingsRowProps {
  /** Icon rendered as a framed asset, or a glyph when iconBackground is provided. */
  icon: ReactNode;
  /** Optional chip background tint for glyph-only icons. */
  iconBackground?: string;
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
      {iconBackground ? (
        <IconChip background={iconBackground}>{icon}</IconChip>
      ) : (
        icon
      )}
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <ChevronRightIcon
        size={iconSizes.chevron}
        color={semanticColors.iconChevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 10,
    gap: 14,
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
  },
  label: {
    flex: 1,
    ...typography.rowTitle,
    color: semanticColors.textPrimary,
  },
});

export default SettingsRow;
