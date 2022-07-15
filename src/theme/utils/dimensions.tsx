import {Dimensions} from 'react-native';

const designHeight = 812; // screen size in figma

export const {height} = Dimensions.get('screen');

/**
 * @param value
 * The pixel value to scale
 * @param availableSpace
 * All available vertical space to fill if the calculated elements are 0px
 */
export const verticalScale = (value: number, availableSpace: number) => {
  const actuallyAvailable = height - (designHeight - availableSpace);
  // TODO , workaround for providing minimum value of paddings ,  in case there is a problem with getting proper dimensions. Check after updating RN
  if (actuallyAvailable <= 0) {
    return 15;
  }
  const howSmaller = actuallyAvailable / availableSpace;
  if (howSmaller > 1) {
    return value;
  }
  return value * howSmaller;
};
