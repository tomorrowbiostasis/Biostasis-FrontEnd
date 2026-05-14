import {StyleSheet} from 'react-native';
import {radius, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    minHeight: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    marginRight: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    ...typography.bodySemibold,
    color: semanticColors.textPrimary,
  },
  titleMuted: {
    color: semanticColors.textMuted,
  },
  subtitle: {
    ...typography.caption,
    color: semanticColors.textSecondary,
    marginTop: spacing.xxs,
  },
  subtitleMuted: {
    color: semanticColors.textMuted,
  },
  timestamp: {
    ...typography.captionMedium,
    color: semanticColors.textSecondary,
    marginLeft: spacing.md,
  },
});

export default styles;
