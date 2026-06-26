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
    paddingHorizontal: layout.screenGutter,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 29,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  group: {
    gap: 10,
  },
  footer: {
    backgroundColor: semanticColors.surfaceCanvas,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 8,
  },
  logoutButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.ctaPaddingHorizontal,
  },
  logoutText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  disclaimerContent: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 8,
  },
  disclaimerTitle: {
    ...typography.bodyLg,
    color: semanticColors.textPrimary,
    marginBottom: 12,
  },
  disclaimerBody: {
    ...typography.body,
    color: semanticColors.textSecondary,
  },
});

export default styles;
