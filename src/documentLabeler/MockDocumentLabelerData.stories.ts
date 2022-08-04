/**
 * This file contains mock data that can be used in storybook tests for the purposes of testing
 * the embedded document labeler
 */

import { DocumentLabelerData } from "documentLabeler/state/DocumentLabelerState";
import { BlockDto, BlockType, Confidence, FieldLabelDto, FieldType, LabelDto, MimeType, TableLabelDto } from "common/types/DocumentLabelerTypes";

const modelId = 'modelId';

const docId = 'docId';

const tempDocUrl =
  'https://matt-public-bucket.s3.amazonaws.com/productboard-berhgzumndn1jyt1apsq7wey-1.pdf';

const fileName = 'ExampleInvoice.pdf';

const mimeType = MimeType.Pdf;

const block1: BlockDto = {
  id: 'block1',
  blockType: BlockType.Word,
  text: 'ATS Automation Tooling Systems Inc.',
  boundingBox: {
    width: 0.4507841944694519,
    height: 0.016953490674495697,
    left: 0.25676061391830444,
    top: 0.02902370023727417,
    page: 0,
  },
};

const block2: BlockDto = {
  id: 'block2',
  blockType:  BlockType.Word,
  text: '27-Apr-2018',
  boundingBox: {
    width: 0.1307841944694519,
    height: 0.013953490674495697,
    left: 0.06676061391830444,
    top: 0.28102370023727417,
    page: 0,
  },
};

const block3: BlockDto = {
  id: 'block3',

  blockType: BlockType.Word,
  text: '$59.00',
  boundingBox: {
    left: 0.72676061391830444,
    top: 0.45102370023727417,
    width: 0.0907841944694519,
    height: 0.016953490674495697,
    page: 0,
  },
};

const checkboxBlock: BlockDto = {
  id: 'block4',
  blockType: BlockType.Checkbox,
  text: 'Selected',
  boundingBox: {
    left: 0.55676061391830444,
    top: 0.48502370023727417,
    width: 0.0407841944694519,
    height: 0.016953490674495697,
    page: 0,
  },
};

const blockCell1: BlockDto = {
  id: 'blockCell1',
  blockType:  BlockType.Word,
  text: '$59.00',
  boundingBox: {
    left: 0.74676061391830444,
    top: 0.37102370023727417,
    width: 0.0707841944694519,
    height: 0.016953490674495697,
    page: 0,
  },
};

const blockCell2: BlockDto = {
  id: 'blockCell2',
  blockType:  BlockType.Word,
  text: '1 x individual - per user monthly plan',
  boundingBox: {
    left: 0.07676061391830444,
    top: 0.37102370023727417,
    width: 0.2907841944694519,
    height: 0.016953490674495697,
    page: 0,
  },
};

const textField1: FieldLabelDto = {
  id: 'textField1',
  name: 'Brand',
  type: FieldType.Text,
  confidenceScore: Confidence.High,
  blocks: [block1],
};

const textField2: FieldLabelDto = {
  id: 'textField2',
  name: 'Date',
  type: FieldType.Text,
  confidenceScore: Confidence.Low,
  blocks: [block2],
};

const checkboxField: FieldLabelDto = {
  id: 'field2',
  name: 'isPaid',
  type: FieldType.Checkbox,
  confidenceScore: Confidence.High,

  blocks: [checkboxBlock],
};

const signatureField: FieldLabelDto = {
  id: 'field3',
  name: 'Sign',
  type: FieldType.Signature,
  confidenceScore: Confidence.High,
  blocks: [],
  region: {
    left: 0.71676061391830444,
    top: 0.78102370023727417,
    width: 0.1287841944694519,
    height: 0.076953490674495697,
    page: 0,
  },
};

const tableField1: TableLabelDto = {
  id: 'table1',
  name: 'purchases',
  confidenceScore: Confidence.High,
  columns: [
    {
      id: 'col1',
      name: 'Item',
    },
    {
      id: 'col2',
      name: 'Price',
    },
  ],
  rows: [
    {
      id: 'row1',
      cells: [
        {
          columnId: 'col1',
          confidenceScore: Confidence.High,
          blocks: [],
        },
        {
          columnId: 'col2',
          confidenceScore: Confidence.Low,
          blocks: [],
        },
      ],
    },
  ],
};

const wordBlocks: Array<BlockDto> = [block1, block2, block3, checkboxBlock, blockCell1, blockCell2];

const labels: LabelDto = {
  fields: [textField1, textField2, checkboxField, signatureField],
  tables: [tableField1],
};

const documentLabelerData: DocumentLabelerData = {
  modelId,
  docId,
  tempDocUrl,
  fileName,
  mimeType,
  wordBlocks,
  results: labels,
}


export const MockDocumentLabelerData = {
  modelId,
  docId,
  tempDocUrl,
  fileName,
  mimeType,
  wordBlocks,
  labels,
  documentLabelerData,
};
