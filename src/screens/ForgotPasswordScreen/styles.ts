import {StyleSheet} from 'react-native';
import {layout, semanticColors, spacing} from '~/theme/tokens';

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
    paddingHorizontal: layout.screenGutter,
    paddingBottom: spacing['3xl'],
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default styles;
