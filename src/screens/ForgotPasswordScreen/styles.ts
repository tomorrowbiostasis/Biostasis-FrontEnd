import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  panelHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  panelBody: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
  },
  panelFooter: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  lineStyle: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
  },
  icon: {
    marginRight: 10,
  },
  description: {
    marginBottom: 10,
  },
  warning: {
    color: colors.yellow[600],
    fontWeight: '700',
    fontSize: 10,
    marginTop: 20,
    textAlign: 'center',
  },
});
export default styles;
