import { TypesafeUnreachableError } from 'common/util/error';
import {
  ActiveFieldReducerUtils,
  SetActiveFieldAction,
} from 'documentLabeler/state/ActiveFieldReducerUtils';
import {
  AddBlockToActiveFieldAction,
  BlockReducerUtils,
  RemoveBlockFromFieldAction,
  SetShowHidePdf,
  SetPdfScale,
  IncreasePdfScale,
  DecreasePdfScale,
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
  | RemoveRowFromTableAction
  | SetShowHidePdf
  | SetPdfScale
  | IncreasePdfScale
  | DecreasePdfScale;

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
  switch (action.type) {
    case 'setActiveField':
      return ActiveFieldReducerUtils.setActiveField(state, action);
    case 'addBlocksToActiveField':
      return BlockReducerUtils.addBlockToActiveField(state, action);
    case 'removeBlockFromField':
      return BlockReducerUtils.removeBlockFromField(state, action);
    case 'addRegionToActiveField':
      return RegionReducerUtils.addRegionToActiveField(state, action);
    case 'clearRegionFromField':
      return RegionReducerUtils.clearRegionFromField(state, action);
    case 'removeAllBlocksFromField':
      return FieldReducerUtils.removeAllBlocksFromField(state, action);
    case 'setFieldTextOverride':
      return FieldReducerUtils.setTextFieldOverride(state, action);
    case 'setTableCellTextOverride':
      return FieldReducerUtils.setTableCellTextOverride(state, action);
    case 'addRowToTable':
      return FieldReducerUtils.addRowToTable(state, action);
    case 'removeRowFromTable':
      return FieldReducerUtils.removeRowFromTable(state, action);
    case 'setShowHidePdf':
      return {
        ...state,
        localState: {
          ...state.localState,
          showPdf: action.payload,
        },
      };
    case 'setPdfScale': {
      return {
        ...state,
        localState: {
          ...state.localState,
          pdfScale: action.payload,
        },
      };
    }
    case 'increasePdfScale': {
      const { pdfScale } = state.localState;
      const newPdfScale = pdfScale + 0.1;
      if (newPdfScale >= 2.1) {
        return state;
      }
      return {
        ...state,
        localState: {
          ...state.localState,
          pdfScale: newPdfScale,
        },
      };
    }

    case 'decreasePdfScale': {
      const { pdfScale } = state.localState;
      const newPdfScale = pdfScale - 0.1;
      if (newPdfScale <= 0.4) {
        return state;
      }
      return {
        ...state,
        localState: {
          ...state.localState,
          pdfScale: newPdfScale,
        },
      };
    }
    default:
      throw new TypesafeUnreachableError(action);
  }
};
