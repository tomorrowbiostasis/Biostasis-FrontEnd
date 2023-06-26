import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  inputMargin: {
    marginTop: 20,
  },
  buttonSpace: {
    marginTop: 15,
  },
  orSeparator: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: colors.gray[650],
  },

  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 30,
    color: colors.blue[800],
    textDecorationLine: 'underline'

  },
  loginButton: {
    backgroundColor: colors.green[800],
    marginTop: 50,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 20,
  },
  alertContainer: {
    paddingBottom: 10,
  },
});

export default styles;
