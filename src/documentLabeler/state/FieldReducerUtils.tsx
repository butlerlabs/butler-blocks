import { ListUtil } from "common/util/ListUtil/ListUtil";
import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { FieldLabelDto } from "documentLabeler/types/DocumentLabelerTypes";

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

export type RemoveAllBlocksFromFieldAction = {
  type: 'removeAllBlocksFromField';
  payload: {
    fieldId: string;
  };
};

const removeAllBlocksFromField = (
  state: DocumentLabelerInternalState,
  action: RemoveAllBlocksFromFieldAction,
): DocumentLabelerInternalState => {
  const { fieldId } = action.payload;
  const { activeField, idx } = DocumentLabelerReducerUtils.getActiveFieldFromState(state, fieldId);
  const updatedField: FieldLabelDto = {
    ...activeField,
    blocks: [],
    region: undefined,
    textOverride: undefined,
  };
  return updateStateWithNewField(state, updatedField, idx);
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
  const { activeField, idx } = DocumentLabelerReducerUtils.getActiveFieldFromState(state, fieldId);
  const updatedField: FieldLabelDto = {
    ...activeField,
    textOverride: textOverride,
  }
  return updateStateWithNewField(state, updatedField, idx);
}

export const FieldReducerUtils = {
  removeAllBlocksFromField,
  setTextFieldOverride,
}