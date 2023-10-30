import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[800],
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 12,
    marginLeft: 15,
    textAlign: 'center',
    color: colors.white,
    fontFamily: fontConfig.Poppins[400].normal,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    padding: 10,
  },
  activeMenuItem: {
    width: '100%',
    backgroundColor: colors.magenta[400],
    borderRadius: 20,
  },
  activeMenuText: {
    color: colors.white,
    fontWeight: 'bold',
  },
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
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoutText: {
    fontWeight: 'bold',
    marginLeft: 5,
    textAlign: 'center',
    color: colors.red[400],
  },
});

export default styles;
