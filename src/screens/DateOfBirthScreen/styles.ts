import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  submitButton: {
    marginTop: 20,
  },
  inputContainer: {
    height: 60,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  panelHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  panelBody: {
    flex: 1,
    width: '100%',
    marginVertical: 40,
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
});

export default styles;
