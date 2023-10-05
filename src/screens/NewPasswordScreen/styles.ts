import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  containerContent: {
    justifyContent: 'center',
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-evenly',
  },
  panelHeader: {
    alignSelf: 'center',
  },
  panelBody: {
    flex: 1,
    marginVertical: 10,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  button: {
    marginTop: 20,
  },
  passwordInput: {
    marginTop: 30,
  },
  confirmPasswordInput: {
    marginTop: 20,
  },
});

export default styles;
