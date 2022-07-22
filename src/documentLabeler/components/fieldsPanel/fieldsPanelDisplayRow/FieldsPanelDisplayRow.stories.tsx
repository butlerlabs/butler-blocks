import { FieldsPanelDisplayRow } from 'documentLabeler/components/fieldsPanel/fieldsPanelDisplayRow/FieldsPanelDisplayRow';
import React from 'react';

export default {
 component: FieldsPanelDisplayRow,
 title: 'FieldsPanelDisplayRow',
  parameters: {
   fileName: __filename,
 },
};

const defaultParams = {
  id: 'fieldId',
  name: 'Field Name',
  value: 'Field Value',
}

export const Default = () => <FieldsPanelDisplayRow {...defaultParams} />;
