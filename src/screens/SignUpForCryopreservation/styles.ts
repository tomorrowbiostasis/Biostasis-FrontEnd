import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  container: {
    padding: 0,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
});

export default styles;
