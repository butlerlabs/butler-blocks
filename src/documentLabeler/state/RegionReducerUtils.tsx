import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { ActiveField, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState"
import { BoundingBoxDto, FieldType } from "documentLabeler/types/DocumentLabelerTypes";

export type ClearRegionFromFieldAction = {
  type: 'clearRegionFromField',
  payload: ActiveField;
}

const clearRegionFromField = (
  state: DocumentLabelerInternalState,
  action: ClearRegionFromFieldAction,
): DocumentLabelerInternalState => {
  if (action.payload.type === FieldType.Table) {
    return state;
  } else {
    const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, action.payload.id);
    const updatedField = {
      ...field,
      region: undefined,
    }
    return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
  }
}

export type AddRegionToActiveFieldAction = {
  type: 'addRegionToActiveField',
  payload: {
    region: BoundingBoxDto,
  },
};

const addRegionToActiveField = (
  state: DocumentLabelerInternalState,
  action: AddRegionToActiveFieldAction,
): DocumentLabelerInternalState => {
  if (!state.localState.activeField) {
    throw new Error('Cannot add block to active field if no field is active');
  }
  if (state.localState.activeField.type === FieldType.Table) {
    return state;
  } else {
    const { field, idx } = 
      DocumentLabelerReducerUtils.getFieldFromState(
        state, 
        state.localState.activeField.id
      );
    const updatedField = {
      ...field,
      blocks: [],
      region: action.payload.region,
    };
    return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
  };
}

export const RegionReducerUtils = {
  clearRegionFromField,
  addRegionToActiveField,
};
