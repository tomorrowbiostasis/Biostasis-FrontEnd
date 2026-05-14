import {StyleSheet} from 'react-native';
import {radius, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: radius.pill,
  },
  dotActive: {
    width: 20,
  },
  dotInactive: {
    width: 6,
  },
});

export default styles;
