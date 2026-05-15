import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const CARD_BORDER = 'rgba(11, 31, 58, 0.1)';

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  section: {
    gap: 8,
  },
  toggleCards: {
    gap: 10,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    padding: 10,
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
  },
  toggleTitle: {
    flex: 1,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
  },
  counter: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: '#3D5470',
  },
  messageInput: {
    minHeight: 104,
    padding: 12,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: 'rgba(13, 27, 42, 0.12)',
    borderRadius: 14,
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19.5,
    color: semanticColors.textPrimary,
  },
  helper: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19.5,
    color: '#3D5470',
  },
  error: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19.5,
    color: semanticColors.danger,
  },
  footer: {
    gap: 12,
  },
  saveButton: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: semanticColors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.textInverse,
  },
  testButton: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: semanticColors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default styles;
