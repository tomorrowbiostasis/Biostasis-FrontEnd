import {StyleSheet} from 'react-native';
import {layout, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  hero: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 39,
    borderBottomRightRadius: 39,
    paddingHorizontal: layout.screenGutter,
    paddingBottom: spacing['3xl'],
  },
  logoWrap: {
    marginTop: spacing.md,
    height: 24,
    justifyContent: 'center',
  },
  illustrationHolder: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  title: {
    ...typography.displayLg,
    color: semanticColors.textInverse,
    textAlign: 'left',
    marginTop: spacing['2xl'],
  },
  description: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'left',
    marginTop: spacing.sm,
  },
  actions: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing['3xl'],
    gap: spacing.md,
  },
  footerWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenGutter,
    paddingBottom: spacing.lg,
  },
  footerText: {
    ...typography.rowDescription,
    color: '#96A3B3',
    textAlign: 'center',
  },
  footerLink: {
    color: semanticColors.primaryAccent,
  },
});

export default styles;
