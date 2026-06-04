import {Platform, StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

export const SEGMENTED_CONTROL_PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ECEEF2',
    borderRadius: 15,
    padding: SEGMENTED_CONTROL_PADDING,
    height: 51,
    alignSelf: 'stretch',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  indicator: {
    position: 'absolute',
    top: SEGMENTED_CONTROL_PADDING,
    bottom: SEGMENTED_CONTROL_PADDING,
    left: SEGMENTED_CONTROL_PADDING,
    borderRadius: 12,
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
