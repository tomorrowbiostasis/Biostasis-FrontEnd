import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  topContentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 24,
  },
  connectedDevice: {
    marginTop: 15,
    marginBottom: 10,
  },
  buttonsContainer: {
    marginTop: 40,
  },
  warningText: {
    color: colors.red[200],
    lineHeight: 20,
  },
  descriptionText: {
    color: colors.gray[400],
    marginTop: 10,
    lineHeight: 20,
  },
  switchButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  indented: {
    borderLeftWidth: 2,
    borderLeftColor: colors.gray['300'],
    marginLeft: 8,
    paddingLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    color: colors.gray['700'],
    lineHeight: 16,
    marginBottom: 8,
  },
  expandableSectionWrapper: {
    flexDirection: 'row',
  },
  expandIconWrapper: {
    flex: 0.2,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 3,
  },
  noneDisplay: {
    display: 'none',
  },
  underline: {textDecorationLine: 'underline'},
});

export default styles;
