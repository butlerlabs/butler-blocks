import { BlockDto, LabelDto } from "documentLabeler/types/DocumentLabelerTypes";

// Initial data passed in from external api calls to generate Internal State.
export type DocumentLabelerData = {
  modelId: string;
  docId: string;
  fileName: string;
  mimeType: string;
  docUrl: string;
  wordBlocks: Array<BlockDto>;
  labels: LabelDto;
};

export enum DocumentLabelerStateOptions {
  ViewBlocks = 'ViewBlocks',
  AddBlockToField = 'AddBlockToField',
  LabelTable = 'LabelTable',
}

// Possible local state configurations for the Document Labeler
export type DocumentLabelerLocalState = {
  type: DocumentLabelerStateOptions.ViewBlocks;
} | {
  type: DocumentLabelerStateOptions.AddBlockToField;
  blockId: string;
} | {
  type: DocumentLabelerStateOptions.LabelTable;
  tableId: string;
  activeCell?: {
    columnId: string;
    rowId: string;
  };
};

// Internal State, used to maintain local state within the Document Labeler
export type DocumentLabelerInternalState = {
  docInfo: DocumentLabelerData;
  localState: DocumentLabelerLocalState;
};

/** Generates initial state from initializer data */
const generateInitialState = (
 data: DocumentLabelerData,
): DocumentLabelerInternalState => {
  return {
    docInfo: data,
    localState: {
      type: DocumentLabelerStateOptions.ViewBlocks,
    },
  };
};

export const DocumentLabelerState = {
  generateInitialState,
};
