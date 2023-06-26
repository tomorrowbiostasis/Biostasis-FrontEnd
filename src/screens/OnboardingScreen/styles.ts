import {Dimensions, StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flexGrow: 1,
  },
  slideImage: {
    width: screenWidth - 120,
    alignSelf: 'center',
  },
  slide1Image: {
    marginTop: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});

export default styles;
