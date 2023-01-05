import { DocumentLabelerConstants } from 'documentLabeler/constants/DocumentLabelerConstants';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import {
  FieldLabelDto,
  TableLabelDto,
} from 'common/types/DocumentLabelerTypes';
import { FieldsPanelDisplayUtils } from 'documentLabeler/common/util/FieldsPanelDisplayUtils';

const textField = MockDocumentLabelerData.labels.fields[0];
const checkboxField = MockDocumentLabelerData.labels.fields[2];
const signatureField = MockDocumentLabelerData.labels.fields[3];

describe('getTextValueFromField', () => {
  /** Text Field Tests */
  it('should return the text override value if a text override is specified for text field', () => {
    const override = 'Override';
    const field: FieldLabelDto = {
      ...textField,
      textOverride: override,
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(override);
  });

  it('should return the joined blocks text if blocks are specified', () => {
    const expectedOutput = 'ATS Automation Tooling Systems Inc. 27-Apr-2018';
    const field: FieldLabelDto = {
      ...textField,
      blocks: [
        MockDocumentLabelerData.wordBlocks[0],
        MockDocumentLabelerData.wordBlocks[1],
      ],
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });

  it('should return the region selected string if a region is specified', () => {
    const expectedOutput = DocumentLabelerConstants.REGION_SELECTED;
    const field: FieldLabelDto = {
      ...textField,
      blocks: [],
      region: signatureField.region,
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });

  it('should return empty for an unlabeled field', () => {
    const expectedOutput = DocumentLabelerConstants.EMPTY;
    const field: FieldLabelDto = {
      ...textField,
      blocks: [],
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });

  /** Checkbox Field Tests */
  it('should return the text override value if a text override is specified for checkbox', () => {
    const override = 'Override';
    const field: FieldLabelDto = {
      ...checkboxField,
      textOverride: override,
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(override);
  });

  it('should return selected if the first checkbox block is selected', () => {
    const expectedOutput = 'Selected';
    const output = FieldsPanelDisplayUtils.getTextValueFromField(checkboxField);
    expect(output).toBe(expectedOutput);
  });

  it('should return not selected if the first checkbox block is not selected', () => {
    const expectedOutput = 'Not Selected';
    const field: FieldLabelDto = {
      ...checkboxField,
      blocks: [
        {
          ...checkboxField.blocks[0],
          text: 'NOT_SELECTED',
        },
      ],
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });
  it('should return empty for an unlabeled checkbox field', () => {
    const expectedOutput = DocumentLabelerConstants.EMPTY;
    const field: FieldLabelDto = {
      ...checkboxField,
      blocks: [],
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });

  /** Signature Field Tests */
  it('should return the text override value if a text override is specified for signature', () => {
    const override = 'Override';
    const field: FieldLabelDto = {
      ...signatureField,
      textOverride: override,
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(override);
  });

  it('should return region selected if a region is selected', () => {
    const expectedOutput = DocumentLabelerConstants.REGION_SELECTED;
    const output =
      FieldsPanelDisplayUtils.getTextValueFromField(signatureField);
    expect(output).toBe(expectedOutput);
  });

  it('should return empty for an unlabeled signature field', () => {
    const expectedOutput = DocumentLabelerConstants.EMPTY;
    const field: FieldLabelDto = {
      ...signatureField,
      region: undefined,
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromField(field);
    expect(output).toBe(expectedOutput);
  });
});

const table = MockDocumentLabelerData.labels.tables[0];

describe('getTextValueFromTable', () => {
  it('should work correctly for 0 rows', () => {
    const expectedOutput = '0 rows';
    const updatedTable: TableLabelDto = {
      ...table,
      rows: [],
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromTable(updatedTable);
    expect(output).toBe(expectedOutput);
  });

  it('should work correctly for 1 row', () => {
    const expectedOutput = '1 row';
    const output = FieldsPanelDisplayUtils.getTextValueFromTable(table);
    expect(output).toBe(expectedOutput);
  });

  it('should work correctly for many rows', () => {
    const expectedOutput = '5 rows';
    const updatedTable: TableLabelDto = {
      ...table,
      rows: Array(5).map(() => table.rows[0]),
    };
    const output = FieldsPanelDisplayUtils.getTextValueFromTable(updatedTable);
    expect(output).toBe(expectedOutput);
  });
});
