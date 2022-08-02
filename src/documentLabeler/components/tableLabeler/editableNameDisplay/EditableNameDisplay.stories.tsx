import { action } from '@storybook/addon-actions';
import { EditableNameDisplay } from 'documentLabeler/components/tableLabeler/editableNameDisplay/EditableNameDisplay';
import React from 'react';

export default {
  component: EditableNameDisplay,
  title: 'Editable Name Display',
  parameters: {
    fileName: __filename,
  },
};

export const Default = () => (
  <div style={{ width: '500px' }}>
    <EditableNameDisplay
      name="Total Amount"
      label="Field Name"
      onSave={action('Save')}
    />
  </div>
);
