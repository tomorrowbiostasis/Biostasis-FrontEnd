import {StyleSheet} from 'react-native';
import {layout, semanticColors, spacing, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  inner: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  topRowEnd: {
    justifyContent: 'flex-end',
    minHeight: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    borderColor: '#BFC2C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },
  title: {
    ...typography.displayLg,
    color: '#F1F3F6',
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.authSubtitle,
    color: '#F1F3F6',
    marginTop: 6,
    minHeight: 44,
  },
});

export default styles;
