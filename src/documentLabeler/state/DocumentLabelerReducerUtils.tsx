import { ListUtil } from "common/util/ListUtil/ListUtil";
import { ColorUtils } from "documentLabeler/color/ColorUtils";
import { ActiveCell, DocumentLabelerData, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { CellLabelDto, FieldLabelDto, FieldType, TableLabelDto } from "documentLabeler/types/DocumentLabelerTypes";

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
  const { fields } = state.docInfo.labels;
  const idx = fields.findIndex((field) => field.id === fieldId);
  if (idx === -1) {
    throw new Error(`Did not find unique field info in document labels when looking up field id ${fieldId}`)
  }
  return {
    field: fields[idx],
    idx: idx,
  }
}

const updateStateWithNewField = (
  state: DocumentLabelerInternalState,
  updatedField: FieldLabelDto,
  fieldIdx: number,
): DocumentLabelerInternalState => {
  const { fields, tables } = state.docInfo.labels;
  const updatedFields = ListUtil.replaceElementAtIndex(updatedField, fieldIdx, fields);
  return {
    ...state,
    docInfo: {
      ...state.docInfo,
      labels: {
        fields: updatedFields,
        tables: tables,
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
  fields: data.labels.fields.map((field, index) => ({
    info: field,
    color: ColorUtils.getColorFromColorSet(index),
  })),
  tables: data.labels.tables.map((table, index) => ({
    info: table,
    color: ColorUtils.getColorFromColorSet(index + data.labels.fields.length),
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
): { rowIdx: number; cellIdx: number; cell: CellLabelDto } => {
  const rowIdx = table.rows.findIndex((row) => row.id === activeCell.rowId);
  if (rowIdx === -1) {
    throw new Error('No row found when looking up cell in table');
  }
  const rows = table.rows;
  const row = rows[rowIdx];
  const cellIdx = row.cells.findIndex(
    (cell) => cell.columnId === activeCell.columnId,
  );
  if (cellIdx === -1) {
    throw new Error('No cell found when looking up cell in table');
  }
  const cells = row.cells;
  const cell = cells[cellIdx];

  return {
    rowIdx,
    cellIdx,
    cell,
  };
};


export const DocumentLabelerReducerUtils = {
  getFieldFromState,
  getAllColoredFields,
  getColorFromFieldId,
  getCellInfoFromTable,
  getSelectedTable,
  updateStateWithNewField,
};