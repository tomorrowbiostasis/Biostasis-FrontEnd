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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonWrap: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});

export default styles;
