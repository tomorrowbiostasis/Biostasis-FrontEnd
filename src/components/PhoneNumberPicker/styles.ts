import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 2,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    marginBottom: 3,
    borderColor: colors.blue[200],
  },
  inputContainerText: {
    color: colors.gray[800],
    fontSize: 18,
  },
  valid: {
    borderColor: colors.green[400],
  },
  invalid: {
    borderColor: colors.red[400],
  },
  input: {
    width: '90%',
  },
  errorMessage: {
    color: colors.red[400],
  },
  errorMessageContainer: {
    height: 20,
  },
  label: {
    color: colors.gray[800],
    opacity: 0.8,
    fontSize: 14,
  },
  // Figma redesign variant
  figmaLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    letterSpacing: 0.8,
    color: semanticColors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  figmaInputContainer: {
    height: 44,
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 14,
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  figmaInput: {
    flex: 1,
    height: 42,
  },
  figmaInputContainerText: {
    color: semanticColors.textPrimary,
    fontSize: 15,
    fontFamily: 'DMSans-Regular',
  },
  figmaInvalid: {
    borderColor: semanticColors.danger,
    backgroundColor: semanticColors.dangerSurface,
  },
  figmaErrorMessage: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: semanticColors.danger,
    marginTop: 4,
  },
});

export default styles;
