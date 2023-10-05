import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
    transform: [{rotate: '180deg'}],
    color: colors.red[400],
  },
});

export default styles;
