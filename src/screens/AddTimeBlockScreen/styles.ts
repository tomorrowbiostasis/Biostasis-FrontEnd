import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 34,
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
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: semanticColors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
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
