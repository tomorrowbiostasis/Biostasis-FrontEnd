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
    width: '30%',
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
    paddingTop: 18,
    paddingBottom: 16,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  cardDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: semanticColors.textSecondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E9F0',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 36,
  },
  rowLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#3D5470',
  },
  rowValueAccent: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.primaryAccent,
    textAlign: 'right',
  },
  readings: {
    gap: 0,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E9F0',
  },
  readingDetail: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: semanticColors.textSecondary,
    marginTop: 2,
  },
  footer: {
    backgroundColor: semanticColors.surfaceCanvas,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
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
