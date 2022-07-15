import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';
import {verticalScale} from '~/theme/utils/dimensions';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  container: {
    paddingTop: 0,
  },
  scrollContent: {
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.white,
    width: '100%',
    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    //shadow iOS
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  elevateMe1: {
    elevation: 10,
  },
  elevateMe2: {
    elevation: 15,
  },
  elevateMe3: {
    elevation: 20,
  },
  emergencyButton: {
    backgroundColor: colors.magenta['400'],
  },
  emergencyCaption: {
    color: colors.white,
    fontFamily: fontConfig.Roboto['700'].normal,
    fontWeight: '700',
  },
  emergencySubcaption: {
    color: colors.white,
    fontFamily: fontConfig.Roboto['400'].normal,
    fontWeight: '400',
  },
  firstButtonPadding: {
    paddingTop: verticalScale(35, 350),
    paddingBottom: verticalScale(35, 350),
  },
  secondButtonPadding: {
    paddingTop: verticalScale(30, 350),
    paddingBottom: verticalScale(35, 350),
  },
  thirdButtonPadding: {
    paddingTop: verticalScale(30, 350),
    paddingBottom: verticalScale(25, 350),
  },
});

export default styles;
