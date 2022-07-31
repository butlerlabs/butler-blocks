const toCommaDelimintedString = (list: Array<string>): string =>
  list.join(', ');

const replaceElementAtIndex = <TItem>(
  newItem: TItem,
  replaceIdx: number,
  currentArray: Array<TItem>,
): Array<TItem> => {
  if (replaceIdx < 0 || replaceIdx > currentArray.length) {
    throw new Error(
      `Invalid replace index ${replaceIdx} for array of length ${currentArray.length}`,
    );
  }
  return [
    ...currentArray.slice(0, replaceIdx),
    newItem,
    ...currentArray.slice(replaceIdx + 1),
  ];
};

export const ListUtil = {
  toCommaDelimintedString,
  replaceElementAtIndex,
};
