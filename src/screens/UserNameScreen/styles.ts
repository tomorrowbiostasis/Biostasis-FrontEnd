import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  text: {
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  space: {
    marginBottom: 20,
    marginTop: 20,
  },
  submitButton: {
    marginTop: 40,
  },
  content: {
    marginBottom: 3,
    justifyContent: 'flex-end',
    flex: 1,
    paddingHorizontal: '10%',
    width: '100%',
  },
  container: {
    padding: 20,
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
    width: '100%',
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
  lineStyle: {
    flex: 1,
    width: '95%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 2,
    height: 2,
  },
  icon: {
    marginRight: 10,
  },
});

export default styles;
