import { RegionColoredBlock } from "documentLabeler/components/documentPanel/documentBlockLayer/utils/BlockUtils";
import { BlockDto, BoundingBoxDto } from "documentLabeler/types/DocumentLabelerTypes";

type DomRectangle = {
  left: number;
  top: number;
  height: number;
  width: number;
};

export type Coords = {
  x: number;
  y: number;
};

/**
 * Represents the coordinates of a rectangle.
 * start corresponds to the top left and end
 * corresponds to the bottom right.
 */
export type RectCoords = {
  start: Coords;
  end: Coords;
};

/**
 * Converts the browser coordinates of of an event
 * into coordinates within the context of a specified ref
 */
const convertEventCoordsToRefSpace = (
  ref: React.RefObject<HTMLDivElement>,
  evt: React.MouseEvent,
): Coords => {
  const refCoords = ref.current
    ? ref.current.getBoundingClientRect()
    : ({ height: 0, width: 0, x: 0, y: 0 } as DOMRect);

  return {
    x: evt.clientX - refCoords.x,
    y: evt.clientY - refCoords.y,
  };
};

type MinMaxRect = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/**
 * Converts a rectangle into its min and max x/y values.
 * @param rect
 */
const toMinMax = (rect: RectCoords): MinMaxRect => {
  const { minX, maxX } =
    rect.start.x <= rect.end.x
      ? { minX: rect.start.x, maxX: rect.end.x }
      : { minX: rect.end.x, maxX: rect.start.x };

  const { minY, maxY } =
    rect.start.y <= rect.end.y
      ? { minY: rect.start.y, maxY: rect.end.y }
      : { minY: rect.end.y, maxY: rect.start.y };

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
};

/**
 * Given a block, and page information, will determine the
 * exact renderable coordinates for that block.
 * @param block
 * @param docPageHeights
 * @param docRenderWidth
 */
const getBlockRenderCoords = (
  boundingBox: BoundingBoxDto,
  docPageHeights: Array<number>,
  docRenderWidth: number,
): DomRectangle => {
  // Height of page the block belongs on.
  // The `top` and `height` of the bounding box is relative to this height.
  const pageHeight = docPageHeights[boundingBox.page];

  // Cumulative height of pages before this page
  // The `top` of the bounding box should be offset by this height.
  let pageOffset = 0;
  for (let i = 0; i < boundingBox.page; ++i) {
    pageOffset += docPageHeights[i];
  }

  const left = boundingBox.left * docRenderWidth;
  const top = pageOffset + boundingBox.top * pageHeight;
  const height = boundingBox.height * pageHeight;
  const width = boundingBox.width * docRenderWidth;

  return {
    left,
    top,
    height,
    width,
  };
};

/**
 * Returns true if the specified coordinate is inside of the specified block
 * @param coordinate
 * @param block
 * @param zoomScale
 */
const coordinateIsInBlock = (
  coordinate: Coords,
  block: DomRectangle,
): boolean => {
  const scaledBlock = {
    left: block.left,
    width: block.width,
    top: block.top,
    height: block.height,
  };
  const xCoordIsValid =
    coordinate.x >= scaledBlock.left &&
    coordinate.x <= scaledBlock.left + scaledBlock.width;
  const yCoordIsValid =
    coordinate.y >= scaledBlock.top &&
    coordinate.y <= scaledBlock.top + scaledBlock.height;
  return xCoordIsValid && yCoordIsValid;
};

/**
 * Returns the word blocks to render given a specific mouse
 * coordinate
 * @param wordBlocks
 * @param mouseCoordinates
 * @param docPageHeights
 * @param docRenderWidth
 * @param zoomScale
 */
const getBlocksUnderMouse = (
  blocks: Array<BlockDto>,
  mouseCoordinates: { x: number; y: number },
  docPageHeights: Array<number>,
  docRenderWidth: number,
): Array<BlockDto> => {
  return blocks.filter((b) =>
    coordinateIsInBlock(
      mouseCoordinates,
      getBlockRenderCoords(b.boundingBox, docPageHeights, docRenderWidth),
    ),
  );
};

/**
 * Returns the regions under the mouse cooredinates
 * @param wordBlocks
 * @param mouseCoordinates
 * @param docPageHeights
 * @param docRenderWidth
 * @param zoomScale
 */
const getRegionsUnderMouse = (
  regions: Array<RegionColoredBlock>,
  mouseCoordinates: { x: number; y: number },
  docPageHeights: Array<number>,
  docRenderWidth: number,
): Array<RegionColoredBlock> => {
  return regions.filter((r) =>
    coordinateIsInBlock(
      mouseCoordinates,
      getBlockRenderCoords(r.region, docPageHeights, docRenderWidth),
    ),
  );
};

/**
 * Determines if two rectangles intersect.
 * @param rectA
 * @param rectB
 */
const doRectanglesIntersect = (
  rectA: RectCoords,
  rectB: RectCoords,
): boolean => {
  const minMaxA = toMinMax(rectA);
  const minMaxB = toMinMax(rectB);

  const aLeftOfB = minMaxA.maxX < minMaxB.minX;
  const aRightOfB = minMaxA.minX > minMaxB.maxX;
  const aBelowB = minMaxA.minY > minMaxB.maxY;
  const aAboveB = minMaxA.maxY < minMaxB.minY;

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
};

const convertBoundingBoxToRectCoords = (
  boundingBox: DomRectangle,
): RectCoords => ({
  start: { x: boundingBox.left, y: boundingBox.top },
  end: {
    x: boundingBox.left + boundingBox.width,
    y: boundingBox.top + boundingBox.height,
  },
});

/**
 * Returns a list of all word blocks that are inside a
 * given rectangle.
 *
 * NOTE: Word blocks must be iterated over in correct sequential
 *       order since the ordering impacts the read order of the blocks
 * @param rectCoords
 * @param wordBlocks
 * @param docPageHeights
 * @param docRenderWidth
 */
const getWordBlocksInsideRectangle = (
  rectCoords: RectCoords,
  wordBlocks: Array<BlockDto>,
  docPageHeights: Array<number>,
  docRenderWidth: number,
): Array<BlockDto> => {
  return wordBlocks.filter((w) => {
    const blockRenderCoords = getBlockRenderCoords(
      w.boundingBox,
      docPageHeights,
      docRenderWidth,
    );

    return doRectanglesIntersect(
      rectCoords,
      convertBoundingBoxToRectCoords(blockRenderCoords),
    );
  });
};

/**
 * Utility functions used to help determine which blocks
 * should be rendered on the End User Block Layer
 */
export const EndUserBlockRenderUtils = {
  getBlockRenderCoords,
  getBlocksUnderMouse,
  getRegionsUnderMouse,
  getWordBlocksInsideRectangle,
  convertEventCoordsToRefSpace,
  toMinMax,
  doRectanglesIntersect,
  convertBoundingBoxToRectCoords,
};
