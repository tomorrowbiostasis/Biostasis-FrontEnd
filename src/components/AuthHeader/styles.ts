import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  inner: {
    paddingHorizontal: 34,
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
  backGlyph: {
    fontFamily: 'DMSans-Regular',
    fontSize: 18,
    color: '#BFC2C5',
    lineHeight: 20,
  },
  eyebrow: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 40,
    color: '#F1F3F6',
    marginTop: spacing.xs,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#F1F3F6',
    marginTop: 6,
    minHeight: 48,
  },
});

export default styles;
