import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  panel: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  panelBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  panelFooter: {
    width: '100%',
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  lineStyle: {
    width: '95%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1,
    height: 1,
  },
  emergencyButton: {
    backgroundColor: colors.red[400],
    borderColor: colors.red[400],
    marginTop: 10,
  },
});

export default styles;
