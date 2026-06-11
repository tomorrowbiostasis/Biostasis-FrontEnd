import {StyleSheet} from 'react-native';
import {semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  forgotPasswordContainer: {
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  forgotPasswordButton: {
    paddingVertical: 8,
  },
  forgotPasswordText: {
    ...typography.rowDescriptionMedium,
    color: semanticColors.primaryAccent,
  },
  submitButton: {
    marginTop: 12,
  },
});

export default styles;
