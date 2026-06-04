import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  body: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  webview: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
});

export default styles;
