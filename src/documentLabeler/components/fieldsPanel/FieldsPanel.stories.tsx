import { action } from '@storybook/addon-actions';
import { FieldsPanel } from 'documentLabeler/components/fieldsPanel/FieldsPanel';
import { BBConfigurationProvider } from 'documentLabeler/context/BBConfigurationProvider';
import { MockDocumentLabelerProvider } from 'documentLabeler/MockDocumentLabelerProvider.stories';

export default {
  component: FieldsPanel,
  title: 'FieldsPanel',
  parameters: {
    fileName: __filename,
  },
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <div style={{ width: '360px' }}>
        <BBConfigurationProvider
          config={{
            onSaveCallback: action('onSaveCallback'),
          }}
        >
          <Story />
        </BBConfigurationProvider>
      </div>
    ),
  ],
};

export const Default = () => (
  <MockDocumentLabelerProvider>
    <FieldsPanel />
  </MockDocumentLabelerProvider>
);
