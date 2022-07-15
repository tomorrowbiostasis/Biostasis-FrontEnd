import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.gray[200],
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
  },
});

export default styles;
