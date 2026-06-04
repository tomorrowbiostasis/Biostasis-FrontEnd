import {StyleSheet} from 'react-native';
import {layout, semanticColors} from '~/theme/tokens';

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
    paddingTop: 18,
  },
  contentInner: {
    gap: 18,
  },
});

export default styles;
