import {Dimensions, StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {addOpacity} from '~/theme/utils';

const screenHeight = Dimensions.get('window').height;
const isSmall = screenHeight < 700;
const buttonsMargin = isSmall ? '2%' : '5%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    flex: isSmall ? undefined : 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  safeAreaContainer: {
    flexGrow: 1,
  },
  panel: {
    paddingVertical: '6%',
    marginVertical: '2%',
    borderColor: colors.blue[200],
    borderWidth: 2,
    paddingHorizontal: '5%',
    borderRadius: 10,
    backgroundColor: addOpacity(colors.blue[200], 20),
  },
  saveButton: {
    marginTop: buttonsMargin,
  },
  cancelButton: {
    marginTop: buttonsMargin,
    marginBottom: buttonsMargin,
  },
  label: {
    color: colors.gray[800],
    opacity: 0.8,
    fontSize: 14,
  },
});

export default styles;
