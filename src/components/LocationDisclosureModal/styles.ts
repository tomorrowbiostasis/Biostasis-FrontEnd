import {StyleSheet} from 'react-native';

import {radius, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: semanticColors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.bodyLg,
    color: semanticColors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: semanticColors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  allowButton: {
    backgroundColor: semanticColors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  allowLabel: {
    ...typography.bodySemibold,
    color: semanticColors.textInverse,
  },
  dismissButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissLabel: {
    ...typography.bodyMedium,
    color: semanticColors.textSecondary,
  },
});

export default styles;
