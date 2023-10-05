import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';

export const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  panelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelBody: {
    marginVertical: 10,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  lineStyle: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
    paddingTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  activeButton: {
    flex: 1,
    padding: 5,
    borderRadius: 15,
    backgroundColor: colors.blue[400],
    ...boxShadow,
  },
  isActive: {
    backgroundColor: colors.green[75],
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  // buttonIcon: {
  //   width: 24,
  //   height: 24,
  //   marginRight: 15,
  //   padding: 5,
  //   borderRadius: 20,
  //   backgroundColor: colors.gray[50],
  // },
});
