import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 17,
  },
  card: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 14,
    padding: 18,
    gap: 15,
  },
  cardLabel: {
    fontFamily: 'DMSans-Bold',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#7A94AB',
  },
  timeField: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    borderRadius: 14,
    backgroundColor: semanticColors.surface,
  },
  timeFieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  timeFieldValue: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    color: semanticColors.primaryDeep,
  },
  timeFieldPlaceholder: {
    color: semanticColors.textMuted,
  },
  chevron: {
    transform: [{rotate: '90deg'}],
  },
  saveButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: semanticColors.danger,
  },
});

export default styles;
