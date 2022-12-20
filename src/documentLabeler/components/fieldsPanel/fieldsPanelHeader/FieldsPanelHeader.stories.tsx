import { action } from '@storybook/addon-actions';
import { FieldsPanelHeader } from 'documentLabeler/components/fieldsPanel/fieldsPanelHeader/FieldsPanelHeader';
import { BBConfigurationProvider } from 'documentLabeler/context/BBConfigurationProvider';
import { MockDocumentLabelerProvider } from 'documentLabeler/MockDocumentLabelerProvider.stories';
import React from 'react';

export default {
  component: FieldsPanelHeader,
  title: 'FieldsPanelHeader',
  parameters: {
    fileName: __filename,
  },
  decorators: [
    (Story: React.FC) => (
      <BBConfigurationProvider
        config={{
          onSaveCallback: action('onSaveCallback'),
        }}
      >
        <Story />
      </BBConfigurationProvider>
    ),
  ],
};

export const Default = () => (
  <div style={{ width: '360px' }}>
    <MockDocumentLabelerProvider>
      <FieldsPanelHeader />
    </MockDocumentLabelerProvider>
  </div>
);
