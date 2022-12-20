import { action } from '@storybook/addon-actions';
import { BBConfigurationProvider } from 'documentLabeler/context/BBConfigurationProvider';
import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';

export default {
  component: DocumentLabeler,
  title: 'DocumentLabeler',
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
  <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
);
