import {StyleSheet} from 'react-native';
import {layout, semanticColors, spacing} from '~/theme/tokens';

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
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.xl,
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowCity: {
    flex: 1.6,
  },
  rowZip: {
    flex: 1,
  },
  dobBlock: {
    marginTop: spacing.xs,
  },
  dobLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    letterSpacing: 0.8,
    color: semanticColors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  dobField: {
    height: 44,
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 14,
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobValue: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    color: semanticColors.textPrimary,
  },
  dobPlaceholder: {
    color: semanticColors.textMuted,
  },
});

export default styles;
