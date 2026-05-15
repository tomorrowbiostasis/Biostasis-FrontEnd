import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {globalTextStyles} from '~/theme/globalTextStyles';

/**
 * Local styles for SmartDetectionPanel. This panel is not currently rendered
 * by AutomatedEmergencySettingsScreen (no Figma frame for it); kept compiling
 * with the pre-redesign look until it gets a design pass.
 */
const styles = StyleSheet.create({
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
    ...globalTextStyles.textMedium,
  },
  panelBody: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 4,
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
  circle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.gray[50],
  },
  switchButton: {
    marginTop: 8,
    alignItems: 'center',
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
  buttonText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500',
  },
});

export default styles;
