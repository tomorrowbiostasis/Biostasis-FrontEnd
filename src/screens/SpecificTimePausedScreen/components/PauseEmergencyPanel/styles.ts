import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import { globalTextStyles } from '~/theme/globalTextStyles';

export const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...boxShadow,
  },
  panelHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelBody: {
    marginVertical: 10,
  },
  panelFooter: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  panelTitle :{
    ...globalTextStyles.titleMedium,
  },
  panelInfoText :{
    ...globalTextStyles.textMedium,
  },
  lineStyle: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
    paddingTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  activeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.blue[700],
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  pausedStatusContainer: {
    width: '100%',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  pausedStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pausedStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57F17',
    marginLeft: 8,
  },
  pausedUntilText: {
    fontSize: 13,
    color: colors.gray[800],
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 18,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.red[200],
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.red[400],
    marginLeft: 4,
  },
});
