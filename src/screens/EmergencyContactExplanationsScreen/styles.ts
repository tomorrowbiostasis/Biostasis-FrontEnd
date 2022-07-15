import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {addOpacity} from '~/theme/utils';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  text: {
    color: addOpacity(colors.gray[800], 80),
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 24,
  },
});

export default styles;
