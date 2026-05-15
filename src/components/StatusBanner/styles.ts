import {StyleSheet} from 'react-native';
import {radius, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 48,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 20,
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
});

export default styles;
