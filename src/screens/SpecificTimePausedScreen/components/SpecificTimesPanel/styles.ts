import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {globalTextStyles} from '~/theme/globalTextStyles';

export const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
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
    marginTop: 10,
  },
  panelTitle: {
    ...globalTextStyles.titleMedium,
  },
  panelDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
    marginBottom: 4,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    backgroundColor: colors.gray[50],
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginLeft: 8,
  },
});
