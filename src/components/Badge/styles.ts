import {StyleSheet} from 'react-native';
import {radius, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  label: {
    ...typography.statusTagSmall,
  },
  upper: {
    textTransform: 'uppercase',
  },
});

export default styles;
