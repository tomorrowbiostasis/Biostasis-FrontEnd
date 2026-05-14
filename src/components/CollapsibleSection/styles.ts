import {StyleSheet} from 'react-native';
import {semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border,
  },
  containerInset: {
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.bodySemibold,
    color: semanticColors.textPrimary,
    flex: 1,
    paddingRight: spacing.md,
  },
  chevron: {
    fontSize: 16,
    color: semanticColors.textSecondary,
    lineHeight: 16,
  },
  content: {
    paddingBottom: spacing.md,
  },
});

export default styles;
