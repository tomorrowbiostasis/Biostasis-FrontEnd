import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  header: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: 24,
  },
  logoWrap: {
    height: 18,
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'DMSans-Medium',
    fontSize: 18,
    letterSpacing: 0,
    color: '#F1F3F6',
    marginTop: 12,
  },
  name: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 26,
    color: '#F1F3F6',
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: semanticColors.surfaceCanvas,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  menuButtonWrap: {
    width: 44,
    height: 44,
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: semanticColors.primary,
  },
  menuLineLong: {
    width: 17,
  },
  menuLineShort: {
    width: 12,
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scrollContent: {
    paddingHorizontal: layout.screenGutterCompact,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 18,
  },
  readinessCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    gap: 14,
  },
  readinessCardActive: {
    backgroundColor: '#F1FAF6',
    borderColor: 'rgba(30, 155, 107, 0.22)',
  },
  readinessCardAttention: {
    backgroundColor: '#FFF8EE',
    borderColor: 'rgba(245, 166, 35, 0.28)',
  },
  readinessCardSetup: {
    backgroundColor: '#FFF8EE',
    borderColor: 'rgba(245, 166, 35, 0.28)',
  },
  readinessHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  readinessTopRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readinessIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readinessIconActive: {
    backgroundColor: 'transparent',
  },
  readinessIconAttention: {
    backgroundColor: 'transparent',
  },
  readinessIconSetup: {
    backgroundColor: 'transparent',
  },
  readinessStatusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readinessStatusIconActive: {
    backgroundColor: 'transparent',
  },
  readinessStatusPill: {
    marginLeft: 'auto',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  readinessStatusPillActive: {
    backgroundColor: 'rgba(30, 155, 107, 0.14)',
  },
  readinessStatusPillAttention: {
    backgroundColor: 'rgba(212, 130, 10, 0.14)',
  },
  readinessStatusPillSetup: {
    backgroundColor: 'rgba(212, 130, 10, 0.14)',
  },
  readinessStatusPillText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    lineHeight: 15,
  },
  readinessStatusPillTextActive: {
    color: '#1E9B6B',
  },
  readinessStatusPillTextWarning: {
    color: '#D4820A',
  },
  readinessTitleBlock: {
    gap: 5,
  },
  readinessEyebrow: {
    flexShrink: 1,
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#6B7A8E',
  },
  readinessTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 19,
    lineHeight: 24,
    color: semanticColors.primary,
  },
  readinessSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#5F6F84',
  },
  readinessChecklist: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.08)',
    overflow: 'hidden',
  },
  readinessRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 31, 58, 0.06)',
  },
  readinessRowIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readinessRowIconDone: {
    backgroundColor: 'rgba(30, 155, 107, 0.12)',
  },
  readinessRowIconTodo: {
    backgroundColor: 'rgba(212, 130, 10, 0.12)',
  },
  readinessRowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D4820A',
  },
  readinessRowLabel: {
    flex: 1,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 19,
    color: semanticColors.primary,
  },
  readinessRowValuePill: {
    flexShrink: 0,
    maxWidth: '48%',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  readinessRowValuePillSuccess: {
    backgroundColor: 'rgba(30, 155, 107, 0.12)',
  },
  readinessRowValuePillWarning: {
    backgroundColor: 'rgba(212, 130, 10, 0.12)',
  },
  readinessRowValuePillMuted: {
    backgroundColor: 'rgba(107, 122, 142, 0.13)',
  },
  readinessRowValue: {
    textAlign: 'right',
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    lineHeight: 17,
  },
  readinessRowValueDone: {
    color: '#1E9B6B',
  },
  readinessRowValueTodo: {
    color: '#D4820A',
  },
  readinessRowValueMuted: {
    color: '#6B7A8E',
  },
  readinessAction: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  readinessActionText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  metricsCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 146,
    gap: 12,
  },
  metricsTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  collectedAt: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 23,
    color: '#1D1617',
  },
  metricSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7A8E',
    marginTop: -2,
  },
  lastCheckedText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: '#6B7A8E',
  },
  lastCheckedRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lastCheckedTime: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  monitoringSourceRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.06)',
    paddingTop: 12,
  },
  monitoringSourceLabel: {
    flex: 1,
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: '#6B7A8E',
  },
  monitoringSourceValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 1,
  },
  monitoringSourceValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  refreshIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F6F9',
    borderWidth: 1,
    borderColor: '#E2E9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIconButtonRefreshing: {
    backgroundColor: '#EEF4FA',
    borderColor: 'rgba(46, 125, 175, 0.24)',
  },
  refreshIconButtonSuccess: {
    backgroundColor: 'rgba(30, 155, 107, 0.12)',
    borderColor: 'rgba(30, 155, 107, 0.28)',
  },
  metricsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 18,
    minHeight: 80,
    alignItems: 'flex-start',
  },
  metricHelper: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7A8E',
  },
  metricSubtitleSuccess: {
    color: '#1E9B6B',
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: '#6B7A8E',
  },
  healthMetric: {
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  healthMetricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  healthMetricLabel: {
    flexShrink: 1,
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#A3AEC0',
  },
  healthMetricValueRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  healthMetricValue: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 34,
    lineHeight: 40,
    color: semanticColors.primary,
  },
  healthMetricUnit: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    lineHeight: 18,
    color: '#6B7A8E',
  },
  cards: {
    gap: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 24,
  },
  badgeText: {
    ...typography.statusTag,
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusPill: {
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
  },
  statusPillText: {
    ...typography.statusTag,
  },
  statusActionText: {
    flexShrink: 1,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.primary,
    textAlign: 'right',
  },
  statusActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    flexShrink: 1,
  },
  emergencyStatusFooter: {
    gap: 10,
  },
  emergencyStatusDivider: {
    height: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.06)',
  },
  emergencyStatusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  emergencyStatusStripSuccess: {
    backgroundColor: '#EAF7F2',
    borderColor: 'rgba(30, 155, 107, 0.24)',
  },
  emergencyStatusStripWarning: {
    backgroundColor: '#FFF8EE',
    borderColor: 'rgba(212, 130, 10, 0.24)',
  },
  emergencyStatusStripMuted: {
    backgroundColor: '#F4F6F9',
    borderColor: 'rgba(107, 122, 142, 0.18)',
  },
  emergencyStatusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyStatusIconSuccess: {
    backgroundColor: 'transparent',
  },
  emergencyStatusIconWarning: {
    backgroundColor: 'rgba(212, 130, 10, 0.12)',
  },
  emergencyStatusIconMuted: {
    backgroundColor: 'rgba(107, 122, 142, 0.14)',
  },
  emergencyStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emergencyStatusDotWarning: {
    backgroundColor: '#D4820A',
  },
  emergencyStatusDotMuted: {
    backgroundColor: '#6B7A8E',
  },
  emergencyStatusTextBlock: {
    flex: 1,
    gap: 2,
  },
  emergencyStatusTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    lineHeight: 19,
    color: semanticColors.primary,
  },
  emergencyStatusDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#5F6F84',
  },
});

export default styles;
