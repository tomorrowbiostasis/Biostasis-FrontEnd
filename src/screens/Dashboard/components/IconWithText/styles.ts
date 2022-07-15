import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
  linkTitle: {
    color: colors.gray['800'],
  },
  linkDescription: {
    color: colors.gray['400'],
  },
});

export default styles;
