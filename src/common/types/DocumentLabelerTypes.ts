export enum BlockType {
  Word = 'Word',
  Checkbox = 'Checkbox',
}

export enum FieldType {
  Text = 'Text',
  Checkbox = 'Checkbox',
  Signature = 'Signature',
  Table = 'Table',
}

export enum Confidence {
  High = 'High',
  Low = 'Low',
  UserReviewed = 'UserReviewed',
}

export enum MimeType {
  Pdf = 'application/pdf',
  Png = 'image/png',
  Jpg = 'image/jpeg',
}

export type BoundingBoxDto = {
  /**
   * Relative width of this bounding box to page width
   * @type {number}
   * @memberof BoundingBoxDto
   */
  width: number;
  /**
  * Relative height of this bounding box to page height
  * @type {number}
  * @memberof BoundingBoxDto
  */
  height: number;
  /**
  * Relative position of leftmost point of this bounding box on the page
  * @type {number}
  * @memberof BoundingBoxDto
  */
  left: number;
  /**
  * Relative position of uppermost point of this bounding box on the page
  * @type {number}
  * @memberof BoundingBoxDto
  */
  top: number;
  /**
  * Page number
  * @type {number}
  * @memberof BoundingBoxDto
  */
  page: number;
}

export type BlockDto = {
  /**
   * Unique identifier of the block
   * @type {string}
   * @memberof BlockDto
   */
  id: string;
  /**
   * Type of Block that was extracted
   * @type {BlockType}
   * @memberof BlockDto
   */
  blockType: BlockType;
  /**
   * Text contained within the block that was extracted
   * @type {string}
   * @memberof BlockDto
   */
  text: string;
  /**
   * Coordinates of the bounding box containing the extracted block
   * @type {BoundingBoxDto}
   * @memberof BlockDto
   */
  boundingBox: BoundingBoxDto;
}

export type FieldLabelDto = {
  /**
   * Unique identifier of the field label
   * @type {string}
   * @memberof FieldLabelDto
   */
  id: string;
  /**
   * Name of the field that the label corresponds to
   * @type {string}
   * @memberof FieldLabelDto
   */
  name: string;
  /**
   * The type of field that the label corresponds to
   * @type {FieldType}
   * @memberof FieldLabelDto
   */
  type: FieldType;
  /**
   * Extraction Confidence for the field label
   * @type {Confidence}
   * @memberof FieldLabelDto
   */
  confidence: Confidence;
  /**
   * Blocks that have been labeled for this field
   * @type {[BlockDto]}
   * @memberof FieldLabelDto
   */
  blocks: Array<BlockDto>;
  /**
   * Region that has been labeled for this field
   * @type {BoundingBoxDto}
   * @memberof FieldLabelDto
   */
  region?: BoundingBoxDto;
  /**
   * Manual text override that was inputted by a user
   * @type {string}
   * @memberof FieldLabelDto
   */
  textOverride?: string;
}

export type CellLabelDto = {
  /**
   * Unique identifier of the column that this cell label belongs to
   * @type {string}
   * @memberof CellLabelDto
   */
  columnId: string;
  /**
  * Extraction Confidence for the cell label
  * @type {Confidence}
  * @memberof CellLabelDto
  */
  confidence: Confidence;
  /**
  * Blocks that have been labeled for this cell
  * @type {[BlockDto]}
  * @memberof CellLabelDto
  */
  blocks: Array<BlockDto>;
  /**
  * Region that has been labeled for this cell
  * @type {BoundingBoxDto}
  * @memberof CellLabelDto
  */
  region?: BoundingBoxDto;
  /**
  * Manual text override that was inputted by a user
  * @type {string}
  * @memberof CellLabelDto
  */
  textOverride?: string;
}

export type RowLabelDto = {
  /**
   * Unique identifier of the row label
   * @type {string}
   * @memberof RowLabelDto
   */
  id: string;
  /**
   * Cell labels contained within this row
   * @type {[CellLabelDto]}
   * @memberof RowLabelDto
   */
   cells: Array<CellLabelDto>;
}

export type ColumnDto = {
  /**
   * Unique identifier of the column
   * @type {string}
   * @memberof ColumnDto
   */
  id: string;
  /**
  * Name of the column within the table
  * @type {string}
  * @memberof ColumnDto
  */
  name: string;
}

export type TableLabelDto = {
  /**
   * Unique identifier of the table label
   * @type {string}
   * @memberof TableLabelDto
   */
  id: string;
  /**
  * Name of the table that the label corresponds to
  * @type {string}
  * @memberof TableLabelDto
  */
  name: string;
  /**
  * Extraction Confidence for the table label
  * @type {Confidence}
  * @memberof TableLabelDto
  */
  confidence: Confidence;
  /**
  * Column names for this table label
  * @type {[ColumnDto]}
  * @memberof TableLabelDto
  */
  columns: Array<ColumnDto>;
  /**
  * Array of row labels for this table label
  * @type {[RowLabelDto]}
  * @memberof TableLabelDto
  */
  rows: Array<RowLabelDto>;
}

export type LabelDto = {
  /**
  * Array of field labels for this document label
  * @type {[FieldLabelDto]}
  * @memberof LabelDto
  */
  fields: Array<FieldLabelDto>;
  /**
   * Array of table labels for this document label
   * @type {[TableLabelDto]}
   * @memberof LabelDto
   */
  tables: Array<TableLabelDto>;
}

type SharedLabelOutputDto = {
  id: string;
  name: string;
  confidenceScore: Confidence;
  type: FieldType;
}

export type FieldLabelOutputDto = SharedLabelOutputDto & {
  blocks: Array<BlockDto>;
  region?: BoundingBoxDto;
}

export type SignatureLabelOutputDto = SharedLabelOutputDto & {
  region?: BoundingBoxDto;
}

export type CellLabelOutputDto = {
  columnId: string;
  confidenceScore: Confidence;
  blocks: Array<BlockDto>;
  region?: BoundingBoxDto;
}

export type RowLabelOutputDto = {
  id: string;
  cells: Array<CellLabelOutputDto>;
}

export type TableLabelOutputDto = SharedLabelOutputDto & {
  columns: Array<ColumnDto>;
  rows: Array<RowLabelOutputDto>;
}

export type TrainingDocumentResultDto = {
  fields: Array<FieldLabelOutputDto>;
  signatures: Array<SignatureLabelOutputDto>;
  tables: Array<TableLabelOutputDto>;
}

export type TrainingDocumentLabelsDto = {
  modelId: string;
  docId: string;
  results: TrainingDocumentResultDto;
}

export type ExtractedFieldDto = {
  fieldName: string;
  value: string;
  confidenceScore: Confidence;
}

export type ExtractedTableCellDto = {
  columnName: string;
  value: string;
  confidenceScore: Confidence;
}

export type ExtractedTableRowDto = {
  cells: Array<ExtractedTableCellDto>;
}

export type ExtractedTableDto = {
  tableName: string;
  rows: Array<ExtractedTableRowDto>;
  confidenceScore: Confidence;
}

export type ExtractionResultDto = {
  documentId: string;
  documentStatus: 'Completed';
  fileName: string;
  mimeType: MimeType;
  confidenceScore: Confidence;
  formFields: Array<ExtractedFieldDto>;
  tables: Array<ExtractedTableDto>;
}

export type DocumentLabelerOutputDataDto = {
  extractionResult: ExtractionResultDto;
  trainingDocumentLabels: TrainingDocumentLabelsDto;
}
