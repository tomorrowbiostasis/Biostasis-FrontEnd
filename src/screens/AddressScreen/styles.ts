import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  safeTop: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: spacing['3xl'],
  },
  eyebrow: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    letterSpacing: 1.5,
    color: semanticColors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 28,
    lineHeight: 34,
    color: semanticColors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: semanticColors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  locationPill: {
    height: 44,
    borderRadius: 14,
    backgroundColor: semanticColors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: spacing['2xl'],
  },
  locationPillText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: semanticColors.info,
    marginLeft: spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  rowCityCol: {
    flex: 7,
    marginRight: spacing.md,
  },
  rowZipCol: {
    flex: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButton: {
    flex: 1,
  },
  backChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
});

export default styles;
