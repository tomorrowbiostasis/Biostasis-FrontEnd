import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    backgroundColor: semanticColors.surfaceCanvas,
    justifyContent: 'center',
  },
  placeholder: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
});

export default styles;
