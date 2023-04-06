import { TypesafeUnreachableError } from 'common/util/error';
import {
  ActiveFieldReducerUtils,
  SetActiveFieldAction,
} from 'documentLabeler/state/ActiveFieldReducerUtils';
import {
  AddBlockToActiveFieldAction,
  BlockReducerUtils,
  RemoveBlockFromFieldAction,
} from 'documentLabeler/state/BlockReducerUtils';
import { DocumentLabelerInternalState } from 'documentLabeler/state/DocumentLabelerState';
import {
  AddRowToTableAction,
  FieldReducerUtils,
  RemoveAllBlocksFromFieldAction,
  RemoveRowFromTableAction,
  SetTableCellTextOverrideAction,
  SetTextFieldOverrideAction,
} from 'documentLabeler/state/FieldReducerUtils';
import {
  AddRegionToActiveFieldAction,
  ClearRegionFromFieldAction,
  RegionReducerUtils,
} from 'documentLabeler/state/RegionReducerUtils';

type DocumentLabelerDispatchAction =
  | SetActiveFieldAction
  | AddBlockToActiveFieldAction
  | RemoveBlockFromFieldAction
  | AddRegionToActiveFieldAction
  | ClearRegionFromFieldAction
  | RemoveAllBlocksFromFieldAction
  | SetTextFieldOverrideAction
  | SetTableCellTextOverrideAction
  | AddRowToTableAction
  | RemoveRowFromTableAction;

export type DocumentLabelerDispatch = (
  action: DocumentLabelerDispatchAction,
) => void;

/**
 * Reducer for handling new state generation in response
 * to a new action with a current state.
 */
export const documentLabelerReducer = (
  state: DocumentLabelerInternalState,
  action: DocumentLabelerDispatchAction,
): DocumentLabelerInternalState => {
  const updatedState: DocumentLabelerInternalState = {
    ...state,
    localState: {
      ...state.localState,
      haveLabelsChanged: action.type !== 'setActiveField',
    },
  };

  switch (action.type) {
    case 'setActiveField':
      return ActiveFieldReducerUtils.setActiveField(updatedState, action);
    case 'addBlocksToActiveField':
      return BlockReducerUtils.addBlockToActiveField(updatedState, action);
    case 'removeBlockFromField':
      return BlockReducerUtils.removeBlockFromField(updatedState, action);
    case 'addRegionToActiveField':
      return RegionReducerUtils.addRegionToActiveField(updatedState, action);
    case 'clearRegionFromField':
      return RegionReducerUtils.clearRegionFromField(updatedState, action);
    case 'removeAllBlocksFromField':
      return FieldReducerUtils.removeAllBlocksFromField(updatedState, action);
    case 'setFieldTextOverride':
      return FieldReducerUtils.setTextFieldOverride(updatedState, action);
    case 'setTableCellTextOverride':
      return FieldReducerUtils.setTableCellTextOverride(updatedState, action);
    case 'addRowToTable':
      return FieldReducerUtils.addRowToTable(updatedState, action);
    case 'removeRowFromTable':
      return FieldReducerUtils.removeRowFromTable(updatedState, action);
    default:
      throw new TypesafeUnreachableError(action);
  }
};
