import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 0,
  },
  submitButton: {
    marginTop: 10,
  },
  container: {
    padding: 20,
    width: '100%',
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  panelHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  panelBody: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
  },
  panelFooter: {
    marginVertical: 10,
  },
  lineStyle: {
    flex: 1,
    width: '95%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
  },
  icon: {
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 20,
    color: colors.magenta[200],
  },
  getLocationBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue[600],
    borderColor: colors.gray[50],
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 10,
  },
});

export default styles;
