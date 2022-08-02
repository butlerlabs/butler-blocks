import { CheckboxUtil } from "common/checkbox/CheckboxUtil";
import { TypesafeUnreachableError } from "common/util/error";
import { DocumentLabelerConstants } from "documentLabeler/constants/DocumentLabelerConstants";
import { BlockType, CellLabelDto, FieldLabelDto, FieldType, TableLabelDto } from "common/types/DocumentLabelerTypes";
import pluralize from "pluralize";

const getCheckboxFieldDisplay = (field: FieldLabelDto) => {
  const firstCheckboxBox = field.blocks.find(
    (result) => result.blockType === BlockType.Checkbox,
  );
  const hasRegion = Boolean(field.region);
  return firstCheckboxBox === undefined
    ? hasRegion
      ? DocumentLabelerConstants.REGION_SELECTED
      : DocumentLabelerConstants.EMPTY
    : CheckboxUtil.generateCheckboxDisplayFromValue(firstCheckboxBox.text);
};

const getTextFieldDisplay = (field: FieldLabelDto) => {
  const hasBlocks = field.blocks.length > 0;
  const hasRegion = Boolean(field.region);
  return hasBlocks
    ? field.blocks.map((block) => block.text).join(' ')
    : hasRegion
    ? DocumentLabelerConstants.REGION_SELECTED
    : DocumentLabelerConstants.EMPTY;
};

/**
 * Returns the display value for the field given its type
 * @param field
 * @returns
 */
const getTextValueFromField = (field: FieldLabelDto): string => {
  if (field.textOverride) {
    return field.textOverride;
  }
  switch (field.type) {
    case FieldType.Text:
      return getTextFieldDisplay(field);
    case FieldType.Checkbox:
      return getCheckboxFieldDisplay(field);
    case FieldType.Signature:
      return field.region ?
        DocumentLabelerConstants.REGION_SELECTED :
        DocumentLabelerConstants.EMPTY;
    case FieldType.Table:
      throw new Error('Field Labels cannot be of type table (tables are stored in Table Labels)');
    default:
      throw new TypesafeUnreachableError(field.type);
  }
};

const getTextValueFromCell = (cell: CellLabelDto): string =>
  cell.textOverride
    ? cell.textOverride
    : cell.region
      ? DocumentLabelerConstants.REGION_SELECTED
      : cell.blocks.map((block) => block.text).join(' ');

/**
 * Returns the text value from a table to display in the fields panel
 * @param field
 * @returns
 */
const getTextValueFromTable = (field: TableLabelDto) =>
  `${pluralize('row', field.rows.length, true)}`;

export const FieldsPanelDisplayUtils = {
  getTextValueFromField,
  getTextValueFromTable,
  getTextValueFromCell,
};
