import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.gray[50],
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    width: '80%',
  },
  contentContainer: {
    width: '100%',
    paddingTop: 120,
    flex: 1,
    ...boxShadow,
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
