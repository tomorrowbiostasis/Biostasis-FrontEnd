import {Dimensions, StyleSheet} from 'react-native';
import { globalTextStyles } from '~/theme/globalTextStyles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  slideImageContainer: {
    width: '100%',
    maxHeight: '60%',
    flex: 1,
  },
  slideImage: {
    width: screenWidth - 120,
    flex: 1,
    alignSelf: 'center',
  },
  margin20: {
    marginTop: 20,
    textAlign: 'center',
  },
  infoText: {
    ...globalTextStyles.textMedium,
  },
});

export default styles;
