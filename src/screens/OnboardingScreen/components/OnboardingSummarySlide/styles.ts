import {Dimensions, StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  margin20: {
    marginTop: 20,
    textAlign: 'center',
  },
  slideImageContainer: {
    width: '100%',
    maxHeight: '50%',
    flex: 1,
  },
  slideImage: {
    width: screenWidth - 100,
    flex: 1,
    alignSelf: 'center',
  },
  margin40: {
    marginTop: 40,
  },
  buttonsBox: {
    alignItems: 'center',
    marginVertical: 40,
  },
  buttonSignUp: {
    marginTop: 20,
    backgroundColor: colors.blue[700],
  },
  buttonLogin: {
    marginTop: 10,
    backgroundColor: colors.sea[600],
  },
});

export default styles;
