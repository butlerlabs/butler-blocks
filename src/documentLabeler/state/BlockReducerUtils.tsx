import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { ActiveField, ActiveTable, DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { BlockDto, CellLabelDto, FieldLabelDto, FieldType } from "common/types/DocumentLabelerTypes";

export type AddBlockToActiveFieldAction = {
  type: 'addBlocksToActiveField';
  payload: {
    blocks: Array<BlockDto>;
  };
};

const addBlockToActiveTable = (
  state: DocumentLabelerInternalState,
  action: AddBlockToActiveFieldAction,
  activeTable: ActiveTable,
): DocumentLabelerInternalState => {
  if (!activeTable.activeCell) {
    throw new Error('Cannot add blocks to active table if no cell is selected');
  }
  const { table, idx } =
    DocumentLabelerReducerUtils.getTableFromState(
      state,
      activeTable.id
    );
  const { cell, rowIdx, columnIdx } =
    DocumentLabelerReducerUtils.getCellInfoFromTable(
      table,
      activeTable.activeCell
    );
  // filter out any possible duplicate blocks
  const blocksToAdd =
    action.payload.blocks.filter((block) =>
      !cell.blocks.some((activeBlock) => activeBlock.id === block.id)
    );
  const updatedCell: CellLabelDto = {
    ...cell,
    region: undefined,
    blocks: [...cell.blocks, ...blocksToAdd],
  }
  const updatedFields = state.docInfo.results.fields.map((field) => {
    // filter out blocks that were stolen from other fields
    return {
      ...field,
      blocks: field.blocks.filter((block) =>
        !blocksToAdd.some((blockToAdd) => blockToAdd.id === block.id)
      ),
    }
  });
  // filter out blocks that were stolen from other tables
  const updatedTables = state.docInfo.results.tables.map((table, tblIdx) => ({
    ...table,
    rows: table.rows.map((row, rIdx) => ({
      ...row,
      cells: row.cells.map((cell, colIdx) => {
        if (colIdx === columnIdx && rIdx === rowIdx && tblIdx === idx) {
          return updatedCell;
        } else {
          return {
            ...cell,
            blocks: cell.blocks.filter((block) =>
              !blocksToAdd.some((blockToAdd) => blockToAdd.id === block.id)
            ),
          }
        }
      }),
    }))
  }));
  return {
    ...state,
    docInfo: {
      ...state.docInfo,
      results: {
        ...state.docInfo.results,
        tables: updatedTables,
        fields: updatedFields,
      }
    }
  }
}

const addBlockToActiveFormField = (
  state: DocumentLabelerInternalState,
  action: AddBlockToActiveFieldAction,
  activeField: ActiveField,
): DocumentLabelerInternalState => {
  const { field } =
    DocumentLabelerReducerUtils.getFieldFromState(
      state,
      activeField.id
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
  const updatedFields = state.docInfo.results.fields.map((field) => {
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
  // filter out blocks that were stolen from other tables
  const updatedTables = state.docInfo.results.tables.map((table) => ({
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
      results: {
        ...state.docInfo.results,
        tables: updatedTables,
        fields: updatedFields,
      }
    }
  }
}

const addBlockToActiveField = (
  state: DocumentLabelerInternalState,
  action: AddBlockToActiveFieldAction,
): DocumentLabelerInternalState => {
  if (!state.localState.activeField) {
    throw new Error('Cannot add block to active field if no field is active');
  }
  if (state.localState.activeField.type === FieldType.Table) {
    return addBlockToActiveTable(state, action, state.localState.activeField);
  } else if (state.localState.activeField.type === FieldType.Signature) {
    throw new Error('Cannot add block to signature field');
  } else {
    return addBlockToActiveFormField(state, action, state.localState.activeField);
  }
}

export type RemoveBlockFromFieldAction = {
  type: 'removeBlockFromField';
  payload: {
    blockId: string;
    field: ActiveField;
  };
};

const removeBlockFromTableCell = (
  state: DocumentLabelerInternalState,
  action: RemoveBlockFromFieldAction,
): DocumentLabelerInternalState => {
  const { blockId, field } = action.payload;
  if (field.type !== FieldType.Table || !field.activeCell) {
    throw new Error('Cannot remove block from table cell if field is not a table with an active cell');
  }
  const { table, idx } =
    DocumentLabelerReducerUtils.getTableFromState(
      state,
      field.id
    );
  const { cell, rowIdx, columnIdx } =
    DocumentLabelerReducerUtils.getCellInfoFromTable(
      table,
      field.activeCell
    );
  const updatedCell = {
    ...cell,
    blocks: cell.blocks.filter((block) => block.id !== blockId),
  }
  const updatedTable =
    DocumentLabelerReducerUtils.updateTableWithNewCell(
      table,
      updatedCell,
      rowIdx,
      columnIdx
    );
  return DocumentLabelerReducerUtils.updateStateWithNewTable(state, updatedTable, idx);
}

const removeBlockFromFormField = (
  state: DocumentLabelerInternalState,
  action: RemoveBlockFromFieldAction,
): DocumentLabelerInternalState => {
  const { blockId } = action.payload;
  const { field, idx } = DocumentLabelerReducerUtils.getFieldFromState(
    state,
    action.payload.field.id
  );
  const updatedField = {
    ...field,
    blocks: field.blocks.filter((block) => block.id !== blockId),
  }
  return DocumentLabelerReducerUtils.updateStateWithNewField(state, updatedField, idx);
}

const removeBlockFromField = (
  state: DocumentLabelerInternalState,
  action: RemoveBlockFromFieldAction,
): DocumentLabelerInternalState => {
  const { field } = action.payload;
  if (field.type === FieldType.Table) {
    return removeBlockFromTableCell(state, action);
  } else {
    return removeBlockFromFormField(state, action);
  }
}

export const BlockReducerUtils = {
  addBlockToActiveField,
  removeBlockFromField,
}
