import { Box, makeStyles } from "@material-ui/core";
import { ColoredBlock } from "documentLabeler/components/documentPanel/documentBlockLayer/ColoredBlock/ColoredBlock";
import { DragRectangle } from "documentLabeler/components/documentPanel/documentBlockLayer/useDragBlockSelect/DragRectangle";
import { useDragBlockSelect } from "documentLabeler/components/documentPanel/documentBlockLayer/useDragBlockSelect/useDragBlockSelect";
import { BlockUtils, ColoredBlockType, RegionColoredBlock } from "documentLabeler/components/documentPanel/documentBlockLayer/utils/BlockUtils";
import { EndUserBlockRenderUtils } from "documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils";
import { useDocumentLabeler } from "documentLabeler/DocumentLabelerProvider";
import { DocumentLabelerReducerUtils } from "documentLabeler/state/DocumentLabelerReducerUtils";
import { LabelingSelectionType } from "documentLabeler/state/DocumentLabelerState";
import { BlockDto, BlockType, BoundingBoxDto, FieldType } from "documentLabeler/types/DocumentLabelerTypes";
import { useRef, useState } from "react";

type Props = {
  width: number;
  docPageHeights: Array<number>;
};

const useStyles = makeStyles(() => ({
  Root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  EndUserBlockLayerRoot: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * Component responsible for rendering the ColoredBlocksLayer over the DocumentDisplayer component
 * @param props: Props
 * @returns JSX
 */
export const DocumentBlockLayer: React.FC<Props> = ({
  width,
  docPageHeights,
}) => {
  const classes = useStyles();

  const { state, dispatch } = useDocumentLabeler();

  const { docInfo } = state;

  const blockRootRef = useRef<HTMLDivElement>(null);
  const [
    unhighlightedBlocksToDisplay,
    setUnhighlightedBlocksToDisplay,
  ] = useState<Array<BlockDto>>([]);

  // Used to render a rectangle when dragging
  const {
    onDragStart,
    onDrag,
    onDragEnd,
    dragRectangle,
  } = useDragBlockSelect();

  const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(docInfo);

  const isDragging = dragRectangle !== undefined;

  const selectedFieldColor = state.localState.activeField
    ? DocumentLabelerReducerUtils.getColorFromFieldId(
        state,
        state.localState.activeField.id,
      )
    : null;

  const fieldColoredBlocks: Array<ColoredBlockType> = fields.flatMap(
    (field) =>
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

  const coloredBlocks = fieldColoredBlocks.concat(tableCellColoredBlocks);

  const coloredBlocksToDisplay = coloredBlocks.filter((block) => {
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

  const regions = BlockUtils.getRegionsToDisplay(state);

  const regionsToDisplay = regions.filter((region) => {
    if (state.localState.activeField) {
      return region.sourceFieldId === state.localState.activeField.id;
    } else {
      return true;
    }
  });

  const filteredUnhighlightedBlocks = BlockUtils.getFilteredUnhighlightedBlocks(
    state.localState.activeField,
    coloredBlocks,
    docInfo.wordBlocks,
    state.localState.selectionType,
  );

  /**
   * Responsible for handling the case of unselected field/cell.
   * @param ev
   * @param block
   */
  const handleOnColoredBlockClick = (
    ev: React.MouseEvent,
    block: ColoredBlockType,
  ) => {
    ev.stopPropagation();
    if (!state.localState.activeField) {
      const fieldId = BlockUtils.isTextOrCheckBoxBlock(block)
        ? block.sourceFieldId
        : block.tableId;
      dispatch({
        type: 'setActiveField',
        payload: {
          id: fieldId,
          type: block.sourceFieldType,
        },
      });
    } else if (
      BlockUtils.isCellLabel(block) &&
      !(state.localState.activeField.type === FieldType.Table &&
        state.localState.activeField.activeCell)
    ) {
      dispatch({
        type: 'setActiveField',
        payload: {
          id: block.tableId,
          type: FieldType.Table,
          activeCell: {
            rowId: block.rowId,
            columnId: block.columnId,
          }
        },
      });
    }
  };

  const handleOnColoredRegionClick = (
    ev: React.MouseEvent,
    region: RegionColoredBlock,
  ): void => {
    ev.stopPropagation();
    dispatch({
      type: 'clearRegionFromField',
      payload: {
        id: region.sourceFieldId,
        type: region.sourceFieldType,
        activeCell: BlockUtils.isCellLabel(region) ? {...region} : undefined,
      },
    });
  };

  const handleOnMouseDown = (evt: React.MouseEvent) => {
    const convertedMouseCoords = EndUserBlockRenderUtils.convertEventCoordsToRefSpace(
      blockRootRef,
      evt,
    );

    const isHoveringOnWordBlock = unhighlightedBlocksToDisplay.length !== 0;
    const isHoveringOnFieldBlock =
      EndUserBlockRenderUtils.getBlocksUnderMouse(
        coloredBlocks.map((block) => block.block),
        convertedMouseCoords,
        docPageHeights,
        width,
      ).length !== 0;
    const isHoveringOnFieldRegion =
      EndUserBlockRenderUtils.getRegionsUnderMouse(
        regions,
        convertedMouseCoords,
        docPageHeights,
        width,
      ).length !== 0;

    if (
      !isDragging &&
      !isHoveringOnWordBlock &&
      !isHoveringOnFieldBlock &&
      !isHoveringOnFieldRegion
    ) {
      onDragStart(convertedMouseCoords);
    }
  };

  const handleOnMouseUp = (evt: React.MouseEvent) => {
    if (isDragging) {
      onDragEnd();
    }
    const shouldLabelRegion =
      state.localState.activeField &&
      (state.localState.selectionType === LabelingSelectionType.Region ||
        state.localState.activeField.type === FieldType.Signature);
    if (state.localState.activeField && shouldLabelRegion && dragRectangle) {
      const region = BlockUtils.getRegionFromRectangle(
        dragRectangle,
        width,
        docPageHeights,
      );

      const getActiveRegion = (): BoundingBoxDto | undefined => {
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

      const activeRegion = getActiveRegion();

      if (
        activeRegion &&
        EndUserBlockRenderUtils.doRectanglesIntersect(
          EndUserBlockRenderUtils.convertBoundingBoxToRectCoords(activeRegion),
          EndUserBlockRenderUtils.convertBoundingBoxToRectCoords(region),
        )
      ) {
        // When the user clicks directly on the signature region
        // or draws an intersecting rectangle, we clear the region
        dispatch({
          type: 'clearRegionFromField',
          payload: state.localState.activeField,
        });
      } else {
        // otherwise we save the new region to the signature field
        dispatch({
          type: 'addRegionToActiveField',
          payload: {
            region,
          },
        });
      }
    }

    if (unhighlightedBlocksToDisplay.length > 0) {
      if (
        state.localState.activeField &&
        (state.localState.activeField.type === FieldType.Text ||
          state.localState.activeField.type === FieldType.Checkbox)
      ) {
        dispatch({
          type: 'addBlocksToActiveField',
          payload: {
            blocks: unhighlightedBlocksToDisplay,
          },
        });
      } else if (
        state.localState.activeField &&
        state.localState.activeField.type === FieldType.Table
      ) {
        // dispatch({
        //   type: 'addBlocksToActiveTableCell',
        //   payload: {
        //     blocks: unhighlightedBlocksToDisplay,
        //   },
        // });
      }

      // Reset the unhighlighted blocks
      setUnhighlightedBlocksToDisplay([]);
    } else {
      const newMouseCoords = EndUserBlockRenderUtils.convertEventCoordsToRefSpace(
        blockRootRef,
        evt,
      );

      const blocks = EndUserBlockRenderUtils.getBlocksUnderMouse(
        coloredBlocksToDisplay.map((block) => block.block),
        newMouseCoords,
        docPageHeights,
        width,
      );

      if (blocks.length > 0 && state.localState.activeField) {
        const block = blocks[0];
        if (
          state.localState.activeField.type === FieldType.Text ||
          state.localState.activeField.type === FieldType.Checkbox
        ) {
          dispatch({
            type: 'removeBlockFromField',
            payload: {
              blockId: block.id,
              field: {
                id: state.localState.activeField.id,
                type: state.localState.activeField.type,
              }
            },
          });
        } else if (
          state.localState.activeField.type === FieldType.Table &&
          state.localState.activeField.activeCell
        ) {
          // dispatch({
          //   type: 'removeBlockFromCell',
          //   payload: {
          //     blockId: block.id,
          //     columnId: state.activeCell.columnId,
          //     rowId: state.activeCell.rowId,
          //     tableId: state.activeCell.tableId,
          //   },
          // });
        }
      }
    }
  };

  const handleOnMouseMove = (evt: React.MouseEvent) => {
    const newMouseCoords = EndUserBlockRenderUtils.convertEventCoordsToRefSpace(
      blockRootRef,
      evt,
    );

    if (isDragging) {
      onDrag(newMouseCoords);
    }

    const newBlocksToDisplay =
      dragRectangle !== undefined
        ? EndUserBlockRenderUtils.getWordBlocksInsideRectangle(
            dragRectangle,
            filteredUnhighlightedBlocks,
            docPageHeights,
            width,
          )
        : EndUserBlockRenderUtils.getBlocksUnderMouse(
            filteredUnhighlightedBlocks,
            newMouseCoords,
            docPageHeights,
            width,
          );

    if (
      newBlocksToDisplay.length > 0 ||
      newBlocksToDisplay.length !== unhighlightedBlocksToDisplay.length
    ) {
      setUnhighlightedBlocksToDisplay(newBlocksToDisplay);
    }
  };


  return (
    <div
      className={classes.Root}
      ref={blockRootRef}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleOnMouseUp}
    >
      <Box className={classes.EndUserBlockLayerRoot}>
        {coloredBlocksToDisplay.map((coloredBlock, index) => (
          <ColoredBlock
            key={coloredBlock.block.id}
            block={coloredBlock.block}
            color={coloredBlock.color}
            docPageHeights={docPageHeights}
            docRenderWidth={width}
            autoScroll={index === 0}
            opacity={BlockUtils.getColoredBlockOpacity(
              coloredBlock,
              state.localState.activeField,
            )}
            onClick={(ev) => handleOnColoredBlockClick(ev, coloredBlock)}
          />
        ))}

        {regionsToDisplay.map((coloredRegion, index) => (
          <ColoredBlock
            key={coloredRegion.id}
            block={{
              ...coloredRegion,
              boundingBox: coloredRegion.region,
              blockType: BlockType.Word,
              text: '',
            }}
            color={coloredRegion.color}
            docPageHeights={docPageHeights}
            docRenderWidth={width}
            autoScroll={index === 0}
            opacity={BlockUtils.getColoredBlockOpacity(
              coloredRegion,
              state.localState.activeField,
            )}
            onClick={(ev: React.MouseEvent) =>
              handleOnColoredRegionClick(ev, coloredRegion)
            }
          />
        ))}

        {selectedFieldColor &&
          unhighlightedBlocksToDisplay.map((block) => (
            <ColoredBlock
              key={block.id}
              block={block}
              color={selectedFieldColor}
              docPageHeights={docPageHeights}
              docRenderWidth={width}
            />
          ))}
        {dragRectangle && selectedFieldColor && (
          // can only draw rectangle if active field is set
          <DragRectangle
            dragCoords={dragRectangle}
            bgColor={selectedFieldColor}
          />
        )}
      </Box>
    </div>
  );
};
