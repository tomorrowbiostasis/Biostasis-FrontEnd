export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radius;

export default radius;
