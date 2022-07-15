import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 100,
    backgroundColor: colors.green['400'],
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  error: {
    backgroundColor: colors.red['100'],
  },
  label: {
    color: colors.white,
  },
});

export default styles;
