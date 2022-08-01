import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import React from 'react';
 
export default {
 component: DocumentLabeler,
 title: 'DocumentLabeler', 
  parameters: {
   fileName: __filename,
 },
};

const onSaveCallback = (outputData: object) => null;
 
export const Default = () => 
  <DocumentLabeler 
    data={MockDocumentLabelerData.documentLabelerData} 
    onSaveCallback={onSaveCallback} 
  />;