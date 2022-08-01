import { FieldsPanelHeader } from 'documentLabeler/components/fieldsPanel/fieldsPanelHeader/FieldsPanelHeader';
import { MockDocumentLabelerProvider } from 'documentLabeler/MockDocumentLabelerProvider.stories';
import React from 'react';
 
export default {
 component: FieldsPanelHeader,
 title: 'FieldsPanelHeader', 
  parameters: {
   fileName: __filename,
 },
 
};
 
export const Default = () => (
  <div style={{width: '360px'}}>
    <MockDocumentLabelerProvider>
      <FieldsPanelHeader />
    </MockDocumentLabelerProvider>
  </div>
);