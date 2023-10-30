import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    ...boxShadow,
  },
  curveElement: {
    position: 'absolute',
    zIndex: 1,
    top: 100,
    // borderWidth: 2,
    // borderColor: 'red',
    height: 50,
    backgroundColor: colors.gray[50],
    width: '100%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingTop: 10,
    paddingBottom: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
    fontFamily: fontConfig.Poppins[700].normal,
    color: colors.blueDark[200],
  },
  section: {
    flex: 1,
    width: '90%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontConfig.Poppins[600].normal,
    color: colors.blueDark[200],
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...boxShadow,
  },
  panelHeader: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  panelBody: {
    flex: 1,
    marginVertical: 10,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  message: {
    flex: 1,
    marginTop: 10,
  },
  learnMoreBox: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  learnMoreText: {
    fontSize: 10,
    color: colors.blue[800],
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  emergencyButton: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 20,
    minHeight: 80,
    width: '80%',
    backgroundColor: colors.pink[600],
  },
  activeButton: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginVertical: 5,
    marginLeft: '25%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  isActive: {
    backgroundColor: colors.green[75],
  },
  buttonText: {
    flex: 1,
    color: colors.black,
    fontWeight: '500',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    padding: 5,
    borderRadius: 20,
    backgroundColor: colors.gray[50],
  },
  emergencyCaption: {
    color: colors.white,
    fontFamily: fontConfig.Poppins[700].normal,
    fontSize: 16,
  },
  emergencySubCaption: {
    color: colors.white,
    fontFamily: fontConfig.Poppins[400].normal,
  },
});

export default styles;
