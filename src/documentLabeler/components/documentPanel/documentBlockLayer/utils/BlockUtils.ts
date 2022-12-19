import {
  EndUserBlockRenderUtils,
  RectCoords,
} from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';
import {
  ActiveField,
  DocumentLabelerInternalState,
  LabelingSelectionType,
} from 'documentLabeler/state/DocumentLabelerState';
import {
  BlockDto,
  BlockType,
  BoundingBoxDto,
  FieldType,
} from 'common/types/DocumentLabelerTypes';

export type FieldColoredBlock = {
  color: string;
  block: BlockDto;
  sourceFieldId: string;
  sourceFieldType: FieldType;
};

export type CellColoredBlock = {
  color: string;
  block: BlockDto;
  tableId: string;
  rowId: string;
  columnId: string;
  sourceFieldType: FieldType.Table;
};

export type ColoredBlockType = FieldColoredBlock | CellColoredBlock;

type RegionFieldColoredBlock = {
  id: string;
  color: string;
  region: BoundingBoxDto;
  sourceFieldId: string;
  sourceFieldType: FieldType;
};

type RegionCellColoredBlock = RegionFieldColoredBlock & {
  tableId: string;
  rowId: string;
  columnId: string;
};

export type RegionColoredBlock =
  | RegionFieldColoredBlock
  | RegionCellColoredBlock;

// Returns true if given label is associated with Field of type Text or Checkbox
const isTextOrCheckBoxBlock = (
  block: ColoredBlockType,
): block is FieldColoredBlock =>
  (block as FieldColoredBlock).sourceFieldId !== undefined;

// Returns true if given label is associated with Table cell
const isCellLabel = (
  block: ColoredBlockType | RegionColoredBlock,
): block is CellColoredBlock =>
  (block as CellColoredBlock).tableId !== undefined;

// Converts a rectangle generated in the UI doc displayer into a
// bounding box that can be saved to the backend
const getRegionFromRectangle = (
  rectangle: RectCoords,
  pageWidth: number,
  docPageHeights: Array<number>,
): BoundingBoxDto => {
  const { minX, maxX, minY, maxY } =
    EndUserBlockRenderUtils.toMinMax(rectangle);

  // Increase page number until the Cumulative height of pages before
  // this page is greater than the beginning of the region
  let labelingPageIdx = 0;
  let pageHeightSum = 0;
  while (pageHeightSum + docPageHeights[labelingPageIdx] < minY) {
    pageHeightSum += docPageHeights[labelingPageIdx];
    labelingPageIdx += 1;
  }

  const currentPageHeight = docPageHeights[labelingPageIdx];

  // scale down pixels by current page dimensions
  return {
    left: minX / pageWidth,
    top: (minY - pageHeightSum) / currentPageHeight,
    width: (maxX - minX) / pageWidth,
    height: (maxY - minY) / currentPageHeight,
    page: labelingPageIdx,
  };
};

const getColoredRegions = (
  state: DocumentLabelerInternalState,
): Array<RegionColoredBlock> => {
  const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(
    state.docInfo,
  );

  const simpleRegionsToDisplay: Array<RegionColoredBlock> = fields
    .filter(
      // Only display selected field region if a selected field exists
      (field) =>
        !state.localState.activeField ||
        field.info.id === state.localState.activeField.id,
    )
    .filter((field) => field.info.region !== undefined)
    .map((field) => ({
      id: field.info.id,
      color: field.color,
      // safe type cast as we literally filtered out the undefined regions above
      region: field.info.region as BoundingBoxDto,
      sourceFieldId: field.info.id,
      sourceFieldType: field.info.type,
    }));

  const tableRegionsToDisplay = tables
    .filter(
      // Only display selected field region if a selected field exists
      (table) =>
        !state.localState.activeField ||
        table.info.id === state.localState.activeField.id,
    )
    // convert each table into a flat array of their cells
    .map((table) =>
      table.info.rows.flatMap((tableRow) =>
        tableRow.cells.flatMap((cell) => ({
          id: `${table.info.id}${cell.columnId}${tableRow.id}`,
          sourceFieldId: table.info.id,
          tableId: table.info.id,
          columnId: cell.columnId,
          rowId: tableRow.id,
          color: table.color,
          region: cell.region,
          sourceFieldType: FieldType.Table,
        })),
      ),
    )
    .map((flatTableCells) =>
      flatTableCells.filter((cell) => cell.region !== undefined),
    )
    .flatMap((flatTableCells) =>
      flatTableCells.map((cell) => ({
        ...cell,
        region: cell.region as BoundingBoxDto,
      })),
    );

  return simpleRegionsToDisplay.concat(tableRegionsToDisplay);
};

const getColoredRegionsToDisplay = (
  state: DocumentLabelerInternalState,
  regions: Array<RegionColoredBlock>,
): Array<RegionColoredBlock> => {
  return regions.filter((region) => {
    if (state.localState.activeField) {
      return region.sourceFieldId === state.localState.activeField.id;
    } else {
      return true;
    }
  });
};

const getColoredBlocks = (
  state: DocumentLabelerInternalState,
): Array<ColoredBlockType> => {
  const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(
    state.docInfo,
  );

  const fieldColoredBlocks: Array<ColoredBlockType> = fields.flatMap((field) =>
    field.info.blocks.map((block) => ({
      color: field.color,
      block,
      sourceFieldId: field.info.id,
      sourceFieldType: field.info.type,
    })),
  );

  const tableCellColoredBlocks: Array<ColoredBlockType> = tables.flatMap(
    (table) =>
      table.info.rows.flatMap((row) =>
        row.cells.flatMap((cell) =>
          cell.blocks.map((block) => ({
            color: table.color,
            block,
            tableId: table.info.id,
            rowId: row.id,
            columnId: cell.columnId,
            sourceFieldType: FieldType.Table,
          })),
        ),
      ),
  );

  return fieldColoredBlocks.concat(tableCellColoredBlocks);
};

const getColoredBlocksToDisplay = (
  state: DocumentLabelerInternalState,
  coloredBlocks: Array<ColoredBlockType>,
): Array<ColoredBlockType> => {
  return coloredBlocks.filter((block) => {
    if (state.localState.activeField) {
      if (BlockUtils.isTextOrCheckBoxBlock(block)) {
        return block.sourceFieldId === state.localState.activeField.id;
      } else if (BlockUtils.isCellLabel(block)) {
        return block.tableId === state.localState.activeField.id;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
};

const getFilteredUnhighlightedBlocks = (
  selectedField: ActiveField | undefined,
  coloredBlocks: Array<ColoredBlockType>,
  wordBlocks: Array<BlockDto>,
  selectionType: LabelingSelectionType,
): Array<BlockDto> => {
  if (
    selectionType === LabelingSelectionType.Region ||
    (selectedField && selectedField.type === FieldType.Signature)
  )
    return [];

  const isTextFieldSelected =
    selectedField && selectedField.type === FieldType.Text;
  const isTableFieldSelected =
    selectedField && selectedField.type === FieldType.Table;

  // Filter out the word blocks of selected Field
  const filteredColoredBlocks = coloredBlocks.filter((block) => {
    if (isTextFieldSelected && block.block.blockType === BlockType.Word) {
      const fieldId = BlockUtils.isTextOrCheckBoxBlock(block)
        ? block.sourceFieldId
        : block.tableId;
      return fieldId === selectedField?.id;
    } else if (isTableFieldSelected) {
      if (BlockUtils.isCellLabel(block)) {
        return (
          block.columnId === selectedField.activeCell?.columnId &&
          block.rowId === selectedField.activeCell.rowId &&
          block.tableId === selectedField.id
        );
      }
      return false;
    } else {
      return true;
    }
  });

  // Filter out the already labeled blocks except Word block of selected field
  return wordBlocks
    .filter(
      (block) =>
        !filteredColoredBlocks.find(
          (coloredBlock) => coloredBlock.block.id === block.id,
        ),
    )
    .filter((block) => {
      if (selectedField && selectedField.type === FieldType.Checkbox) {
        return block.blockType === BlockType.Checkbox;
      } else if (
        selectedField &&
        (selectedField.type === FieldType.Text ||
          selectedField.type === FieldType.Table)
      ) {
        return block.blockType !== BlockType.Checkbox;
      } else {
        return true;
      }
    });
};

// Returns true if given the colored block is associated with the active cell
const isActiveCellBlock = (
  coloredBlock: CellColoredBlock,
  selectedField?: ActiveField,
): boolean => {
  if (
    selectedField &&
    selectedField.type === FieldType.Table &&
    selectedField.activeCell
  ) {
    return (
      coloredBlock.tableId === selectedField.id &&
      coloredBlock.columnId === selectedField.activeCell.columnId &&
      coloredBlock.rowId === selectedField.activeCell.rowId
    );
  } else {
    return false;
  }
};

/**
 * Returns the opacity for colored block based on these cases
 * 1. Return 1 if coloredBlock is associated with the field not cell
 * 2. Return 1 if coloredBlock is associated with the cell but there's no active cell selected
 * 3. Return 1 if coloredBlock is associated with the cell and it's direct associated with active cell
 * 4. Else Return 0.3
 * @param coloredBlock
 * @param activeCell
 * @returns
 */
const getColoredBlockOpacity = (
  coloredBlock: ColoredBlockType | RegionColoredBlock,
  selectedField?: ActiveField,
): number => {
  return selectedField &&
    isCellLabel(coloredBlock) &&
    !isActiveCellBlock(coloredBlock, selectedField)
    ? 0.3
    : 1;
};

/**
 * Returns the sorted blocks as they appear on the document
 * @param blocks
 * @returns
 */
const sortBlocks = (blocks: Array<BlockDto>): Array<BlockDto> => {
  return [...blocks].sort((A, B) => {
    const a = { ...A.boundingBox };
    const b = { ...B.boundingBox };

    a.top = a.top + a.page;
    b.top = b.top + b.page;

    const maxBlockHeight = Math.max(a.height, b.height);
    const topDiff = Math.abs(a.top - b.top);
    const isInSingleLine = topDiff <= maxBlockHeight / 2;
    if (isInSingleLine) {
      if (a.left < b.left) {
        return -1;
      } else if (a.left > b.left) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (a.top > b.top) {
        return 1;
      } else if (a.top < b.top) {
        return -1;
      } else {
        return 0;
      }
    }
  });
};

const getActiveRegion = (
  state: DocumentLabelerInternalState,
  regionsToDisplay: Array<RegionColoredBlock>,
): BoundingBoxDto | undefined => {
  if (!state.localState.activeField) return undefined;
  if (state.localState.activeField.type === FieldType.Table) {
    // cannot label a table region with no active cell
    if (!state.localState.activeField.activeCell) return undefined;

    const { cell } = DocumentLabelerReducerUtils.getCellInfoFromTable(
      DocumentLabelerReducerUtils.getSelectedTable(state),
      state.localState.activeField.activeCell,
    );
    if (!cell) {
      throw new Error('Cannot find active cell');
    }
    return cell.region;
  } else {
    return regionsToDisplay[0]?.region;
  }
};

export const BlockUtils = {
  isTextOrCheckBoxBlock,
  isCellLabel,
  isActiveCellBlock,
  getColoredBlockOpacity,
  sortBlocks,
  getRegionFromRectangle,
  getColoredRegions,
  getColoredRegionsToDisplay,
  getColoredBlocks,
  getColoredBlocksToDisplay,
  getFilteredUnhighlightedBlocks,
  getActiveRegion,
};
