import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  contentContainer: {
    paddingTop: 80,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  panelHeader: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  panelBody: {
    flex: 1,
    marginTop: 10,
  },
  panelFooter: {
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  footerText: {
    fontSize: 12,
    color: colors.blue[800],
  },
  lineStyle: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
  },
  icon: {
    marginRight: 10,
  },
});

export default styles;
