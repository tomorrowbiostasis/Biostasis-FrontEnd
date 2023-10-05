import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: colors.white,
    borderBottomColor: colors.gray[100],
  },
  containerItem: {
    justifyContent: 'center',
  },
  containerSwitch: {
    flex: 2,
  },
  containerDays: {
    flex: 6,
    marginLeft: 10,
  },
  containerTime: {
    flex: 2,
    alignItems: 'center',
  },
  containerEdit: {
    flex: 2,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  textOpacity: {
    color: colors.gray[400],
    flex: 1,
  },
  text: {
    flex: 1,
  },
  containerTrash: {
    flex: 1,
  },
  trash: {
    backgroundColor: colors.red[200],
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
