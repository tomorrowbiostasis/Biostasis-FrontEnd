const percentageToDecimal = (value: number) => Math.round((value * 255) / 100);

const decimalToHex = (decimal: number) => {
  const hex = decimal.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

/**
 *
 * @param color hex value of the color
 * @param opacity  percentage value of the opacity 0-100
 */
export const addOpacity = (color: string, opacity: number) => {
  const decimalOpacity = percentageToDecimal(opacity);
  const hexOpacity = decimalToHex(decimalOpacity);
  return `${color}${hexOpacity}`;
};
