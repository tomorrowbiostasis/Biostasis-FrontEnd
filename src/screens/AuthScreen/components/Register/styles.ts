import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  authInputTopSpace: {
    marginTop: 20,
  },
  separator: {
    marginTop: 20,
  },
  lineStyle: {
    width: '100%',
    borderBottomColor: colors.gray[600],
    borderBottomWidth: 2,
    height: 1,
    marginVertical: 20,
  },
  bottomContainer: {
    paddingHorizontal: 5,
  },
  button: {
    marginTop: 20,
  },
  alertContainer: {
    paddingBottom: 10,
  },
});

export default styles;
