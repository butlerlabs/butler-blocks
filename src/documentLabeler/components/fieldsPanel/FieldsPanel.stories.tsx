import { FieldsPanel } from "documentLabeler/components/fieldsPanel/FieldsPanel";
import { MockDocumentLabelerProvider } from "documentLabeler/MockDocumentLabelerProvider.stories";

export default {
  component: FieldsPanel,
  title: 'FieldsPanel',
  parameters: {
   fileName: __filename,
 },
 decorators: [
  (Story: React.FC): React.ReactElement => (
    <div style={{width: '360px'}}>
      <Story />
    </div>
  ),
],
};

export const Default = () => (
  <MockDocumentLabelerProvider>
    <FieldsPanel />
  </MockDocumentLabelerProvider>
);