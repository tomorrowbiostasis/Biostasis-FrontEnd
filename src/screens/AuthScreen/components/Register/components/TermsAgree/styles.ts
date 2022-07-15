import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 43,
  },
  termsAgreement: {
    marginLeft: 9,
    flex: 1,
    flexDirection: 'row',
  },
  termsAgreementText: {
    flex: 1,
    color: colors.gray[400],
    fontSize: 14,
    fontWeight: '400',
  },
});
export default styles;
