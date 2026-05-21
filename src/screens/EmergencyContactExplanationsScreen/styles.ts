import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 34,
    paddingTop: 24,
    paddingBottom: 24,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
});

export default styles;
