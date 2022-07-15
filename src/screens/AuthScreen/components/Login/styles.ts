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
    marginTop: 20,
  },
  loginButton: {
    marginTop: 50,
  },
  alertContainer: {
    paddingBottom: 10,
  },
});

export default styles;
