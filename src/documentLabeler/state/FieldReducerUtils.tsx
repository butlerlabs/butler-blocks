import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { FieldLabelDto, FieldType, TableLabelDto } from "documentLabeler/types/DocumentLabelerTypes";

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
  action: SetTextFieldOverrideAction
): DocumentLabelerInternalState => {
  const { fieldId, textOverride } = action.payload;
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, fieldId);
  const updatedField: FieldLabelDto = {
    ...field,
    textOverride: textOverride,
  }
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

export const FieldReducerUtils = {
  removeAllBlocksFromField,
  setTextFieldOverride,
}