import { TypesafeUnreachableError } from 'common/util/error';
import { DocumentLabelerInternalState } from 'documentLabeler/state/DocumentLabelerState';

type DocumentLabelerDispatchAction =
  {
    type: 'openAddBlockDialog';
    payload: {
      blockId: string;
    };
  } | {
    type: 'addBlockToField';
    payload: {
      fieldId: string;
    };
  } | {
    type: 'removeBlockFromField';
    payload: {
      blockId: string;
      fieldId: string;
    };
  }

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
    case 'openAddBlockDialog':
      return state;
    case 'addBlockToField':
      return state;
    case 'removeBlockFromField':
      return state;
    default:
      throw new TypesafeUnreachableError(action);
  }
 };
