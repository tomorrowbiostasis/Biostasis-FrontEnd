import {StyleSheet} from 'react-native';
import {semanticColors, spacing} from '~/theme/tokens';

const RING_OUTER = 146;
const RING_INNER = 114;
const LOGO_CENTER = 82;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoArea: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBlock: {
    alignItems: 'center',
  },
  ringOuter: {
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 122, 0.2)',
    backgroundColor: 'rgba(13, 185, 122, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: RING_INNER,
    height: RING_INNER,
    borderRadius: RING_INNER / 2,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 122, 0.28)',
    backgroundColor: 'rgba(13, 185, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCenter: {
    width: LOGO_CENTER,
    height: LOGO_CENTER,
    borderRadius: LOGO_CENTER / 2,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 122, 0.5)',
    backgroundColor: 'rgba(13, 185, 122, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoWrap: {
    marginTop: spacing.lg,
    height: 24,
    justifyContent: 'center',
  },
  brandLogoColor: {
    color: semanticColors.success,
  },
  titleArea: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: 32,
    color: semanticColors.textInverse,
    textAlign: 'center',
  },
  titleAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
