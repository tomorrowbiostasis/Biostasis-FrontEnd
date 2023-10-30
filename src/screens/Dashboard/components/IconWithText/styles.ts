import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';

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
    color: colors.black,
    fontSize: 14,
    fontFamily: fontConfig.Poppins[700].normal,
  },
});

export default styles;
