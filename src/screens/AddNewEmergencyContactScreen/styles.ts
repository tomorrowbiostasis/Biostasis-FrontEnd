import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  inputWrapper: {
    marginTop: 20,
  },
  container: {
    padding: 20,
  },
  content: {
    marginBottom: 3,
    justifyContent: 'flex-end',
    flex: 1,
    paddingHorizontal: '5%',
    width: '100%',
  },
  saveButton: {
    backgroundColor: colors.blue[600],
    borderColor: colors.gray[200],
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
});

export default styles;
