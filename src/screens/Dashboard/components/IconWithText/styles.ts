import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';
import { globalTextStyles } from '~/theme/globalTextStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  icon: {
    borderRadius: 12,
    padding: 2,
    //shadow iOS
    ...boxShadow,
    shadowColor: colors.gray[300],
  },
  textContainer: {
    width: '70%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  linkTitle: {
    ...globalTextStyles.titleMedium,
    color: colors.black,
    fontFamily: fontConfig.Poppins[700].normal,
  },
  linkText: {
    ...globalTextStyles.textMedium,
  },
});

export default styles;
