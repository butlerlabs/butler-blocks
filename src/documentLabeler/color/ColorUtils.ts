export const ButlerColorSet = [
  '#386DF4',
  '#36B37E',
  '#00C7E6',
  '#491FE0',
  '#FFAB00',
  '#FF5630',
];

/**
 * Given a color set, returns the appropriate color for an item of the given index
 * @returns string
 */
const getColorFromColorSet = (
  index: number,
  colorSet: Array<string> = ButlerColorSet,
): string => colorSet[index % colorSet.length];

export const ColorUtils = {
  ButlerColorSet,
  getColorFromColorSet,
};
