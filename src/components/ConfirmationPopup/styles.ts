import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  confirmationPopupWrapper: {
    borderRadius: 20,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.gray[50],
    borderWidth: 2,
    borderColor: colors.gray[200],
    paddingHorizontal: '5%',
  },
  confirmationPopupLabel: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 16,
  },
  space: {
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: colors.red[600],
  },
});

export default styles;
