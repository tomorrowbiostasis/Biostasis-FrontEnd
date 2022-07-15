import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: '100%',
  },
  contentContainerStyle: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    height: 50,
  },
  emergencyButton: {
    backgroundColor: colors.magenta['400'],
    borderColor: colors.magenta['400'],
    marginTop: 20,
    height: 60,
  },
});

export default styles;
