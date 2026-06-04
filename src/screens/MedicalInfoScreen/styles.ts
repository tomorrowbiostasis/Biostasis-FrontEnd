import {StyleSheet} from 'react-native';
import {layout, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.xl,
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },
  intro: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: semanticColors.textSecondary,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  toggleInfo: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
  },
  toggleHint: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: semanticColors.textMuted,
  },
});

export default styles;
