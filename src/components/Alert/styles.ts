import {StyleSheet} from 'react-native';
import {radius, semanticColors, shadow, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xl,
    ...shadow.sm,
  },
  success: {
    backgroundColor: semanticColors.successSurface,
    borderColor: semanticColors.success,
  },
  error: {
    backgroundColor: semanticColors.dangerSurface,
    borderColor: semanticColors.danger,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconChip: {
    width: 30,
    height: 30,
    borderRadius: radius.md,
    backgroundColor: semanticColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: {
    flex: 1,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    lineHeight: 19,
    color: semanticColors.textPrimary,
  },
});

export default styles;
