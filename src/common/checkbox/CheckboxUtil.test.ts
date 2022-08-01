import { CheckboxUtil } from "common/checkbox/CheckboxUtil";

describe('generateCheckboxDisplayFromValue', () => {
  it('should display the correct value for a selected checkbox', () => {
    const input = 'SELECTED';
    const expectedOutput = 'Selected';
    expect(CheckboxUtil.generateCheckboxDisplayFromValue(input)).toBe(expectedOutput);
  });
  it('should display the correct value for an unselected checkbox', () => {
    const input = 'NOT_SELECTED';
    const expectedOutput = 'Not Selected';
    expect(CheckboxUtil.generateCheckboxDisplayFromValue(input)).toBe(expectedOutput);
  });
  it('should display the input value for an unrecognized string', () => {
    const input = 'Unexpected Input';
    expect(CheckboxUtil.generateCheckboxDisplayFromValue(input)).toBe(input);
  });
})