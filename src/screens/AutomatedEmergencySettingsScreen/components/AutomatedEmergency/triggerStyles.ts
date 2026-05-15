import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

/** Shared styles for the redesigned Bio / Time trigger panels. */
const triggerStyles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: semanticColors.primary,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 19.5,
    color: '#3D5470',
  },
  warning: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: semanticColors.danger,
  },
  recommendation: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: semanticColors.danger,
  },
  frequencyLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
    marginTop: 4,
  },
  row: {
    minHeight: 48,
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
    fontSize: 14,
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
    fontSize: 12,
  },
});

export default triggerStyles;
