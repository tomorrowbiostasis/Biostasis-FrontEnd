import {StyleSheet} from 'react-native';
import {semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.surface,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  illustrationWrap: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  badgeSpacing: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
  },
  title: {
    ...typography.displayLg,
    color: semanticColors.textPrimary,
    textAlign: 'left',
    marginTop: spacing.sm,
  },
  body: {
    ...typography.body,
    color: semanticColors.textSecondary,
    textAlign: 'left',
    marginTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.bodyMedium,
    color: semanticColors.textSecondary,
  },
  skipTextHidden: {
    opacity: 0,
  },
});

export default styles;
