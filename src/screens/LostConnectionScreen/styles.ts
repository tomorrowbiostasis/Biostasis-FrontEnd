import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.gray[50],
    width: '100%',
    justifyContent: 'center',
  },
  contentContainerStyle: {
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    height: 60,
  },
});

export default styles;
