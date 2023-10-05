/* eslint-disable no-shadow */
import {LayoutAnimationConfig} from 'react-native';

export const firstCountdownTime = 1000 * 9;
export const secondCountdownTime = 1000 * 5;

export enum animationStatuses {
  ANIMATION_OFF,
  ANIMATION_PRESSED,
  ANIMATION_PRESS_3,
  ANIMATION_PRESS_2,
  ANIMATION_PRESS_1,
  ANIMATION_COUNTDOWN,
  ANIMATION_PRESS_2_5,
}

export enum infoStatuses {
  INFO_OFF,
  INFO_PENDING,
  INFO_SUCCEEDED,
  INFO_FAILED,
  INFO_CANCELED,
}

const commonStyle = {
  roundedTopCorners: true,
  roundedBottomCorners: false,
  marginHorizontal: 0,
};

export const animationStyles = {
  [animationStatuses.ANIMATION_OFF]: {
    roundedTopCorners: true,
    roundedBottomCorners: true,
    marginHorizontal: 12,
    marginTop: '80%',
    paddingBottom: '5%',
  },
  [animationStatuses.ANIMATION_PRESSED]: {
    ...commonStyle,
    marginTop: '80%',
    paddingBottom: '5%',
  },
  [animationStatuses.ANIMATION_PRESS_2_5]: {
    ...commonStyle,
    marginTop: '15%',
    paddingBottom: '20%',
  },
  [animationStatuses.ANIMATION_PRESS_3]: {
    ...commonStyle,
    marginTop: '40%',
    paddingBottom: '20%',
  },
  [animationStatuses.ANIMATION_PRESS_2]: {
    ...commonStyle,
    marginTop: '20%',
    paddingBottom: '20%',
  },
  [animationStatuses.ANIMATION_PRESS_1]: {
    ...commonStyle,
    marginTop: '10%',
    paddingBottom: '20%',
  },
  [animationStatuses.ANIMATION_COUNTDOWN]: {
    roundedTopCorners: false,
    roundedBottomCorners: false,
    marginHorizontal: 0,
    marginTop: '0%',
    paddingBottom: '5%',
  },
};

export const infoComponentGradients: {[key: string]: string} = {
  green: 'rgba(0, 100, 0, 0.5)',
  black: 'rgba(0, 0, 0, 0.5)',
  red: 'rgba(210, 43, 43, 0.5)',
};

export const animationConfig: LayoutAnimationConfig = {
  duration: 150,
  create: {
    type: 'easeOut',
    property: 'scaleXY',
  },
  update: {
    type: 'easeOut',
    property: 'scaleXY',
  },
  delete: {
    type: 'easeOut',
    property: 'scaleXY',
  },
};
