import {StyleSheet} from 'react-native';
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
  switchContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  expandableSectionWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical: 10,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  panelHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 20,
  },
  panelBody: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    padding: 10,
  },
  panelFooter: {
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
  },
  sectionBody: {
    marginVertical: 5,
  },
});

export default styles;
