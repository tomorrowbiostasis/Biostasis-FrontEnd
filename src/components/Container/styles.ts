import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {height} from '~/theme/utils/dimensions';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.gray[200],
  },
  header: {
    marginHorizontal: 20,
    marginVertical: height > 800 ? 10 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: colors.white,
    padding: 30,
    paddingBottom: 15,
    marginTop: 5,
    width: '100%',
    flex: 1,
    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    //shadow iOS
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    //shadow android
    elevation: 10,
  },
  contentContainerTransparent: {
    backgroundColor: 'transparent',
    paddingBottom: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.gray[100],
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
