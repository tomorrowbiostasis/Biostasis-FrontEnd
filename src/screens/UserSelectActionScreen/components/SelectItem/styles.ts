import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 10,
  },
  icon: {
    width: 33,
    height: 33,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    lineHeight: 24,
    marginRight: 25,
  },
  descriptionText: {
    marginTop: 5,
    lineHeight: 20,
    color: colors.gray[400],
  },
  radioButton: {
    marginTop: 11,
  },
});

export default styles;
