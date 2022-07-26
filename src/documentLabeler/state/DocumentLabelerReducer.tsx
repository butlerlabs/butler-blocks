import { TypesafeUnreachableError } from 'common/util/error';
import { DocumentLabelerInternalState } from 'documentLabeler/state/DocumentLabelerState';
import { FieldType } from 'documentLabeler/types/DocumentLabelerTypes';

type DocumentLabelerDispatchAction =
  {
    type: 'setActiveField';
    payload: {
      fieldId: string;
      fieldType: FieldType;
    };
  } |
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
    case 'setActiveField':
      return state;
    case 'addBlockToActiveField':
      return state;
    case 'removeBlockFromField':
      return state;
    default:
      throw new TypesafeUnreachableError(action);
  }
 };
