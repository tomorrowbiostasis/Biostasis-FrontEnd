import {Dimensions, StyleSheet} from 'react-native';
import colors from '~/theme/colors';

const screenHeight = Dimensions.get('window').height;
const isSmall = screenHeight < 700;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: isSmall ? 12 : 20,
    paddingBottom: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginRight: 36,
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  startLabel: {
    color: '#4CAF50',
  },
  endLabel: {
    color: colors.blue[700],
  },
  panel: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderRadius: 16,
  },
  startPanel: {
    borderColor: '#C8E6C9',
    backgroundColor: '#FAFFF9',
  },
  endPanel: {
    borderColor: colors.blue[300],
    backgroundColor: '#F8FBFF',
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginTop: 8,
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  timePickerValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginLeft: 12,
  },
  timePickerPlaceholder: {
    color: colors.gray[400],
    fontWeight: '400',
  },
  buttonRow: {
    paddingHorizontal: 4,
    marginTop: isSmall ? 8 : 16,
  },
  saveButton: {
    backgroundColor: colors.blue[700],
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: colors.gray[600],
    fontSize: 15,
    fontWeight: '600',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default styles;
