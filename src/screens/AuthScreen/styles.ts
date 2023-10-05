import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {isIOS} from '~/utils';

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContainer: {
    marginVertical: 30,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.gray[200],
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTab: {
    color: colors.black,
    borderBottomColor: colors.black,
    backgroundColor: isIOS ? colors.gray[100] : colors.white,
    borderBottomWidth: 1,
  },
  panel: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 20,
    padding: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
  },
  panelBody: {
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default styles;
