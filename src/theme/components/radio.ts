import colors from '../colors';
import {addOpacity} from '../utils';

const green400 = colors.green[400];

export const radioStyles = {
  baseStyle: {
    _interactionBox: {
      _focus: {
        bg: addOpacity(green400, 50),
      },
      _pressed: {
        bg: addOpacity(green400, 50),
      },
    },
    _radio: {
      _checked: {
        borderColor: green400,
      },
    },
    _icon: {
      color: green400,
    },
  },
};
