import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 80,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  curveElement: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
    height: 50,
    backgroundColor: colors.gray[50],
    width: '100%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
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
  },
  descriptionText: {
    color: colors.gray[800],
    marginVertical: 10,
  },
  switchButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    color: colors.gray[700],
    marginBottom: 8,
    lineHeight: 20,
    fontSize: 12,
  },
  expandableSectionWrapper: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.gray[50],
    borderWidth: 0.5,
    borderColor: colors.gray[200],
  },
  expandIconWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noneDisplay: {
    display: 'none',
  },
  underline: {
    textDecorationLine: 'underline',
    color: colors.magenta[400],
  },
  manualLinkBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  manualLink: {
    color: colors.blue[800],
    fontSize: 12,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'space-evenly',
    ...boxShadow,
  },
  panelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelBody: {
    flex: 1,
    marginVertical: 10,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
  },
  triggerPanelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  instructionBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  instructionBody: {
    flex: 1,
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
  triggerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  readText: {
    fontSize: 12,
    color: colors.blue[800],
  },
  activeButton: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginVertical: 10,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  isActive: {
    backgroundColor: colors.green[75],
  },
  buttonText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    padding: 5,
    borderRadius: 20,
    backgroundColor: colors.gray[50],
  },
  settingsTouchText: {
    paddingTop: 10,
    color: colors.blue[800],
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: '600',
  },
  opacity: {
    opacity: 0.5,
    backgroundColor: colors.white,
  },
  circle: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 2,
  },
  message: {
    flex: 1,
    marginTop: 10,
  },
});

export default styles;
