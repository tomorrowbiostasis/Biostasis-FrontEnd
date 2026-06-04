import {StyleSheet} from 'react-native';
import {radius, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 56,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 21,
  },
  subtitle: {
    ...typography.caption,
    color: semanticColors.textSecondary,
    marginTop: spacing.xxs,
  },
  timestamp: {
    ...typography.captionMedium,
    color: semanticColors.textSecondary,
    marginLeft: spacing.md,
  },
  actionButton: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11, 31, 58, 0.08)',
  },
  actionText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    color: semanticColors.primary,
  },
});

export default styles;
