import { ColumnSpecs } from "common/dataTable/DataTable";

const ICON_COLUMN_WIDTH = 24;

// calculates static column widths for the extracted table
// editor and display components so that column widths don't
// change as the user edits the values
const calcColumnSpecs = (numColumns: number): Array<ColumnSpecs> => {
  // we want each column to have equal width, except the final column
  // which contains only icon buttons
  const columnWidth = `calc(${100 / numColumns}% - ${
    ICON_COLUMN_WIDTH / numColumns
  }px)`;

  const finalColumnWidth = `${ICON_COLUMN_WIDTH}px`;

  return Array.from(Array(numColumns))
    .map(() => ({ width: columnWidth }))
    .concat([{ width: finalColumnWidth }]);
};

export const ColumnSpecsUtil = {
  calcColumnSpecs,
};
