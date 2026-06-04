export const layout = {
  screenGutter: 24,
  screenGutterCompact: 20,
  cardPaddingHorizontal: 16,
  cardPaddingVertical: 14,
  ctaHeight: 48,
  ctaRadius: 14,
  ctaPaddingHorizontal: 18,
  formCtaHeight: 44,
  formCtaRadius: 14,
} as const;

export type LayoutToken = keyof typeof layout;

export default layout;
