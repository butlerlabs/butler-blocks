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
  SetImageHeight,
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
  | DecreasePdfScale
  | SetImageHeight;

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
      const { pdfScale, zoomMaxScale, renderedImgHeight } = state.localState;
      const newPdfScale = pdfScale + 0.1;
      const newImageHeight = renderedImgHeight + 25;

      if (newPdfScale >= zoomMaxScale) {
        return state;
      }
      return {
        ...state,
        localState: {
          ...state.localState,
          renderedImgHeight: newImageHeight,
          pdfScale: newPdfScale,
        },
      };
    }

    case 'decreasePdfScale': {
      const { pdfScale, zoomMinScale, renderedImgHeight } = state.localState;
      const newPdfScale = pdfScale - 0.1;
      const newImageHeight = renderedImgHeight - 25;

      if (newPdfScale <= zoomMinScale) {
        return state;
      }
      return {
        ...state,
        localState: {
          ...state.localState,
          pdfScale: newPdfScale,
          renderedImgHeight: newImageHeight,
        },
      };
    }

    case 'setImageHeight': {
      return {
        ...state,
        localState: {
          ...state.localState,
          renderedImgHeight: action.payload,
        },
      };
    }
    default:
      throw new TypesafeUnreachableError(action);
  }
};
