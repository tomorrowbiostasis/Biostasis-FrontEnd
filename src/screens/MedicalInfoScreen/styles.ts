import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const height = 80;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  container: {
    padding: 20,
  },
  inputWrapper: {
    marginVertical: 10,
    height: height,
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: colors.blue[600],
    borderColor: colors.gray[200],
  },
  textDescription: {
    color: colors.gray[400],
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    maxWidth: '80%',
    height: height,
    alignItems: 'center',
  },
  switchButton: {
    marginRight: 30,
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
});

export default styles;
