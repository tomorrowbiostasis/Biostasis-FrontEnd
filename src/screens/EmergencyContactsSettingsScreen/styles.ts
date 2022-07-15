import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  headerText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[400],
    marginBottom: 5,
  },
  switchButton: {
    marginTop: 10,
  },
  includeInfoHeaderText: {
    marginTop: 25,
  },
  messageAreaContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default styles;
