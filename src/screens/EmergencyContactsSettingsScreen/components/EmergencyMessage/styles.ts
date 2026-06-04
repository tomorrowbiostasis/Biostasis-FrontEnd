import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

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
    gap: 14,
    minHeight: 64,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 10,
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
  },
  toggleTitle: {
    flex: 1,
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  counter: {
    ...typography.counter,
    color: '#3D5470',
  },
  sectionHelper: {
    ...typography.sectionDescription,
    color: '#3D5470',
  },
  messageInput: {
    height: 170,
    padding: 14,
    backgroundColor: semanticColors.surface,
    borderWidth: 1.5,
    borderColor: 'rgba(11, 31, 58, 0.2)',
    borderRadius: 14,
    ...typography.input,
    color: semanticColors.textPrimary,
  },
  messageInputFocused: {
    borderColor: '#2E7DAF',
    backgroundColor: '#F8FBFE',
    shadowColor: '#2E7DAF',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  helper: {
    ...typography.sectionDescription,
    color: '#3D5470',
  },
  error: {
    ...typography.sectionDescription,
    color: semanticColors.danger,
  },
  footer: {
    gap: 12,
    paddingTop: 2,
    paddingBottom: 8,
  },
  saveButton: {
    minHeight: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  saveButtonSaved: {
    backgroundColor: '#EAF7F2',
    borderColor: 'rgba(30, 155, 107, 0.32)',
  },
  saveText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  saveTextSaved: {
    color: '#1E9B6B',
  },
  testButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: semanticColors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    ...typography.buttonLabel,
    color: semanticColors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default styles;
