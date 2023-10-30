import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
  },
  panelFooter: {
    width: '100%',
  },
  bottomContent: {
    width: '100%',
  },
  infoText: {
    color: colors.red[200],
    paddingBottom: 2,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

export default styles;
