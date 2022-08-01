// Possible Display values for checkbox fields
enum CheckboxDisplayValue {
  Selected = 'Selected',
  NotSelected = 'Not Selected',
}

// Converts API checkbox values to human readable display
const generateCheckboxDisplayFromValue = (value: string): string => {
  if (value === 'SELECTED') {
    return CheckboxDisplayValue.Selected;
  } else if (value === 'NOT_SELECTED') {
    return CheckboxDisplayValue.NotSelected;
  } else {
    return value;
  }
};

export const CheckboxUtil = {
  generateCheckboxDisplayFromValue,
};
