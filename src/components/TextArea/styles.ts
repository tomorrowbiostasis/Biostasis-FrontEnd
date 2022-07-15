import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {fontConfig} from '~/theme/fonts';
import {addOpacity} from '~/theme/utils';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    flexDirection: 'row',
  },
  titleText: {
    letterSpacing: 0.12,
    color: addOpacity(colors.gray[800], 80),
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    height: 110,
    textAlignVertical: 'top',
    fontSize: 18,
    fontFamily: fontConfig.Roboto[400].normal,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.gray[800],
    paddingBottom: 10,
    marginBottom: 0,
    paddingRight: 10,
  },
  validCheckMarkContainer: {
    width: 22,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  errorMessage: {
    marginTop: 0,
    marginLeft: 3,
  },
});
export default styles;
