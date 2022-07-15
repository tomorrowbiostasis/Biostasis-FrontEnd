import {ITheme} from 'native-base';

export const fontConfig = {
  Roboto: {
    100: {
      normal: 'Roboto-Light',
      italic: 'Roboto-LightItalic',
    },
    200: {
      normal: 'Roboto-Light',
      italic: 'Roboto-LightItalic',
    },
    300: {
      normal: 'Roboto-Light',
      italic: 'Roboto-LightItalic',
    },
    400: {
      normal: 'Roboto-Regular',
      italic: 'Roboto-Italic',
    },
    500: {
      normal: 'Roboto-Medium',
    },
    600: {
      normal: 'Roboto-Medium',
      italic: 'Roboto-MediumItalic',
    },
    700: {
      normal: 'Roboto-Bold',
      italic: 'Roboto-BoldItalic',
    },
    800: {
      normal: 'Roboto-Bold',
      italic: 'Roboto-BoldItalic',
    },
    900: {
      normal: 'Roboto-Black',
      italic: 'Roboto-BlackItalic',
    },
  },
};

export const fonts: ITheme['fonts'] = {
  body: 'Roboto',
  heading: 'Roboto',
  mono: 'Roboto',
};
