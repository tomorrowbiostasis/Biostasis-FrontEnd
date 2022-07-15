import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {addOpacity} from '~/theme/utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: addOpacity(colors.gray['375'], 48),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 23,
  },
  disabled: {
    opacity: 0.5,
  },
  bottomBorder: {
    borderBottomWidth: 1,
  },
  title: {
    marginLeft: 23,
    marginHorizontal: 10,
    flex: 1,
  },
});

export default styles;
