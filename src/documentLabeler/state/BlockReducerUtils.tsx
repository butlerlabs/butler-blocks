import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { BlockDto, FieldLabelDto, FieldType } from "documentLabeler/types/DocumentLabelerTypes";

export type AddBlockToActiveFieldAction = {
  type: 'addBlocksToActiveField';
  payload: {
    blocks: Array<BlockDto>;
  };
};

const addBlockToActiveField = (
  state: DocumentLabelerInternalState,
  action: AddBlockToActiveFieldAction,
): DocumentLabelerInternalState => {
  if (!state.localState.activeField) {
    throw new Error('Cannot add block to active field if no field is active');
  }
  if (state.localState.activeField.type === FieldType.Table) {
    return state;
  } else if (state.localState.activeField.type === FieldType.Signature) {
    throw new Error('Cannot add block to signature field');
  } else {
    const { field, idx } = 
      DocumentLabelerReducerUtils.getFieldFromState(
        state, 
        state.localState.activeField.id
      );
    // filter out any possible duplicate blocks
    const blocksToAdd = 
      action.payload.blocks.filter((block) => 
        !field.blocks.some((activeBlock) => activeBlock.id === block.id)
      );
    const updatedField: FieldLabelDto = {
      ...field,
      region: undefined,
      blocks: [...field.blocks, ...blocksToAdd],
    }
    const updatedFields = state.docInfo.labels.fields.map((field) => {
      if (field.id === updatedField.id) {
        return updatedField;
      }
      // filter out blocks that were stolen from other fields
      return {
        ...field,
        blocks: field.blocks.filter((block) => 
          !blocksToAdd.some((blockToAdd) => blockToAdd.id === block.id)
        ),
      }
    });
    const updatedTables = state.docInfo.labels.tables.map((table) => ({
      ...table,
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => ({
          ...cell,
          blocks: cell.blocks.filter((block) => 
          !blocksToAdd.some((blockToAdd) => blockToAdd.id === block.id)
        ),
        }))
      }))
    }));
    return {
      ...state,
      docInfo: {
        ...state.docInfo,
        labels: {
          ...state.docInfo.labels,
          tables: updatedTables,
          fields: updatedFields,
        }
      }
    }
  }
}

export type RemoveBlockFromFieldAction = {
  type: 'removeBlockFromField';
  payload: {
    blockId: string;
    fieldId: string;
    fieldType: FieldType;
  };
};

const removeBlockFromField = (
  state: DocumentLabelerInternalState,
  action: RemoveBlockFromFieldAction,
): DocumentLabelerInternalState => {
  const { blockId, fieldId, fieldType } = action.payload;
  if (fieldType === FieldType.Table) {
    return state;
  }
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(state, fieldId);
  const updatedField = {
    ...field,
    blocks: field.blocks.filter((block) => block.id !== blockId),
  }
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

export const BlockReducerUtils = {
  addBlockToActiveField,
  removeBlockFromField,
}