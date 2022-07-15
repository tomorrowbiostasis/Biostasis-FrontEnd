import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';

const styles = StyleSheet.create({
  counter: {
    color: colors.white,
    fontFamily: fontConfig.Roboto['700'].normal,
    fontWeight: '700',
  },
  title: {
    color: colors.white,
    fontFamily: fontConfig.Roboto['700'].normal,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.white,
    fontFamily: fontConfig.Roboto['400'].normal,
    fontWeight: '400',
  },
  whiteButton: {backgroundColor: colors.white},
});

export default styles;
