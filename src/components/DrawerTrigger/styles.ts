import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  bar: {
    height: 2,
    backgroundColor: colors.gray['800'],
    borderRadius: 2,
  },
});

export default styles;
