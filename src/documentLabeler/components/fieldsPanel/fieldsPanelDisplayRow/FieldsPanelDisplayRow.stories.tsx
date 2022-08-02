import { Card } from '@material-ui/core';
import { ButlerColorPalette } from 'common/theme/color';
import { FieldsPanelDisplayRow } from 'documentLabeler/components/fieldsPanel/fieldsPanelDisplayRow/FieldsPanelDisplayRow';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import { MockDocumentLabelerProvider } from 'documentLabeler/MockDocumentLabelerProvider.stories';
import { DocumentLabelerInternalState, LabelingSelectionType } from 'documentLabeler/state/DocumentLabelerState';
import { FieldType } from 'documentLabeler/types/DocumentLabelerTypes';
import React from 'react';

export default {
  component: FieldsPanelDisplayRow,
  title: 'FieldsPanelDisplayRow',
  parameters: {
   fileName: __filename,
 },
 decorators: [
  (Story: React.FC): React.ReactElement => (
    <div style={{width: '360px'}}>
      <Card>
        <Story />
      </Card>
    </div>
  ),
],
};

const defaultParams = {
  id: 'fieldId',
  name: 'Account Number',
  value: '1048151768',
  type: FieldType.Text,
  color: ButlerColorPalette.primary.main,
}

export const Default = () => (
    <MockDocumentLabelerProvider>
      <FieldsPanelDisplayRow {...defaultParams} />
    </MockDocumentLabelerProvider>
);

const selectedState: DocumentLabelerInternalState = {
  docInfo: MockDocumentLabelerData.documentLabelerData,
  localState: {
    activeField: {
      id: 'fieldId',
      type: FieldType.Text,
    },
    selectionType: LabelingSelectionType.Block,
  },
  onSaveCallback: (outputData: object) => null,
}

export const Selected = () => (
  <MockDocumentLabelerProvider internalState={selectedState}>
    <FieldsPanelDisplayRow {...defaultParams} />
  </MockDocumentLabelerProvider>
);

const longNameParams = {
  ...defaultParams,
  name: 'Account Nuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuumber',
}

export const LongName = () => (
  <MockDocumentLabelerProvider>
    <FieldsPanelDisplayRow {...longNameParams} />
  </MockDocumentLabelerProvider>
);

const longValueParams = {
  ...defaultParams,
  value: '1000000000000000000000000000000000000000000000000000048151768',
}

export const LongValue = () => (
  <MockDocumentLabelerProvider>
    <FieldsPanelDisplayRow {...longValueParams} />
  </MockDocumentLabelerProvider>
);
