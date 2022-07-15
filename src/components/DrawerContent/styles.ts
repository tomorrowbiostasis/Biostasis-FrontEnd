import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray['642'],
  },
  textWithIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
