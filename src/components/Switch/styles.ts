import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  checkIcon: {
    marginLeft: 6,
  },
  plusIcon: {
    transform: [{rotate: '45deg'}],
    marginLeft: 6,
  },
  thumbStyle: {
    width: 18,
    height: 18,
    borderRadius: 24,
    left: 2,
    position: 'absolute',
    backgroundColor: colors.white,
  },
  thumbStyleInActive: {
    backgroundColor: colors.gray[300],
  },
  containerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
});

export default styles;
