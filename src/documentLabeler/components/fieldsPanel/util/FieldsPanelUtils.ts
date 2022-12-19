import { TypesafeUnreachableError } from 'common/util/error';
import {
  FieldLabelDto,
  FieldType,
  TableLabelDto,
} from 'common/types/DocumentLabelerTypes';

/**
 * Function which determines if a field currently has a labeled value or text override
 */
const fieldHasLabeledValue = (field: FieldLabelDto): boolean => {
  switch (field.type) {
    case FieldType.Text:
    case FieldType.Checkbox:
      return (
        field.blocks.length > 0 ||
        Boolean(field.region) ||
        Boolean(field.textOverride)
      );
    case FieldType.Signature:
      return Boolean(field.region) || Boolean(field.textOverride);
    case FieldType.Table:
      throw new Error(
        'Field Labels cannot be of type table (tables are stored in Table Labels)',
      );
    default:
      throw new TypesafeUnreachableError(field.type);
  }
};

/**
 * Function which determines if a table currently has a labeled value
 */
const tableHasLabeledValue = (table: TableLabelDto): boolean => {
  return table.rows.length > 0;
};

export const FieldsPanelUtils = {
  fieldHasLabeledValue,
  tableHasLabeledValue,
};
