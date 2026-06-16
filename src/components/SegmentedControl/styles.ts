import {Platform, StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

export const SEGMENTED_CONTROL_PADDING = 4;
const SEGMENTED_CONTROL_HEIGHT = 51;
const INDICATOR_HEIGHT = SEGMENTED_CONTROL_HEIGHT - SEGMENTED_CONTROL_PADDING * 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ECEEF2',
    borderRadius: 15,
    padding: SEGMENTED_CONTROL_PADDING,
    height: SEGMENTED_CONTROL_HEIGHT,
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
    left: SEGMENTED_CONTROL_PADDING,
    height: INDICATOR_HEIGHT,
    borderRadius: 14,
    backgroundColor: semanticColors.surface,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(11, 31, 58, 0.1)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 2.5,
      },
      android: {
        borderWidth: 1,
        borderColor: 'rgba(11, 31, 58, 0.06)',
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
