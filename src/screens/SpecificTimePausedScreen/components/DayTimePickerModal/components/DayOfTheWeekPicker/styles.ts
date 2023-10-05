import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    backgroundColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 40,
    height: 40,
  },
  itemActive: {
    backgroundColor: colors.blue[600],
  },
  itemInactiveText: {
    color: 'black',
  },
  itemActiveText: {
    color: 'white',
  },
});

export default styles;
