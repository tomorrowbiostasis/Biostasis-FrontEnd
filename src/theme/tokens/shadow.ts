import type {ViewStyle} from 'react-native';

export const shadow: Record<'none' | 'sm' | 'md' | 'lg', ViewStyle> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0D1B2E',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0D1B2E',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0D1B2E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

export type ShadowToken = keyof typeof shadow;

export default shadow;
