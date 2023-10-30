import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputMargin: {
    marginTop: 20,
  },
  buttonSpace: {
    marginTop: 20,
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.blue[800],
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  alertContainer: {
    paddingBottom: 10,
  },
  lineStyle: {
    width: '100%',
    borderBottomColor: colors.gray[600],
    borderBottomWidth: 2,
    height: 1,
    marginVertical: 20,
  },
});

export default styles;
