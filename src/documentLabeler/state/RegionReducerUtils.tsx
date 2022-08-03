import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { ActiveField, ActiveTable, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState"
import { BoundingBoxDto, FieldType, TableLabelDto } from "common/types/DocumentLabelerTypes";

export type ClearRegionFromFieldAction = {
  type: 'clearRegionFromField',
  payload: ActiveField;
}

const clearRegionFromTable = (
  state: DocumentLabelerInternalState,
  action: ClearRegionFromFieldAction,
): DocumentLabelerInternalState => {
  if (action.payload.type !== FieldType.Table || !action.payload.activeCell) {
    throw new Error('Cannot remove block from table cell if field is not a table with an active cell');
  }
  const { id, activeCell } = action.payload;
  const { table, idx } =
    DocumentLabelerReducerUtils.getTableFromState(
      state,
      id
    );
  const { cell, rowIdx, columnIdx } =
    DocumentLabelerReducerUtils.getCellInfoFromTable(
      table,
      activeCell
    );
  const updatedCell = {
    ...cell,
    region: undefined,
  }
  const updatedTable =
    DocumentLabelerReducerUtils.updateTableWithNewCell(
      table,
      updatedCell,
      rowIdx,
      columnIdx
    );
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
};

const clearRegionFromFormField = (
  state: DocumentLabelerInternalState,
  action: ClearRegionFromFieldAction,
): DocumentLabelerInternalState => {
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, action.payload.id);
  const updatedField = {
    ...field,
    region: undefined,
  };
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

const clearRegionFromField = (
  state: DocumentLabelerInternalState,
  action: ClearRegionFromFieldAction,
): DocumentLabelerInternalState => {
  if (action.payload.type === FieldType.Table) {
    return clearRegionFromTable(state, action);
  } else {
    return clearRegionFromFormField(state, action);
  }
}

export type AddRegionToActiveFieldAction = {
  type: 'addRegionToActiveField',
  payload: {
    region: BoundingBoxDto,
  },
};

const addRegionToActiveTableCell = (
  state: DocumentLabelerInternalState,
  action: AddRegionToActiveFieldAction,
  activeTable: ActiveTable,
): DocumentLabelerInternalState => {
  if (activeTable.type !== FieldType.Table || !activeTable.activeCell) {
    throw new Error('Cannot remove block from table cell if field is not a table with an active cell');
  }
  const { id, activeCell } = activeTable;
  const { table, idx } =
    DocumentLabelerReducerUtils.getTableFromState(
      state,
      id,
    );
  const { cell, rowIdx, columnIdx } =
    DocumentLabelerReducerUtils.getCellInfoFromTable(
      table,
      activeCell,
    );
  const updatedCell = {
    ...cell,
    blocks: [],
    region: action.payload.region,
  };
  const updatedTable =
    DocumentLabelerReducerUtils.updateTableWithNewCell(
      table,
      updatedCell,
      rowIdx,
      columnIdx
    );
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
}

const addRegionToActiveFormField = (
  state: DocumentLabelerInternalState,
  action: AddRegionToActiveFieldAction,
  activeField: ActiveField,
): DocumentLabelerInternalState => {
  const { field, idx } =
    DocumentLabelerReducerUtils.getFieldFromState(
      state,
      activeField.id
    );
  const updatedField = {
    ...field,
    blocks: [],
    region: action.payload.region,
  };
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

const addRegionToActiveField = (
  state: DocumentLabelerInternalState,
  action: AddRegionToActiveFieldAction,
): DocumentLabelerInternalState => {
  if (!state.localState.activeField) {
    throw new Error('Cannot add block to active field if no field is active');
  }
  if (state.localState.activeField.type === FieldType.Table) {
    return addRegionToActiveTableCell(state, action, state.localState.activeField);
  } else {
    return addRegionToActiveFormField(state, action, state.localState.activeField);
  };
}

export const RegionReducerUtils = {
  clearRegionFromField,
  addRegionToActiveField,
};
