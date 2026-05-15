import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  body: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
});

export default styles;
