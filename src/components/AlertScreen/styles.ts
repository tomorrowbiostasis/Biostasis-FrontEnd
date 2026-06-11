import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 28,
    lineHeight: 36,
    color: semanticColors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  headline: {
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
    lineHeight: 28,
    color: semanticColors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: semanticColors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
});

export default styles;
