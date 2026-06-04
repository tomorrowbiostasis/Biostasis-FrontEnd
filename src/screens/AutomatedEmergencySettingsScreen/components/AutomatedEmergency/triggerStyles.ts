import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

/** Shared styles for the redesigned Bio / Time trigger panels. */
const triggerStyles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  embeddedCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.08)',
    marginTop: -4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#3D5470',
  },
  warning: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7A8E',
  },
  recommendation: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7A8E',
  },
  frequencyLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
    marginTop: 4,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: semanticColors.border,
  },
  rowLabelWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: semanticColors.primary,
  },
  /* status badge */
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeOn: {
    backgroundColor: semanticColors.successSurface,
  },
  badgeOff: {
    backgroundColor: semanticColors.warningSurface,
  },
  badgeText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
  },
});

export default triggerStyles;
