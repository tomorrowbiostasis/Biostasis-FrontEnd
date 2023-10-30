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
  Poppins: {
    100: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    200: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    300: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    400: {
      normal: 'Poppins-Regular',
      italic: 'Poppins-Italic',
    },
    500: {
      normal: 'Poppins-Medium',
    },
    600: {
      normal: 'Poppins-Medium',
      italic: 'Poppins-MediumItalic',
    },
    700: {
      normal: 'Poppins-Bold',
      italic: 'Poppins-BoldItalic',
    },
    800: {
      normal: 'Poppins-Bold',
      italic: 'Poppins-BoldItalic',
    },
    900: {
      normal: 'Poppins-Black',
      italic: 'Poppins-BlackItalic',
    },
  },
};

export const fonts: ITheme['fonts'] = {
  body: 'Poppins',
  heading: 'Roboto',
  mono: 'Poppins',
};
