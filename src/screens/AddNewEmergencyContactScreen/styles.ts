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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 34,
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonWrap: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});

export default styles;
