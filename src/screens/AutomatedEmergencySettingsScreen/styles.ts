import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import { globalTextStyles } from '~/theme/globalTextStyles';

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
    paddingTop: 20,
  },
  scrollContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  curveElement: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
    height: 50,
    backgroundColor: colors.gray[50],
    // backgroundColor: 'red',
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
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    color: colors.gray[700],
    marginBottom: 8,
    lineHeight: 22,
    fontSize: 14,
  },
  howItWorksContainer: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: colors.gray[50],
    padding: 16,
  },
  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray[700],
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'space-evenly',
    ...boxShadow,
  },
  panelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelTitle: {
    ...globalTextStyles.titleMedium,
  },
  panelInfoText: {
    ...globalTextStyles.textMedium
  },
  panelBody: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 4,
  },
  triggerPanelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
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
    fontSize: 17,
    fontWeight: '600',
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.gray[50],
  },
  message: {
    flex: 1,
    marginTop: 10,
  },
});

export default styles;
