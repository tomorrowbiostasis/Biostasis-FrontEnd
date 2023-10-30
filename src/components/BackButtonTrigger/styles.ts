import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    top: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    color: colors.red[400],
  },
  icon: {
    marginRight: 10,
    transform: [{rotate: '180deg'}],
    color: colors.red[400],
  },
});

export default styles;
