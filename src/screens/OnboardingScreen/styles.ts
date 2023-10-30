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
  paginationDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.blue[700],
    opacity: 0.5,
  },
  activePaginationDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.blue[700],
  },
  alreadyUserBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logInBox: {
    margin: 10,
  },
  logInText: {
    color: colors.blue[800],
    fontWeight: '600',
  },
});

export default styles;
