import React from 'react';
import { Box, fade, makeStyles, Theme } from '@material-ui/core';
import { EndUserBlockRenderUtils, RectCoords } from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';

type Props = {
  dragCoords: RectCoords;
  bgColor?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  DragRectangle: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    // recenter blocks to offset the border radius
    marginLeft: theme.shape.borderRadius * -0.5,
    marginTop: theme.shape.borderRadius * -0.5,
  },
}));

/**
 * Component used for rendering a drag rectangle
 * on document labeling pages.
 * @param props
 */
export const DragRectangle: React.FC<Props> = ({ dragCoords, bgColor }) => {
  const classes = useStyles();
  const minMax = EndUserBlockRenderUtils.toMinMax(dragCoords);
  const rectangle = {
    left: minMax.minX,
    top: minMax.minY,
    width: minMax.maxX - minMax.minX,
    height: minMax.maxY - minMax.minY,
  };

  const style: React.CSSProperties = {
    backgroundColor: bgColor ? fade(bgColor, 0.1) : 'transparent',
  };

  if (bgColor) {
    style.border = `2px solid ${bgColor}`;
  }

  return (
    <Box
      top={`${rectangle.top}px`}
      left={`${rectangle.left}px`}
      width={`${rectangle.width}px`}
      height={`${rectangle.height}px`}
      position="absolute"
      className={classes.DragRectangle}
      style={style}
    />
  );
};
