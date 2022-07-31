import { TypesafeUnreachableError } from "common/util/error";
import { ColorUtils } from "documentLabeler/color/ColorUtils";
import { DocumentLabelerData } from "documentLabeler/state/DocumentLabelerState";
import { FieldLabelDto, FieldType, TableLabelDto } from "documentLabeler/types/DocumentLabelerTypes";

type FieldWithColor = {
  info: FieldLabelDto;
  color: string;
}

type TableWithColor = {
  info: TableLabelDto;
  color: string;
}

/**
 * Function used to get all fields for the current document, with associated colors
 * @param data
 */
const getAllColoredFields = (
  data: DocumentLabelerData,
): { 
  fields: Array<FieldWithColor>
  tables: Array<TableWithColor>
} => ({
  fields: data.labels.fields.map((field, index) => ({
    info: field,
    color: ColorUtils.getColorFromColorSet(index),
  })),
  tables: data.labels.tables.map((table, index) => ({
    info: table,
    color: ColorUtils.getColorFromColorSet(index + data.labels.fields.length),
  })),
});

/**
 * Function which determines if a field currently has a labeled value or text override
 */
const fieldHasLabeledValue = (field: FieldLabelDto): boolean => {
  switch (field.type) {
    case FieldType.Text:
    case FieldType.Checkbox:
      return field.blocks.length > 0 || Boolean(field.region) || Boolean(field.textOverride);
    case FieldType.Signature:
      return Boolean(field.region) || Boolean(field.textOverride);
    case FieldType.Table:
      throw new Error('Field Labels cannot be of type table (tables are stored in Table Labels)');
    default:
      throw new TypesafeUnreachableError(field.type);
  }
};

/** 
 * Function which determines if a table currently has a labeled value 
 */
const tableHasLabeledValue = (table: TableLabelDto): boolean => {
  return table.rows.length > 0;
}

export const FieldsPanelUtils = {
  getAllColoredFields,
  fieldHasLabeledValue,
  tableHasLabeledValue,
}
