import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: colors.blue[600],
    borderColor: colors.gray[200],
  },
  panel: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  panelBody: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
  },
  panelFooter: {
    width: '100%',
    marginTop: 20,
  },
});

export default styles;
