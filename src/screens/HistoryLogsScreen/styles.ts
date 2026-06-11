import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  list: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  statsCard: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  statsTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: semanticColors.surfaceCanvas,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  statLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: semanticColors.textSecondary,
  },
  statValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  entry: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  entryTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  entryMeta: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: semanticColors.textSecondary,
    marginTop: 2,
  },
  entryDate: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: semanticColors.textSecondary,
    textAlign: 'right',
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
    fontSize: 16,
    lineHeight: 20,
    color: semanticColors.primary,
  },
  chipUnit: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#7A94AB',
  },
  empty: {
    ...typography.body,
    color: semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: 48,
  },
});

export default styles;
