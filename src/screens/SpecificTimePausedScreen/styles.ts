import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  container: {
    paddingTop: 0,
  },
  content: {
    paddingHorizontal: '10%',
    flex: 1,
  },
  bottomContent: {
    width: '100%',
  },
  infoText: {
    color: colors.red[200],
    paddingBottom: 2,
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default styles;
