import { ListUtil } from "common/util/ListUtil/ListUtil";
import { ColorUtils } from "documentLabeler/color/ColorUtils";
import { ActiveCell, DocumentLabelerData, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { CellLabelDto, FieldLabelDto, TableLabelDto } from "common/types/DocumentLabelerTypes";

/**
 * Helper function to look up active field information for a specified
 * field Id in the document labeler state.
 * @param state
 * @param fieldId
 * @returns the field information and its index in the fields list
 */
const getFieldFromState = (
  state: DocumentLabelerInternalState,
  fieldId: string
): {
  field: FieldLabelDto,
  idx: number,
} => {
  const { fields } = state.docInfo.results;
  const idx = fields.findIndex((field) => field.id === fieldId);
  if (idx === -1) {
    throw new Error(`Did not find unique field info in document labels when looking up field id ${fieldId}`)
  }
  return {
    field: fields[idx],
    idx: idx,
  }
}

/**
 * Helper function to look up table information for a specified
 * table Id in the document labeler state.
 * @param state
 * @param fieldId
 * @returns the table information and its index in the tables list
 */
 const getTableFromState = (
  state: DocumentLabelerInternalState,
  fieldId: string
): {
  table: TableLabelDto,
  idx: number,
} => {
  const { tables } = state.docInfo.results;
  const idx = tables.findIndex((table) => table.id === fieldId);
  if (idx === -1) {
    throw new Error(`Did not find unique field info in document labels when looking up field id ${fieldId}`)
  }
  return {
    table: tables[idx],
    idx: idx,
  }
}

const updateStateWithNewField = (
  state: DocumentLabelerInternalState,
  updatedField: FieldLabelDto,
  fieldIdx: number,
): DocumentLabelerInternalState => {
  const { fields } = state.docInfo.results;
  const updatedFields = ListUtil.replaceElementAtIndex(updatedField, fieldIdx, fields);
  return {
    ...state,
    docInfo: {
      ...state.docInfo,
      results: {
        ...state.docInfo.results,
        fields: updatedFields,
      },
    },
  };
}

const updateStateWithNewTable = (
  state: DocumentLabelerInternalState,
  updatedTable: TableLabelDto,
  fieldIdx: number,
): DocumentLabelerInternalState => {
  const { tables } = state.docInfo.results;
  const updatedTables = ListUtil.replaceElementAtIndex(updatedTable, fieldIdx, tables);
  return {
    ...state,
    docInfo: {
      ...state.docInfo,
      results: {
        ...state.docInfo.results,
        tables: updatedTables,
      },
    },
  };
}

type FieldWithColor = {
  info: FieldLabelDto;
  color: string;
}

type TableWithColor = {
  info: TableLabelDto;
  color: string;
}

/**
 * Function used to get all fields for the current document, with associated colors
 * @param data
 */
const getAllColoredFields = (
  data: DocumentLabelerData,
): {
  fields: Array<FieldWithColor>
  tables: Array<TableWithColor>
} => ({
  fields: data.results.fields.map((field, index) => ({
    info: field,
    color: ColorUtils.getColorFromColorSet(index),
  })),
  tables: data.results.tables.map((table, index) => ({
    info: table,
    color: ColorUtils.getColorFromColorSet(index + data.results.fields.length),
  })),
});

/**
 * Function used to get the color of a given field
 * @param state: DocumentLabelerInternalState
 * @param fieldId: string
 * @returns Color(string)
 */
 const getColorFromFieldId = (
  state: DocumentLabelerInternalState,
  fieldId: string,
): string => {
  const { fields, tables } = getAllColoredFields(state.docInfo);

  const idx = [...fields, ...tables].findIndex((field) => field.info.id === fieldId);
  if (idx === -1) {
    throw new Error(
      `No Field found for Field Id ${fieldId} when looking up field color`,
    );
  }

  return ColorUtils.getColorFromColorSet(idx);
};

/**
 * Function used to get selectedTable from selectedField
 * @param state: ModelDetailsInternalState
 * @returns
 */
 const getSelectedTable = (
  state: DocumentLabelerInternalState,
): TableLabelDto => {
  // if ModelFieldType is table, then field is guaranteed to be
  // of type TrainingTableLabeledResultDto
  const selectedTable = getAllColoredFields(state.docInfo).tables
    .find(
      (table) => table.info.id === state.localState.activeField?.id,
    );
  if (!selectedTable) {
    throw new Error('Could not field selected table in state');
  }
  return selectedTable.info;
};


const getCellInfoFromTable = (
  table: TableLabelDto,
  activeCell: ActiveCell,
): { rowIdx: number; columnIdx: number; cell: CellLabelDto } => {
  const rowIdx = table.rows.findIndex((row) => row.id === activeCell.rowId);
  if (rowIdx === -1) {
    throw new Error('No row found when looking up cell in table');
  }
  const rows = table.rows;
  const row = rows[rowIdx];
  const columnIdx = row.cells.findIndex(
    (cell) => cell.columnId === activeCell.columnId,
  );
  if (columnIdx === -1) {
    throw new Error('No cell found when looking up cell in table');
  }
  const cells = row.cells;
  const cell = cells[columnIdx];

  return {
    rowIdx,
    columnIdx,
    cell,
  };
};

const updateTableWithNewCell = (
  table: TableLabelDto,
  cell: CellLabelDto,
  rowIdx: number,
  columnIdx: number,
): TableLabelDto => {
  const row = table.rows[rowIdx];
  const updatedRow = {
    ...row,
    cells: ListUtil.replaceElementAtIndex(cell, columnIdx, row.cells),
  }
  return {
    ...table,
    rows: ListUtil.replaceElementAtIndex(updatedRow, rowIdx, table.rows),
  }
}


export const DocumentLabelerReducerUtils = {
  getFieldFromState,
  getTableFromState,
  getAllColoredFields,
  getColorFromFieldId,
  getCellInfoFromTable,
  getSelectedTable,
  updateStateWithNewField,
  updateStateWithNewTable,
  updateTableWithNewCell,
};
