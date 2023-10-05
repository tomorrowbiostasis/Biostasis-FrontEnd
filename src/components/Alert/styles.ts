import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 100,
    backgroundColor: colors.green['200'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  error: {
    backgroundColor: colors.red['600'],
  },
  label: {
    color: colors.white,
  },
});

export default styles;
