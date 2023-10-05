import {StyleSheet} from 'react-native';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 80,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  curveElement: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
    height: 50,
    backgroundColor: colors.gray[50],
    width: '100%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  panel: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    ...boxShadow,
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
  listContentContainer: {
    flexGrow: 1,
  },
});

export default styles;
