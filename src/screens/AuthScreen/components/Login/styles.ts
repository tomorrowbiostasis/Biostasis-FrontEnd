import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  alertContainer: {
    paddingBottom: 10,
  },
  forgotPasswordContainer: {
    minHeight: 68,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: semanticColors.primaryAccent,
  },
  submitButton: {
    marginTop: 12,
  },
});

export default styles;
