import { StyleSheet } from 'react-native';
import colors from '~/theme/colors';
import { globalTextStyles } from '~/theme/globalTextStyles';

const styles = StyleSheet.create({
  container: {
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
  logEntry: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  lineSeparator: {
    width: '100%',
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default styles;
