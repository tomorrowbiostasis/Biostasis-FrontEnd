import type {TextStyle} from 'react-native';

/**
 * Typography scale sourced from the Figma redesign (DM Sans primary, Courier New mono,
 * DM Serif Display for display). Uses PostScript-style font names so styles work in
 * raw StyleSheet AND through Native Base's fontConfig (see `fonts.ts`).
 */

export const typography: Record<
  | 'display'
  | 'displayLg'
  | 'bodyLg'
  | 'body'
  | 'bodyMedium'
  | 'bodySemibold'
  | 'caption'
  | 'captionMedium'
  | 'captionSemibold'
  | 'captionBold'
  | 'captionUnderline'
  | 'mono',
  TextStyle
> = {
  display: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 28,
    lineHeight: 36,
  },
  displayLg: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 40,
  },
  bodyLg: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0,
  },
  bodySemibold: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
  },
  captionMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
  },
  captionSemibold: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0.88,
  },
  captionBold: {
    fontFamily: 'DMSans-Bold',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0.88,
  },
  captionUnderline: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    lineHeight: 15.4,
    letterSpacing: 0,
    textDecorationLine: 'underline',
  },
  mono: {
    fontFamily: 'Courier New',
    fontSize: 13,
    lineHeight: 19.5,
  },
};

export const fontFamilies = {
  sans: 'DMSans-Regular',
  sansMedium: 'DMSans-Medium',
  sansSemibold: 'DMSans-SemiBold',
  sansBold: 'DMSans-Bold',
  serif: 'DMSerifDisplay-Regular',
  mono: 'Courier New',
} as const;

export type TypographyToken = keyof typeof typography;

export default typography;
