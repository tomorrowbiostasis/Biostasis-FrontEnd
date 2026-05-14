/**
 * Semantic color aliases sourced from the Figma redesign (frames 404:32740, 404:32835).
 * These map to NEW Figma values, not the existing literal palette in `colors.ts`.
 *
 * Consumed by NEW primitives and new variants of existing primitives. Legacy screens
 * keep using the literal palette until they migrate group-by-group.
 */

export const semanticColors = {
  primary: '#0B1F3A',
  primaryAccent: '#2B6E99',
  primaryPressed: '#0D1B2E',
  primaryDisabled: '#9BA8B5',

  surface: '#FFFFFF',
  surfaceMuted: '#EEF0F3',
  surfaceSubtle: '#F2F3F5',
  surfaceAlt: '#EAF0F5',

  border: '#E2E6EA',
  borderStrong: '#C4C9D0',

  textPrimary: '#0D1B2E',
  textSecondary: '#5A6A7E',
  textMuted: '#6B7A8E',
  textDisabled: '#9BA8B5',
  textInverse: '#FFFFFF',

  danger: '#E5373A',
  dangerStrong: '#D6455D',
  dangerSurface: '#FFF0F0',

  warning: '#F5A623',
  warningStrong: '#D4820A',
  warningSurface: '#FFF8EC',

  success: '#1E9B6B',
  successSurface: '#D4EFEA',

  info: '#2D6BE4',
  infoSurface: '#EAF0F5',

  overlay: 'rgba(0, 0, 0, 0.2)',
} as const;

export type SemanticColor = keyof typeof semanticColors;

export default semanticColors;
