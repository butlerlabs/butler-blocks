import { FieldsPanelUtils } from 'documentLabeler/components/fieldsPanel/util/FieldsPanelUtils';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import {
  FieldLabelDto,
  TableLabelDto,
} from 'common/types/DocumentLabelerTypes';

const textField = MockDocumentLabelerData.labels.fields[0];
const checkboxField = MockDocumentLabelerData.labels.fields[2];
const signatureField = MockDocumentLabelerData.labels.fields[3];

describe('fieldHasLabeledValue', () => {
  /** Text Field Tests */
  it('should return true for a field with blocks', () => {
    const output = FieldsPanelUtils.fieldHasLabeledValue(textField);
    expect(output).toBe(true);
  });
  it('should return true for a field with a selected region', () => {
    const regionLabeledTextField: FieldLabelDto = {
      ...textField,
      blocks: [],
      region: signatureField.region,
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      regionLabeledTextField,
    );
    expect(output).toBe(true);
  });
  it('should return true for a field with a text override', () => {
    const textOverrideTextField: FieldLabelDto = {
      ...textField,
      blocks: [],
      textOverride: 'overridden!',
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(textOverrideTextField);
    expect(output).toBe(true);
  });
  it('should return false for an unlabeled field', () => {
    const unlabeledTextField: FieldLabelDto = {
      ...textField,
      blocks: [],
      region: undefined,
      textOverride: undefined,
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(unlabeledTextField);
    expect(output).toBe(false);
  });
  /** Checkbox Field Tests */
  it('should return true for a field with blocks', () => {
    const output = FieldsPanelUtils.fieldHasLabeledValue(checkboxField);
    expect(output).toBe(true);
  });
  it('should return true for a field with a selected region', () => {
    const regionLabeledCheckboxField: FieldLabelDto = {
      ...checkboxField,
      blocks: [],
      region: signatureField.region,
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      regionLabeledCheckboxField,
    );
    expect(output).toBe(true);
  });
  it('should return true for a field with a text override', () => {
    const textOverrideCheckboxField: FieldLabelDto = {
      ...checkboxField,
      blocks: [],
      textOverride: 'overridden!',
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      textOverrideCheckboxField,
    );
    expect(output).toBe(true);
  });
  it('should return false for an unlabeled field', () => {
    const unlabeledCheckboxField: FieldLabelDto = {
      ...checkboxField,
      blocks: [],
      region: undefined,
      textOverride: undefined,
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      unlabeledCheckboxField,
    );
    expect(output).toBe(false);
  });
  /** Signature Field Tests */
  it('should return true for a field with a selected region', () => {
    const output = FieldsPanelUtils.fieldHasLabeledValue(signatureField);
    expect(output).toBe(true);
  });
  it('should return true for a field with a text override', () => {
    const textOverrideSignatureField: FieldLabelDto = {
      ...signatureField,
      region: undefined,
      textOverride: 'overridden!',
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      textOverrideSignatureField,
    );
    expect(output).toBe(true);
  });
  it('should return false for an unlabeled field', () => {
    const unlabeledSignatureField: FieldLabelDto = {
      ...signatureField,
      blocks: [],
      region: undefined,
      textOverride: undefined,
    };
    const output = FieldsPanelUtils.fieldHasLabeledValue(
      unlabeledSignatureField,
    );
    expect(output).toBe(false);
  });
});

const table = MockDocumentLabelerData.labels.tables[0];

describe('tableHasLabeledValue', () => {
  it('should return true for a table with rows', () => {
    const output = FieldsPanelUtils.tableHasLabeledValue(table);
    expect(output).toBe(true);
  });
  it('should return false for a table with no rows', () => {
    const unlabeledTable: TableLabelDto = {
      ...table,
      rows: [],
    };
    const output = FieldsPanelUtils.tableHasLabeledValue(unlabeledTable);
    expect(output).toBe(false);
  });
});
