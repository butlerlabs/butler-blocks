import { BlockDto, FieldType, LabelDto, MimeType } from 'documentLabeler/types/DocumentLabelerTypes';

// Initial data passed in from external api calls to generate Internal State.
export type DocumentLabelerData = {
  modelId: string;
  docId: string;
  fileName: string;
  mimeType: MimeType;
  docUrl: string;
  wordBlocks: Array<BlockDto>;
  labels: LabelDto;
};

export type ActiveField = {
  id: string;
  type: FieldType.Text | FieldType.Checkbox | FieldType.Signature;
} | {
  id: string;
  type: FieldType.Table;
  activeCell?: {
    columnId: string;
    rowId: string;
  };
}


// Possible local state configurations for the Document Labeler
export type DocumentLabelerLocalState = {
  activeField?: ActiveField;
};

// Internal State, used to maintain local state within the Document Labeler
export type DocumentLabelerInternalState = {
  docInfo: DocumentLabelerData;
  localState: DocumentLabelerLocalState;
  onSaveCallback: (outputData: object) => void;
};

/** Generates initial state from initializer data */
const generateInitialState = (
 data: DocumentLabelerData,
 onSaveCallback: (outputData: object) => void,
): DocumentLabelerInternalState => {
  return {
    docInfo: data,
    localState: {
      activeField: undefined,
    },
    onSaveCallback: onSaveCallback,
  };
};

export const DocumentLabelerState = {
  generateInitialState,
};
