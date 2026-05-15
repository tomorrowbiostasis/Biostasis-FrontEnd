import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    paddingTop: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthLabel: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: semanticColors.primary,
  },
  monthLabelChevron: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    color: semanticColors.info,
    marginLeft: spacing.xs,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navGlyph: {
    fontSize: 22,
    lineHeight: 24,
    color: semanticColors.info,
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  dowLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    letterSpacing: 0.6,
    color: semanticColors.textMuted,
  },
  dayRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    backgroundColor: 'rgba(45, 107, 228, 0.12)',
  },
  daySelected: {
    backgroundColor: semanticColors.info,
  },
  dayText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: semanticColors.primary,
  },
  dayTextDisabled: {
    color: semanticColors.textDisabled,
  },
  dayTextToday: {
    color: semanticColors.info,
    fontFamily: 'DMSans-Bold',
  },
  dayTextSelected: {
    color: semanticColors.surface,
    fontFamily: 'DMSans-Bold',
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  yearCell: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    color: semanticColors.primary,
  },
  yearTextDisabled: {
    color: semanticColors.textDisabled,
    opacity: 0.5,
  },
  yearTextSelected: {
    fontFamily: 'DMSans-Bold',
    color: semanticColors.info,
  },
});

export default styles;
