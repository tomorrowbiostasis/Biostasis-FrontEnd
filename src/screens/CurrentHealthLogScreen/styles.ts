import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  emptyHeader: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: layout.screenGutter,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: layout.screenGutter,
    paddingBottom: 24,
    gap: 12,
  },
  metricTile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  metricLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metricValue: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 30,
    color: '#FFFFFF',
    marginTop: 4,
  },
  metricUnit: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: 16,
  },
  rows: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E9F0',
  },
  rowLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: '#3D5470',
  },
  rowValueMuted: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: '#7A94AB',
  },
  rowValueAccent: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: semanticColors.primaryAccent,
  },
  footer: {
    backgroundColor: semanticColors.surfaceCanvas,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: 28,
  },
  historyButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  historyButtonDisabled: {
    backgroundColor: semanticColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
  },
  historyButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  historyButtonTextDisabled: {
    color: '#ACACAC',
  },
});

export default styles;
