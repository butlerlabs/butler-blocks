import { BlockDto, Confidence, CreateTrainingDocumentDto, DocumentLabelerOutputDataDto, ExtractedFieldDto, ExtractedTableDto, ExtractionResultDto, FieldLabelOutputDto, FieldType, LabelDto, MimeType, SignatureLabelOutputDto, TableLabelOutputDto } from 'common/types/DocumentLabelerTypes';
import { FieldsPanelDisplayUtils } from 'documentLabeler/common/util/FieldsPanelDisplayUtils';

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

export type ActiveCell = {
  columnId: string;
  rowId: string;
}

export type ActiveTable = {
  id: string;
  type: FieldType.Table;
  activeCell?: ActiveCell;
};

export type ActiveField = {
  id: string;
  type: FieldType.Text | FieldType.Checkbox | FieldType.Signature;
} | ActiveTable;

export enum LabelingSelectionType {
  Block = 'Block',
  Region = 'Region',
}

// Possible local state configurations for the Document Labeler
export type DocumentLabelerLocalState = {
  activeField?: ActiveField;
  selectionType: LabelingSelectionType;
  rootRef: HTMLDivElement | null,
};

// Internal State, used to maintain local state within the Document Labeler
export type DocumentLabelerInternalState = {
  docInfo: DocumentLabelerData;
  localState: DocumentLabelerLocalState;
  onSaveCallback: (outputData: DocumentLabelerOutputDataDto) => void;
};

/** Generates initial state from initializer data */
const generateInitialState = (
 data: DocumentLabelerData,
 onSaveCallback: (outputData: DocumentLabelerOutputDataDto) => void,
 rootRef: HTMLDivElement | null,
): DocumentLabelerInternalState => {
  return {
    docInfo: data,
    localState: {
      activeField: undefined,
      selectionType: LabelingSelectionType.Block,
      rootRef: rootRef,
    },
    onSaveCallback: onSaveCallback,
  };
};

const convertInternalStateToOutputData = (
  state: DocumentLabelerInternalState,
): DocumentLabelerOutputDataDto => {
  const trainingSimpleFields: Array<FieldLabelOutputDto> =
    state.docInfo.labels.fields.filter(
      (field) =>
        field.type === FieldType.Text
        || field.type === FieldType.Checkbox
      )
    .map((field) => ({
      ...field,
      confidenceScore: field.confidence,
    }));
  const trainingSignatureFields: Array<SignatureLabelOutputDto> =
    state.docInfo.labels.fields.filter(
      (field) =>
        field.type === FieldType.Signature
      )
    .map((field) => ({
      ...field,
      confidenceScore: field.confidence,
    }));
  const trainingTables: Array<TableLabelOutputDto> =
    state.docInfo.labels.tables.map((table) => ({
      ...table,
      confidenceScore: table.confidence,
      type: FieldType.Table,
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => ({
          ...cell,
          confidenceScore: cell.confidence,
        }))
      }))
    }));
  const trainingDocInfo: CreateTrainingDocumentDto = {
    modelId: state.docInfo.modelId,
    docId: state.docInfo.docId,
    results: {
      fields: trainingSimpleFields,
      signatures: trainingSignatureFields,
      tables: trainingTables,
    }
  };
  const extractedFormFields: Array<ExtractedFieldDto> =
    state.docInfo.labels.fields.map((field) => ({
      fieldName: field.name,
      value: FieldsPanelDisplayUtils.getTextValueFromField(field),
      confidenceScore: field.confidence,
    }));
  const extractedTables: Array<ExtractedTableDto> =
    state.docInfo.labels.tables.map((table) => ({
      tableName: table.name,
      confidenceScore: table.confidence,
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell, idx) => ({
          columnName: table.columns[idx].name,
          value: FieldsPanelDisplayUtils.getTextValueFromCell(cell),
          confidenceScore: cell.confidence,
        }))
      }))
    }));
  const extractionResultInfo: ExtractionResultDto ={
    ...state.docInfo,
    documentId: state.docInfo.docId,
    documentStatus: 'Completed',
    confidenceScore: Confidence.UserReviewed,
    formFields: extractedFormFields,
    tables: extractedTables,
  };
  return {
    createTrainingDocumentLabels: trainingDocInfo,
    extractionResult: extractionResultInfo,
  };
}

export const DocumentLabelerState = {
  generateInitialState,
  convertInternalStateToOutputData,
};
