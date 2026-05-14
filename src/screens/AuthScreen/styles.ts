import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: spacing.xl,
    paddingHorizontal: 34,
    paddingBottom: spacing['3xl'],
  },
  segmentedControl: {
    marginBottom: spacing['2xl'],
  },
  socialButton: {
    marginBottom: spacing.md,
  },
  dividerWrap: {
    paddingVertical: spacing.lg,
  },
});

export default styles;
