import { RectCoords } from 'common/documentV2/docLabelingPane/blockLayer/EndUserBlockRenderUtils';
import { GetRestApiMockData } from 'core/api/useApiInProvider/GetRestApiMockData.stories';
import {
  BoundingBoxDto,
  DocExBlockType,
  ModelFieldType,
} from 'generated/api/v0';
import {
  BlockUtils,
  CellColoredBlock,
  ColoredBlockType,
  FieldColoredBlock,
} from 'pages/modelDetails/components/TrainingTabView/DocumentLabeler/DocumentColoredBlockLayer/BlockUtils';
import { ModelDetailsMockData } from 'pages/modelDetails/ModelDetailsMockData.stories';
import { MockedModelDetailsState } from 'pages/modelDetails/state/MockModelDetailsState';
import {
  ActiveCellType,
  LabelingSelectionType,
  ModelDetailsInternalState,
} from 'pages/modelDetails/state/ModelDetailsState';
import { SelectedFieldType } from 'pages/modelDetails/utils/FieldUtils';
import { getColorFromColorSet } from 'utils/ColorUtils';

const mockPageHeights = [500, 400, 500, 300];
const mockWidth = 400;

const simpleRectangle: RectCoords = {
  start: {
    x: 100,
    y: 200,
  },
  end: {
    x: 300,
    y: 300,
  },
};

const simpleBoundingBox: BoundingBoxDto = {
  top: 0.4,
  left: 0.25,
  width: 0.5,
  height: 0.2,
  page: 0,
};

const page1Rectangle: RectCoords = {
  start: {
    x: 100,
    y: 700,
  },
  end: {
    x: 200,
    y: 900,
  },
};

const page1BoundingBox: BoundingBoxDto = {
  top: 0.5,
  left: 0.25,
  width: 0.25,
  height: 0.5,
  page: 1,
};

const backwardsRectangle: RectCoords = {
  start: {
    x: 300,
    y: 400,
  },
  end: {
    x: 100,
    y: 300,
  },
};

const backwardsBoundingBox: BoundingBoxDto = {
  top: 0.6,
  left: 0.25,
  width: 0.5,
  height: 0.2,
  page: 0,
};

const simpleBlock = {
  id: 'block1',
  blockType: DocExBlockType.Word,
  text: 'test',
  boundingBox: simpleBoundingBox,
  confidence: 1,
};

const fieldColoredBlock: FieldColoredBlock = {
  block: simpleBlock,
  color: getColorFromColorSet(0),
  sourceFieldId: 'field1',
};

const cellColoredBlock: CellColoredBlock = {
  block: simpleBlock,
  color: getColorFromColorSet(0),
  columnId: 'col1',
  rowId: 'row1',
  tableId: 'table1',
};

describe('getRegionFromRectangle', () => {
  it('should correctly convert simple rectangles', () => {
    const convertedBbx = BlockUtils.getRegionFromRectangle(
      simpleRectangle,
      mockWidth,
      mockPageHeights,
    );
    expect(convertedBbx).toMatchObject(simpleBoundingBox);
  });

  it('should correctly convert rectangles on not the first page', () => {
    const convertedBbx = BlockUtils.getRegionFromRectangle(
      page1Rectangle,
      mockWidth,
      mockPageHeights,
    );
    expect(convertedBbx).toMatchObject(page1BoundingBox);
  });

  it('should correctly convert simple rectangles', () => {
    const convertedBbx = BlockUtils.getRegionFromRectangle(
      backwardsRectangle,
      mockWidth,
      mockPageHeights,
    );
    expect(convertedBbx).toMatchObject(backwardsBoundingBox);
  });
});

describe('getFilteredUnhighlightedBlocks', () => {
  const wordBlocks = ModelDetailsMockData.staticDocumentDetails.wordBlocks;
  it('should display all word blocks with no selectedField', () => {
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      undefined,
      undefined,
      [],
      wordBlocks,
      LabelingSelectionType.Block,
    );
    expect(displayBlocks).toMatchObject(wordBlocks);
  });
  it('should display no word blocks when selection type is region', () => {
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      undefined,
      undefined,
      [],
      wordBlocks,
      LabelingSelectionType.Region,
    );
    expect(displayBlocks).toMatchObject([]);
  });
  it('should display no blocks with a signature field selected', () => {
    const selectedSignatureField: SelectedFieldType = {
      fieldId: 'signatureId',
      type: ModelFieldType.Signature,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedSignatureField,
      undefined,
      [],
      wordBlocks,
      LabelingSelectionType.Region,
    );
    expect(displayBlocks).toMatchObject([]);
  });
  it('should display only word blocks with a text field selected', () => {
    const selectedTextField: SelectedFieldType = {
      fieldId: 'textId',
      type: ModelFieldType.Text,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTextField,
      undefined,
      [],
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks.filter(
      (block) => block.blockType === DocExBlockType.Word,
    );
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should display only checkbox blocks with a checkbox field selected', () => {
    const selectedCheckboxField: SelectedFieldType = {
      fieldId: 'checkboxId',
      type: ModelFieldType.Checkbox,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedCheckboxField,
      undefined,
      [],
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks.filter(
      (block) => block.blockType === DocExBlockType.Checkbox,
    );
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should filter out blocks from an active text field', () => {
    const selectedTextField: SelectedFieldType = {
      fieldId: 'textId',
      type: ModelFieldType.Text,
    };
    // Define first two word blocks to be associated with selected text field
    const coloredBlocks: Array<ColoredBlockType> = wordBlocks
      .filter((block) => block.blockType === DocExBlockType.Word)
      .slice(0, 2)
      .map((block) => ({
        color: 'color',
        block: block,
        sourceFieldId: 'textId',
      }));
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTextField,
      undefined,
      coloredBlocks,
      wordBlocks,
      LabelingSelectionType.Block,
    );
    // expect display blocks to filter out first two blocks
    const expectedBlocks = wordBlocks
      .slice(2)
      .filter((block) => block.blockType !== DocExBlockType.Checkbox);
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should filter out blocks from an active table field', () => {
    const selectedTableField: SelectedFieldType = {
      fieldId: 'tableId',
      type: ModelFieldType.Table,
    };
    const activeCell: ActiveCellType = {
      tableId: 'tableId',
      rowId: 'rowId',
      columnId: 'columnId',
    };
    const coloredBlocks: Array<ColoredBlockType> = [
      ModelDetailsMockData.blockCell1,
    ].map((block) => ({
      color: 'cell',
      block: block,
      tableId: 'tableId',
      rowId: 'rowId',
      columnId: 'columnId',
    }));
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTableField,
      activeCell,
      coloredBlocks,
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks
      .filter((block) => block.id !== ModelDetailsMockData.blockCell1.id)
      .filter((block) => block.blockType !== DocExBlockType.Checkbox);
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
});

describe('getColoredBlockOpacity', () => {
  it('should return opacity 1 for field block', () => {
    const opacity = BlockUtils.getColoredBlockOpacity(fieldColoredBlock);
    expect(opacity).toBe(1);
  });

  it('should return opacity 1 for cell block if theres no active cell', () => {
    const opacity = BlockUtils.getColoredBlockOpacity(cellColoredBlock);
    expect(opacity).toBe(1);
  });

  it("should return opacity 1 for cell block if it's active cell's block", () => {
    const activeCell: ActiveCellType = {
      columnId: 'col1',
      rowId: 'row1',
      tableId: 'table1',
    };
    const opacity1 = BlockUtils.getColoredBlockOpacity(
      cellColoredBlock,
      activeCell,
    );
    expect(opacity1).toBe(1);

    // Check for blocks not associated with the activeCell
    activeCell.tableId = 'table2';

    const opacity2 = BlockUtils.getColoredBlockOpacity(
      cellColoredBlock,
      activeCell,
    );
    expect(opacity2).toBe(0.3);
  });
});

describe('sortBlocks', () => {
  it('should sort the blocks in correct order', () => {
    const blocks = ModelDetailsMockData.staticDocumentDetails.wordBlocks;

    const SORTED_BLOCK_RESULT = [
      blocks[0],
      blocks[1],
      blocks[5],
      blocks[4],
      blocks[2],
      blocks[3],
    ];

    const sortedBlocks = BlockUtils.sortBlocks(blocks);
    expect(sortedBlocks).toStrictEqual(SORTED_BLOCK_RESULT);
  });
});

const initialMockState = MockedModelDetailsState.generateMockedModelDetailsState();

const mockModelDetailsState: ModelDetailsInternalState = {
  ...initialMockState,
  getApiState: {
    ...initialMockState.getApiState,
    documentDetails: GetRestApiMockData.getLoadedMockData(
      ModelDetailsMockData.trainingDocumentDetails,
      { id: initialMockState.modelId, documentId: 'docId' },
    ),
    staticDocumentDetails: GetRestApiMockData.getLoadedMockData(
      ModelDetailsMockData.staticDocumentDetails,
      { id: initialMockState.modelId, documentId: 'docId' },
    ),
  },
};

describe('getRegionsToDisplay', () => {
  it('should return no regions if no regions are labeled', () => {
    const stateWithNoRegions: ModelDetailsInternalState = {
      ...mockModelDetailsState,
      getApiState: {
        ...mockModelDetailsState.getApiState,
        documentDetails: {
          ...mockModelDetailsState.getApiState.documentDetails,
          data: mockModelDetailsState.getApiState.documentDetails.data
            ? {
                ...mockModelDetailsState.getApiState.documentDetails.data,
                signatures: mockModelDetailsState.getApiState.documentDetails.data.signatures.map(
                  (sig) => ({ ...sig, region: undefined }),
                ),
              }
            : mockModelDetailsState.getApiState.documentDetails.data,
        },
      },
    };
    const regionsToDisplay = BlockUtils.getRegionsToDisplay(stateWithNoRegions);
    expect(regionsToDisplay).toMatchObject([]);
  });

  it('should return regions for signature fields with regions', () => {
    const regionsToDisplay = BlockUtils.getRegionsToDisplay(
      mockModelDetailsState,
    );
    expect(regionsToDisplay.length).toEqual(1);
    expect(regionsToDisplay[0].id).toEqual('field3');
  });

  it('should return regions for text fields and signature fields', () => {
    const stateWithSimpleFieldRegions: ModelDetailsInternalState = {
      ...mockModelDetailsState,
      getApiState: {
        ...mockModelDetailsState.getApiState,
        documentDetails: {
          ...mockModelDetailsState.getApiState.documentDetails,
          data: mockModelDetailsState.getApiState.documentDetails.data
            ? {
                ...mockModelDetailsState.getApiState.documentDetails.data,
                fields: mockModelDetailsState.getApiState.documentDetails.data.fields.map(
                  (field) => ({
                    ...field,
                    blocks: [],
                    // add a region to all simple fields
                    region: ModelDetailsMockData.blockCell1.boundingBox,
                  }),
                ),
              }
            : mockModelDetailsState.getApiState.documentDetails.data,
        },
      },
    };
    const regionsToDisplay = BlockUtils.getRegionsToDisplay(
      stateWithSimpleFieldRegions,
    );
    expect(regionsToDisplay.length).toEqual(4);
    expect(regionsToDisplay.map((region) => region.id)).toMatchObject([
      'textField1',
      'textField2',
      'field2',
      'field3',
    ]);
    // Should have four unique colors for four different fields
    expect(
      new Set(regionsToDisplay.map((region) => region.color)).size,
    ).toEqual(4);
  });

  it('should return regions for text fields, signature fields and table fields', () => {
    const stateWithTableAndFieldRegions: ModelDetailsInternalState = {
      ...mockModelDetailsState,
      getApiState: {
        ...mockModelDetailsState.getApiState,
        documentDetails: {
          ...mockModelDetailsState.getApiState.documentDetails,
          data: mockModelDetailsState.getApiState.documentDetails.data
            ? {
                ...mockModelDetailsState.getApiState.documentDetails.data,
                fields: mockModelDetailsState.getApiState.documentDetails.data.fields.map(
                  (field) => ({
                    ...field,
                    blocks: [],
                    // add a region to all simple fields
                    region: ModelDetailsMockData.blockCell1.boundingBox,
                  }),
                ),
                tables: mockModelDetailsState.getApiState.documentDetails.data.tables.map(
                  (table, tIdx) => ({
                    ...table,
                    rows: table.rows.map((row, rIdx) => ({
                      ...row,
                      cells: row.cells.map((cell, cIdx) => {
                        return tIdx === 0 && rIdx === 0 && cIdx === 0
                          ? {
                              ...cell,
                              blocks: [],
                              region:
                                ModelDetailsMockData.blockCell1.boundingBox,
                            }
                          : cell;
                      }),
                    })),
                  }),
                ),
              }
            : mockModelDetailsState.getApiState.documentDetails.data,
        },
      },
    };
    const regionsToDisplay = BlockUtils.getRegionsToDisplay(
      stateWithTableAndFieldRegions,
    );
    expect(regionsToDisplay.length).toEqual(5);
    expect(regionsToDisplay.map((region) => region.id)).toMatchObject([
      'textField1',
      'textField2',
      'field2',
      'field3',
      'table1col1row1',
    ]);
    // Should have five unique colors for five different fields
    expect(
      new Set(regionsToDisplay.map((region) => region.color)).size,
    ).toEqual(5);
  });
});
