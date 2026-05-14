import {StyleSheet} from 'react-native';
import {radius, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: spacing.xxs,
    alignSelf: 'stretch',
  },
  containerLight: {
    backgroundColor: semanticColors.surfaceMuted,
  },
  containerDark: {
    backgroundColor: semanticColors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  tabActiveLight: {
    backgroundColor: semanticColors.surface,
  },
  tabActiveDark: {
    backgroundColor: semanticColors.surface,
  },
  label: {
    ...typography.bodySemibold,
  },
  labelActive: {
    color: semanticColors.textPrimary,
  },
  labelInactive: {
    color: semanticColors.textMuted,
  },
});

export default styles;
