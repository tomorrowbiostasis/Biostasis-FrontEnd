import {StyleSheet} from 'react-native';
import {semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: spacing.md,
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  label: {
    ...typography.bodySemibold,
    color: semanticColors.textPrimary,
  },
  description: {
    ...typography.body,
    color: semanticColors.textSecondary,
    marginTop: spacing.xxs,
  },
  rightSlot: {
    flexShrink: 0,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default styles;
