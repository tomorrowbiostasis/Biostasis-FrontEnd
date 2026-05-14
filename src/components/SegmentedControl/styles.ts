import {Platform, StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ECEEF2',
    borderRadius: 15,
    padding: 4,
    height: 51,
    alignSelf: 'stretch',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: semanticColors.surface,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(11, 31, 58, 0.1)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: '#5A6A7E',
  },
  labelActive: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.primary,
  },
});

export default styles;
