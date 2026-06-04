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
    paddingHorizontal: layout.screenGutterCompact,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 18,
  },
  dimmed: {
    opacity: 0.5,
  },
  statusCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 13,
  },
  statusCardReady: {
    backgroundColor: '#FFF8EE',
    borderColor: 'rgba(245, 166, 35, 0.28)',
  },
  statusCardActive: {
    backgroundColor: '#F1FAF6',
    borderColor: 'rgba(30, 155, 107, 0.22)',
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconReady: {
    backgroundColor: 'transparent',
  },
  statusIconActive: {
    backgroundColor: 'transparent',
  },
  statusTextBlock: {
    gap: 5,
  },
  statusEyebrow: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#6B7A8E',
  },
  statusTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    lineHeight: 25,
    color: semanticColors.primary,
  },
  statusSubtitle: {
    ...typography.body,
    color: '#5F6F84',
  },
  statusAction: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  statusActionText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },

  /* How it works card */
  howCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  howTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 24,
    color: semanticColors.primary,
  },
  howHeaderText: {
    flex: 1,
    gap: 5,
  },
  howCompletedSubtitle: {
    ...typography.rowDescription,
    color: '#6B7A8E',
  },
  howChevron: {
    marginTop: 2,
  },
  howDescription: {
    ...typography.body,
    color: '#3D5470',
  },
  steps: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIconWrap: {
    paddingTop: 2,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 24,
    color: semanticColors.primary,
  },
  stepDesc: {
    ...typography.rowDescription,
    color: '#3D5470',
  },
  understandButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  understandButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },

  /* Enable toggles card */
  togglesCard: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  lockedCard: {
    opacity: 0.72,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepCardTitleBlock: {
    flex: 1,
    gap: 4,
  },
  stepCardTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  stepCardDescription: {
    ...typography.rowDescription,
    color: '#6B7A8E',
  },
  toggleRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.08)',
    paddingTop: 12,
  },
  toggleLabel: {
    flex: 1,
    paddingRight: 12,
    ...typography.body,
    color: semanticColors.primary,
  },
  toggleHelper: {
    ...typography.rowDescription,
    color: '#5F6F84',
  },
  lockedInlineAction: {
    minHeight: 42,
    borderRadius: 13,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  lockedInlineActionText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  choiceIntroCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  activeConfiguration: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeHeaderCopy: {
    flex: 1,
    gap: 3,
  },
  activeTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  activeDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  activeSummaryRows: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.08)',
    paddingTop: 12,
    gap: 10,
  },
  activeSummaryRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  activeSummaryLabelGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  activeSummaryLabel: {
    flex: 1,
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  activeSummaryValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.primary,
  },
  activeSummaryValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  activeSummaryValueSuccess: {
    color: '#1E9B6B',
  },
  activeSummaryValueWarning: {
    color: '#D4820A',
  },
  switchModeButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.12)',
    backgroundColor: semanticColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  switchModeButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.primary,
  },
  modeSection: {
    gap: 10,
  },
  modeSectionHeader: {
    gap: 4,
  },
  modeSectionTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  modeSectionSubtitle: {
    ...typography.rowDescription,
    color: '#6B7A8E',
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  modeOptionActive: {
    backgroundColor: '#F1FAF6',
    borderColor: 'rgba(30, 155, 107, 0.26)',
  },
  modeOptionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeOptionCopy: {
    flex: 1,
    gap: 3,
  },
  modeOptionTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  modeOptionDescription: {
    ...typography.rowDescription,
    color: '#5F6F84',
  },
  modeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: 116,
  },
  modeBadgeActive: {
    backgroundColor: '#DDF4E9',
  },
  modeBadgeIdle: {
    backgroundColor: '#E8EEF5',
  },
  modeBadgeText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  modeBadgeTextActive: {
    color: '#1E9B6B',
  },
  modeBadgeTextIdle: {
    color: '#163A63',
  },
});

export default styles;
