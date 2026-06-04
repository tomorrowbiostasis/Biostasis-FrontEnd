export const iconSizes = {
  inline: 16,
  control: 18,
  row: 20,
  rowChip: 42,
  rowChipRadius: 12,
  feature: 24,
  metric: 16,
  chevron: 18,
  tab: 24,
} as const;

export type IconSizeToken = keyof typeof iconSizes;

export default iconSizes;
