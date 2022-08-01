import { ActiveField, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";

export type SetActiveFieldAction = {
  type: 'setActiveField';
  payload: ActiveField | undefined;
}

const setActiveField = (
  state: DocumentLabelerInternalState, 
  action: SetActiveFieldAction
): DocumentLabelerInternalState => {
  return {
    ...state,
    localState: {
      ...state.localState,
      activeField: action.payload,
    }
  }
}

export const ActiveFieldReducerUtils = {
  setActiveField,
};