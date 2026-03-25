import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 2,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
    borderColor: colors.gray[300],
  },
  valid: {
    borderColor: colors.green[400],
  },
  invalid: {
    borderColor: colors.red[400],
  },
  input: {
    width: '90%',
    paddingVertical: 0,
    paddingLeft: 0,
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
  },
  errorMessage: {
    color: colors.red[400],
    fontSize: 12,
  },
  errorMessageContainer: {
    height: 18,
  },
  label: {
    color: colors.gray[700],
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  radioItem: {
    paddingHorizontal: 2,
  },
});

export default styles;
