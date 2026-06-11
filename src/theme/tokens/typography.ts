import type {TextStyle} from 'react-native';

/**
 * Typography scale sourced from the Figma redesign (DM Sans primary, Courier New mono,
 * DM Serif Display for display). Uses PostScript-style font names so styles work in
 * raw StyleSheet AND through Native Base's fontConfig (see `fonts.ts`).
 */

export const typography: Record<
  | 'display'
  | 'displayLg'
  | 'authSubtitle'
  | 'bodyLg'
  | 'body'
  | 'bodyMedium'
  | 'bodySemibold'
  | 'caption'
  | 'captionMedium'
  | 'captionSemibold'
  | 'captionBold'
  | 'captionUnderline'
  | 'statusTag'
  | 'statusTagSmall'
  | 'sectionLabel'
  | 'sectionDescription'
  | 'rowTitle'
  | 'rowDescription'
  | 'rowDescriptionMedium'
  | 'input'
  | 'counter'
  | 'buttonLabel'
  | 'buttonLabelCompact'
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
  authSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySemibold: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0,
  },
  captionMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0,
  },
  captionSemibold: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.88,
  },
  captionBold: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.88,
  },
  captionUnderline: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    lineHeight: 15.4,
    letterSpacing: 0,
    textDecorationLine: 'underline',
  },
  statusTag: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0,
  },
  statusTagSmall: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  sectionLabel: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  rowTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  rowDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
  },
  rowDescriptionMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
  },
  input: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: 0,
  },
  counter: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  buttonLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  buttonLabelCompact: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: 0,
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
