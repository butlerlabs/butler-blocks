import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { Confidence, FieldLabelDto, FieldType, RowLabelDto, TableLabelDto } from "documentLabeler/types/DocumentLabelerTypes";
import { uuid } from 'uuidv4';

export type RemoveAllBlocksFromFieldAction = {
  type: 'removeAllBlocksFromField';
  payload: {
    fieldId: string;
    fieldType: FieldType;
  };
};

const removeAllBlocksFromTable = (
  state: DocumentLabelerInternalState,
  action: RemoveAllBlocksFromFieldAction,
): DocumentLabelerInternalState => {
  const { fieldId } = action.payload;
  const { table, idx } = DocumentLabelerReducerUtils.getTableFromState(state, fieldId);
  const updatedTable: TableLabelDto = {
    ...table,
    rows: [],
  };
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
}

const removeAllBlocksFromFormField = (
  state: DocumentLabelerInternalState,
  action: RemoveAllBlocksFromFieldAction,
): DocumentLabelerInternalState => {
  const { fieldId } = action.payload;
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, fieldId);
  const updatedField: FieldLabelDto = {
    ...field,
    blocks: [],
    region: undefined,
    textOverride: undefined,
  };
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

const removeAllBlocksFromField = (
  state: DocumentLabelerInternalState,
  action: RemoveAllBlocksFromFieldAction,
): DocumentLabelerInternalState => {
  const { fieldType } = action.payload;
  if (fieldType === FieldType.Table) {
    return removeAllBlocksFromTable(state, action);
  } else {
    return removeAllBlocksFromFormField(state, action);
  }
}

export type SetTextFieldOverrideAction = {
  type: 'setFieldTextOverride';
  payload: {
    fieldId: string;
    textOverride: string;
  };
};

const setTextFieldOverride = (
  state: DocumentLabelerInternalState,
  action: SetTextFieldOverrideAction,
): DocumentLabelerInternalState => {
  const { fieldId, textOverride } = action.payload;
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, fieldId);
  const updatedField: FieldLabelDto = {
    ...field,
    textOverride: textOverride,
  }
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

export type RemoveRowFromTableAction = {
  type: 'removeRowFromTable',
  payload: {
    tableId: string;
    rowId: string;
  }
}

const removeRowFromTable = (
  state: DocumentLabelerInternalState,
  action: RemoveRowFromTableAction,
): DocumentLabelerInternalState => {
  const { tableId, rowId } = action.payload;
  const { table, idx } = DocumentLabelerReducerUtils.getTableFromState(state, tableId);
  const updatedTable: TableLabelDto = {
    ...table,
    rows: table.rows.filter((row) => row.id !== rowId),
  }
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
}

export type AddRowToTableAction = {
  type: 'addRowToTable',
  payload: {
    tableId: string;
  }
}

const addRowToTable = (
  state: DocumentLabelerInternalState,
  action: AddRowToTableAction,
): DocumentLabelerInternalState => {
  const { tableId } = action.payload;
  const { table, idx } = DocumentLabelerReducerUtils.getTableFromState(state, tableId);
  const newRow: RowLabelDto = {
    id: uuid(),
    cells: table.columns.map((col) => ({
      columnId: col.id,
      confidence: Confidence.UserReviewed,
      blocks: [],
    })),
  };
  const updatedTable: TableLabelDto = {
    ...table,
    rows: [...table.rows, newRow],
  }
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
}


export const FieldReducerUtils = {
  removeAllBlocksFromField,
  setTextFieldOverride,
  removeRowFromTable,
  addRowToTable,
}
