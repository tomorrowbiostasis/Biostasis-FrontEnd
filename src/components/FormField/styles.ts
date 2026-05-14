import {StyleSheet} from 'react-native';
import {semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.captionSemibold,
    color: semanticColors.textSecondary,
    marginBottom: spacing.xs,
  },
  required: {
    ...typography.captionSemibold,
    color: semanticColors.danger,
  },
  inputSlot: {
    width: '100%',
  },
  hint: {
    ...typography.caption,
    color: semanticColors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: semanticColors.danger,
    marginTop: spacing.xs,
  },
});

export default styles;
