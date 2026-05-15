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
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },
});

export default styles;
