import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 29,
  },
  group: {
    gap: 10,
  },
  footer: {
    paddingHorizontal: 34,
    paddingTop: 8,
  },
  logoutButton: {
    height: 44,
    borderRadius: 14,
    backgroundColor: semanticColors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.textInverse,
  },
});

export default styles;
