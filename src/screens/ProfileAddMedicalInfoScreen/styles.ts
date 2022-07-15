import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const height = 80;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: '10%',
  },
  content: {
    marginBottom: 3,
    flex: 1,
    width: '100%',
  },
  inputWrapper: {
    marginVertical: 10,
    height: height,
  },
  editButtons: {
    marginTop: 10,
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
});

export default styles;
