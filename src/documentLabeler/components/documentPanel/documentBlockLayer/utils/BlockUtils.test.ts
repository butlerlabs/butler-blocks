import { ColorUtils } from "documentLabeler/color/ColorUtils";
import { BlockUtils, CellColoredBlock, ColoredBlockType, FieldColoredBlock } from "documentLabeler/components/documentPanel/documentBlockLayer/utils/BlockUtils";
import { RectCoords } from "documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils";
import { MockDocumentLabelerData } from "documentLabeler/MockDocumentLabelerData.stories";
import { ActiveCell, ActiveField, LabelingSelectionType } from "documentLabeler/state/DocumentLabelerState";
import { BlockType, BoundingBoxDto, FieldType } from "common/types/DocumentLabelerTypes";

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
  blockType: BlockType.Word,
  text: 'test',
  boundingBox: simpleBoundingBox,
  confidence: 1,
};

const fieldColoredBlock: FieldColoredBlock = {
  block: simpleBlock,
  color: ColorUtils.getColorFromColorSet(0),
  sourceFieldId: 'field1',
  sourceFieldType: FieldType.Text,
};

const cellColoredBlock: CellColoredBlock = {
  block: simpleBlock,
  color: ColorUtils.getColorFromColorSet(0),
  columnId: 'col1',
  rowId: 'row1',
  tableId: 'table1',
  sourceFieldType: FieldType.Table,
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
  const wordBlocks = MockDocumentLabelerData.wordBlocks;
  it('should display all word blocks with no selectedField', () => {
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
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
      [],
      wordBlocks,
      LabelingSelectionType.Region,
    );
    expect(displayBlocks).toMatchObject([]);
  });
  it('should display no blocks with a signature field selected', () => {
    const selectedSignatureField: ActiveField = {
      id: 'signatureId',
      type: FieldType.Signature,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedSignatureField,
      [],
      wordBlocks,
      LabelingSelectionType.Region,
    );
    expect(displayBlocks).toMatchObject([]);
  });
  it('should display only word blocks with a text field selected', () => {
    const selectedTextField: ActiveField = {
      id: 'textId',
      type: FieldType.Text,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTextField,
      [],
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks.filter(
      (block) => block.blockType === BlockType.Word,
    );
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should display only checkbox blocks with a checkbox field selected', () => {
    const selectedCheckboxField: ActiveField = {
      id: 'checkboxId',
      type: FieldType.Checkbox,
    };
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedCheckboxField,
      [],
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks.filter(
      (block) => block.blockType === BlockType.Checkbox,
    );
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should filter out blocks from an active text field', () => {
    const selectedTextField: ActiveField = {
      id: 'textId',
      type: FieldType.Text,
    };
    // Define first two word blocks to be associated with selected text field
    const coloredBlocks: Array<ColoredBlockType> = wordBlocks
      .filter((block) => block.blockType === BlockType.Word)
      .slice(0, 2)
      .map((block) => ({
        color: 'color',
        block: block,
        sourceFieldId: 'textId',
        sourceFieldType: FieldType.Text,
      }));
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTextField,
      coloredBlocks,
      wordBlocks,
      LabelingSelectionType.Block,
    );
    // expect display blocks to filter out first two blocks
    const expectedBlocks = wordBlocks
      .slice(2)
      .filter((block) => block.blockType !== BlockType.Checkbox);
    expect(displayBlocks).toMatchObject(expectedBlocks);
  });
  it('should filter out blocks from an active table field', () => {
    const selectedTableField: ActiveField = {
      id: 'tableId',
      type: FieldType.Table,
      activeCell: {
        rowId: 'rowId',
        columnId: 'columnId',
      },
    };
    const coloredBlocks: Array<ColoredBlockType> = [
      MockDocumentLabelerData.wordBlocks[4],
    ].map((block) => ({
      color: 'cell',
      block: block,
      tableId: 'tableId',
      rowId: 'rowId',
      columnId: 'columnId',
      sourceFieldType: FieldType.Table,
    }));
    const displayBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
      selectedTableField,
      coloredBlocks,
      wordBlocks,
      LabelingSelectionType.Block,
    );
    const expectedBlocks = wordBlocks
      .filter((block) => block.id !== MockDocumentLabelerData.wordBlocks[4].id)
      .filter((block) => block.blockType !== BlockType.Checkbox);
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
    const selectedTableField = {
      id: 'tableId',
      type: FieldType.Table,
      activeCell: {
        rowId: 'rowId',
        columnId: 'columnId',
      },
    };
    const opacity1 = BlockUtils.getColoredBlockOpacity(
      cellColoredBlock,
      selectedTableField,
    );
    expect(opacity1).toBe(1);

    // Check for blocks not associated with the activeCell
    selectedTableField.id = 'table2';

    const opacity2 = BlockUtils.getColoredBlockOpacity(
      cellColoredBlock,
      selectedTableField,
    );
    expect(opacity2).toBe(0.3);
  });
});

describe('sortBlocks', () => {
  it('should sort the blocks in correct order', () => {
    const blocks = MockDocumentLabelerData.wordBlocks;

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

