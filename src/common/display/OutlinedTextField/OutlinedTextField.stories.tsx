import React from 'react';
import { OutlinedTextField } from 'common/display/OutlinedTextField/OutlinedTextField';

export default {
  component: OutlinedTextField,
  title: 'Outlined Text Field',
  parameters: {
    fileName: __filename,
  },
};

export const Default = () => (
  <OutlinedTextField label="Outlined"></OutlinedTextField>
);

export const WithDefaultValue = () => (
  <OutlinedTextField
    label="With Default Value"
    defaultValue="Default Value"
  ></OutlinedTextField>
);

export const Small = () => (
  <OutlinedTextField label="Outlined" size="small"></OutlinedTextField>
);
