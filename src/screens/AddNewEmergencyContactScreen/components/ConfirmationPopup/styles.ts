import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  confirmationPopupWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 280,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.red[100],
    paddingHorizontal: '10%',
  },
  confirmationPopupLabel: {
    color: colors.white,
    textAlign: 'left',
  },
  space: {
    marginVertical: 15,
  },
  deleteButton: {
    backgroundColor: colors.white,
  },
});

export default styles;
