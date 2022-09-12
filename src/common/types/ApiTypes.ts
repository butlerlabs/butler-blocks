import { ColumnDto, FieldType } from "common/types/DocumentLabelerTypes";

export type CreateModelDto = {
	/**
	 * The name of the model
	 */
	name: string;
	/**
	 * The text and checkbox fields for this document
	 */
	fields?: Array<{
		/**
		 * Name of the text or checkbox field
		 */
		name: string;
		/**
		 * Type of model field
		 */
		type: FieldType;
	}>;
	tables?: Array<{
		/**
		 * Name of the table
		 */
		name: string;
		/**
		 * Table columns
		 */
		columns: Array<{
			/**
			 * name of the column
			 */
			name: string;
		}>;
	}>;
};

export enum ModelStatus {
	NeedsTraining = "NeedsTraining",
	Training = "Training",
	Active = "Active",
}

export enum TrainingDisabledReason {
	NotEnoughDocumentsLabeled = "NotEnoughDocumentsLabeled",
}

export enum BaseModelType {
	InvoiceV2 = "InvoiceV2",
	Invoice = "Invoice",
	Passport = "Passport",
	Receipt = "Receipt",
	USDriversLicense = "USDriversLicense",
	HealthInsuranceCard = "HealthInsuranceCard",
	IdCard = "IdCard",
	BankStatement = "BankStatement",
	PaySlip = "PaySlip",
	W2 = "W2",
	W9 = "W9",
	Mortgage = "Mortgage",
	Utility = "Utility",
	LegacyCustom = "LegacyCustom",
	CustomForm = "CustomForm",
	Composed = "Composed",
}

export type ModelFieldDto = {
	/**
	 * The model field type
	 * @type {FieldType}
	 * @memberof ModelFieldDto
	 */
	type: FieldType;
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
};

export type ModelTableDto = {
	/**
	 * The model field type
	 * @type {FieldType}
	 * @memberof ModelTableDto
	 */
	type: FieldType;
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
	 * @type {Array<ColumnDto>}
	 * @memberof ModelTableDto
	 */
	columns: Array<ColumnDto>;
};

export enum SubmitTrainingDocumentsDisabledReason {
	MaximumTrainingDocumentsReached = "MaximumTrainingDocumentsReached",
}

export type ModelInfoDto = {
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
};
