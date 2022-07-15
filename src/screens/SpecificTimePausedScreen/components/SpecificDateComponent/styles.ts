import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    zIndex: 3, // works on ios
    elevation: 3, // works on android
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  containerItem: {
    justifyContent: 'center',
  },
  containerSwitch: {
    flex: 1,
    paddingRight: 5,
  },
  containerDays: {
    flex: 3,
    paddingLeft: 5,
  },
  containerTime: {
    flex: 2,
    alignItems: 'center',
  },
  containerEdit: {
    flex: 1,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  textOpacity: {
    color: colors.gray[400],
    fontSize: 14,
    flex: 1,
  },
  text: {
    flex: 2,
  },
  containerTrash: {
    flex: 1,
    alignItems: 'flex-end',
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
