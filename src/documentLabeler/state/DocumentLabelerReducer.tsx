import { TypesafeUnreachableError } from 'common/util/error';
import { ActiveFieldReducerUtils, SetActiveFieldAction } from 'documentLabeler/state/ActiveFieldReducerUtils';
import { DocumentLabelerInternalState } from 'documentLabeler/state/DocumentLabelerState';
import { FieldReducerUtils, RemoveAllBlocksFromFieldAction, SetTextFieldOverrideAction } from 'documentLabeler/state/FieldReducerUtils';

type DocumentLabelerDispatchAction =
  SetActiveFieldAction |
  {
    type: 'addBlockToActiveField';
    payload: {
      blockId: string;
    };
  } | {
    type: 'removeBlockFromField';
    payload: {
      blockId: string;
      fieldId: string;
    };
  } | RemoveAllBlocksFromFieldAction 
    | SetTextFieldOverrideAction;

 export type DocumentLabelerDispatch = (action: DocumentLabelerDispatchAction) => void;

 /**
 * Reducer for handling new state generation in response
 * to a new action with a current state.
 */
 export const documentLabelerReducer = (
  state: DocumentLabelerInternalState,
  action: DocumentLabelerDispatchAction,
 ): DocumentLabelerInternalState => {
  switch (action.type) {
    case 'setActiveField':
      return ActiveFieldReducerUtils.setActiveField(state, action);
    case 'addBlockToActiveField':
      return state;
    case 'removeBlockFromField':
      return state;
    case 'removeAllBlocksFromField':
      return FieldReducerUtils.removeAllBlocksFromField(state, action);
    case 'setFieldTextOverride':
      return FieldReducerUtils.setTextFieldOverride(state, action);
    default:
      throw new TypesafeUnreachableError(action);
  }
 };
