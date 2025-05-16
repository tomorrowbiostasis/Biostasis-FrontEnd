import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import { globalTextStyles } from '~/theme/globalTextStyles';

export const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-evenly',
  },
  panelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelBody: {
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  panelTitle :{
    ...globalTextStyles.titleMedium,
  },
  panelInfoText :{
    ...globalTextStyles.textMedium,
  },
  panelFooter: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  lineStyle: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
    paddingTop: 10,
  },
  lineStyleBottom: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  icon: {
    marginRight: 10,
  },
});
