import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  item: {
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    width: 42,
    height: 42,
  },
  itemActive: {
    backgroundColor: colors.blue[700],
  },
  itemInactiveText: {
    color: colors.gray[700],
    fontSize: 13,
    fontWeight: '600',
  },
  itemActiveText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default styles;
