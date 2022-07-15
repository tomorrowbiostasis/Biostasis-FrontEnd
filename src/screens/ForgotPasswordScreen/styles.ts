import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.gray[650],
    lineHeight: 27,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  button: {
    marginTop: 80,
  },
});
export default styles;
