import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 24,
  },
  entry: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#7A94AB',
  },
  entryDate: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#7A94AB',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: '#F4F6F9',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 2,
  },
  chipLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#7A94AB',
  },
  chipValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    color: semanticColors.primary,
  },
  chipUnit: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#7A94AB',
  },
  empty: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: 48,
  },
});

export default styles;
