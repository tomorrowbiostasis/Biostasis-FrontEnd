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
  contentContainer: {
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
    fontWeight: '700',
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
    borderWidth: 2,
    paddingHorizontal: '5%',
    borderRadius: 20,
    borderColor: colors.gray[300],
    backgroundColor: addOpacity(colors.blue[300], 20),
  },
  saveButton: {
    backgroundColor: colors.blue[600],
    borderColor: colors.gray[200],
    marginTop: buttonsMargin,
  },
  cancelButton: {
    marginTop: buttonsMargin,
    marginBottom: buttonsMargin,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default styles;
