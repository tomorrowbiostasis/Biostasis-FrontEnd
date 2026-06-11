import {StyleSheet} from 'react-native';
import {semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    minHeight: 68,
  },
  termsText: {
    flex: 1,
    ...typography.rowDescription,
    color: '#5A6A7E',
  },
  termsLink: {
    color: semanticColors.primaryAccent,
  },
  submitButton: {
    marginTop: 12,
  },
});

export default styles;
