import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';

export default {
  component: DocumentLabeler,
  title: 'DocumentLabeler',
  parameters: {
    fileName: __filename,
  },
};

export const Default = () => (
  <DocumentLabeler data={MockDocumentLabelerData.documentLabelerData} />
);
