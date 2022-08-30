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
   * Extraction Confidence Score for the field label
   * @type {Confidence}
   * @memberof FieldLabelDto
   */
  confidenceScore: Confidence;
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
  * Extraction Confidence Score for the cell label
  * @type {Confidence}
  * @memberof CellLabelDto
  */
  confidenceScore: Confidence;
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
  * Extraction Confidence Score for the table label
  * @type {Confidence}
  * @memberof TableLabelDto
  */
   confidenceScore: Confidence;
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

/**
 * 
 * @export
 * @enum {string}
 */
 export enum ModelFieldType {
  Text = 'Text',
  Checkbox = 'Checkbox',
  Signature = 'Signature',
  Table = 'Table'
}

/**
 * 
 * @export
 * @interface FieldDto
 */
 export interface FieldDto {
  /**
   * The name of the field
   * @type {string}
   * @memberof FieldDto
   */
  name: string;
  /**
   * 
   * @type {ModelFieldType}
   * @memberof FieldDto
   */
  type: ModelFieldType;
}

/**
 * 
 * @export
 * @interface TableDto
 */
 export interface TableDto {
  /**
   * The name of the table
   * @type {string}
   * @memberof TableDto
   */
  name: string;
  /**
   * The columns of the table
   * @type {Array<ColumnDto>}
   * @memberof TableDto
   */
  columns: Array<ColumnDto>;
}

/**
 * 
 * @export
 * @interface CreateModelDto
 */
 export interface CreateModelDto {
  /**
   * The name of the model
   * @type {string}
   * @memberof CreateModelDto
   */
  name: string;
  /**
   * The text and checkbox fields for this document
   * @type {Array<FieldDto>}
   * @memberof CreateModelDto
   */
  fields?: Array<FieldDto>;
  /**
   * The tables for this document
   * @type {Array<TableDto>}
   * @memberof CreateModelDto
   */
  tables?: Array<TableDto>;
}

/**
 * 
 * @export
 * @enum {string}
 */
 export enum ModelStatus {
  NeedsTraining = 'NeedsTraining',
  Training = 'Training',
  Active = 'Active'
}

/**
 * 
 * @export
 * @enum {string}
 */
 export enum TrainingDisabledReason {
  NotEnoughDocumentsLabeled = 'NotEnoughDocumentsLabeled'
}

/**
 * 
 * @export
 * @enum {string}
 */
 export enum BaseModelType {
  InvoiceV2 = 'InvoiceV2',
  Invoice = 'Invoice',
  Passport = 'Passport',
  Receipt = 'Receipt',
  USDriversLicense = 'USDriversLicense',
  HealthInsuranceCard = 'HealthInsuranceCard',
  IdCard = 'IdCard',
  BankStatement = 'BankStatement',
  PaySlip = 'PaySlip',
  W2 = 'W2',
  W9 = 'W9',
  IRS1040Standard = 'IRS1040Standard',
  Mortgage = 'Mortgage',
  Utility = 'Utility',
  LegacyCustom = 'LegacyCustom',
  CustomForm = 'CustomForm',
  Composed = 'Composed'
}

/**
 * 
 * @export
 * @interface ModelFieldDto
 */
 export interface ModelFieldDto {
  /**
   * 
   * @type {ModelFieldType}
   * @memberof ModelFieldDto
   */
  type: ModelFieldType;
  /**
   * The name for the new field
   * @type {string}
   * @memberof ModelFieldDto
   */
  name: string;
  /**
   * The unique id of this field.
   * @type {string}
   * @memberof ModelFieldDto
   */
  id: string;
}

/**
 * 
 * @export
 * @interface ModelColumnDto
 */
 export interface ModelColumnDto {
  /**
   * The name for the column
   * @type {string}
   * @memberof ModelColumnDto
   */
  name: string;
  /**
   * The unique id of this column.
   * @type {string}
   * @memberof ModelColumnDto
   */
  id: string;
}

/**
 * 
 * @export
 * @interface ModelTableDto
 */
 export interface ModelTableDto {
  /**
   * 
   * @type {ModelFieldType}
   * @memberof ModelTableDto
   */
  type: ModelFieldType;
  /**
   * The name for the new field
   * @type {string}
   * @memberof ModelTableDto
   */
  name: string;
  /**
   * The unique id of this table.
   * @type {string}
   * @memberof ModelTableDto
   */
  id: string;
  /**
   * The columns fields for this table
   * @type {Array<ModelColumnDto>}
   * @memberof ModelTableDto
   */
  columns: Array<ModelColumnDto>;
}

/**
 * 
 * @export
 * @enum {string}
 */
 export enum SubmitTrainingDocumentsDisabledReason {
  MaximumTrainingDocumentsReached = 'MaximumTrainingDocumentsReached'
}

/**
 * 
 * @export
 * @interface ModelInfoDto
 */
 export interface ModelInfoDto {
  /**
   * The unique id of this model.
   * @type {string}
   * @memberof ModelInfoDto
   */
  id: string;
  /**
   * Name of the model.
   * @type {string}
   * @memberof ModelInfoDto
   */
  name: string;
  /**
   * 
   * @type {ModelStatus}
   * @memberof ModelInfoDto
   */
  status: ModelStatus;
  /**
   * 
   * @type {TrainingDisabledReason}
   * @memberof ModelInfoDto
   */
  trainingDisabledReason?: TrainingDisabledReason;
  /**
   * 
   * @type {BaseModelType}
   * @memberof ModelInfoDto
   */
  modelType: BaseModelType;
  /**
   * The text, checkbox, and signature fields for this model
   * @type {Array<ModelFieldDto>}
   * @memberof ModelInfoDto
   */
  fields: Array<ModelFieldDto>;
  /**
   * The table fields for this model
   * @type {Array<ModelTableDto>}
   * @memberof ModelInfoDto
   */
  tables: Array<ModelTableDto>;
  /**
   * Reason for previous training failure
   * @type {string}
   * @memberof ModelInfoDto
   */
  trainingFailureReason?: string;
  /**
   * The id of the queue for this model.
   * @type {string}
   * @memberof ModelInfoDto
   */
  queueId: string;
  /**
   * The number of training documents for this model
   * @type {number}
   * @memberof ModelInfoDto
   */
  numTrainingDocuments: number;
  /**
   * 
   * @type {SubmitTrainingDocumentsDisabledReason}
   * @memberof ModelInfoDto
   */
  submitTrainingDocumentsDisabledReason?: SubmitTrainingDocumentsDisabledReason;
}
