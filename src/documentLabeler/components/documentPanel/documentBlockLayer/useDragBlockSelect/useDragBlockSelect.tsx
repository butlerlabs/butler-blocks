import { Coords, RectCoords } from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';
import { useCallback, useState } from 'react';

type ExternalHookState = {
  onDragStart: (startCoords: Coords) => void;
  onDrag: (newMouseCoords: Coords) => void;
  onDragEnd: () => void;
  dragRectangle?: RectCoords;
};

/**
 * Hook that is used to keep track of drag state
 * @param stepLabels
 */
export const useDragBlockSelect = (): ExternalHookState => {
  const [dragCoords, setDragCoords] = useState<RectCoords>();

  const onDragStart = useCallback((startCoords: Coords) => {
    setDragCoords({
      start: startCoords,
      end: startCoords,
    });
  }, []);

  const onDragEnd = useCallback(() => {
    setDragCoords(undefined);
  }, []);

  const onDrag = useCallback((newMouseCoords: Coords) => {
    setDragCoords((curDragCoords?: RectCoords) => {
      if (!curDragCoords) {
        throw new Error('Invalid state reached. No drag in progress');
      }

      return {
        ...curDragCoords,
        end: newMouseCoords,
      };
    });
  }, []);

  return {
    onDragStart,
    onDrag,
    onDragEnd,
    dragRectangle: dragCoords,
  };
};
