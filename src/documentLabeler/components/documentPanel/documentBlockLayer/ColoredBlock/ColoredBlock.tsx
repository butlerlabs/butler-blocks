import React, { useEffect, useRef, useState } from 'react';
import { alpha, fade, makeStyles, Theme } from '@material-ui/core';
import { BlockDto, FieldType } from 'documentLabeler/types/DocumentLabelerTypes';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { HtmlVisibilityUtil } from 'common/util/HtmlVisibilityUtil';
import { EndUserBlockRenderUtils } from 'documentLabeler/components/documentPanel/documentBlockLayer/utils/EndUserBlockRenderUtils';

const TABLE_AREA_HEIGHT = 305;

type Props = {
  block: BlockDto;
  color: string;
  onClick?: (event: React.MouseEvent) => void;
  docPageHeights: Array<number>;
  docRenderWidth: number;
  containerRef?: HTMLDivElement;
  opacity?: number;
  autoScroll?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    position: 'absolute',
    borderRadius: theme.shape.borderRadius,
    scrollMargin: `${theme.spacing(5)}px`,
    // recenter blocks to offset the border radius
    marginLeft: theme.shape.borderRadius * -0.5,
    marginTop: theme.shape.borderRadius * -0.5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

/**
 * Component used for rendering a colored block over the DocumentColoredBlockLayer
 * @param props
 */
export const ColoredBlock: React.FC<Props> = ({
  block,
  color,
  onClick,
  docPageHeights,
  docRenderWidth,
  containerRef,
  opacity = 1,
  autoScroll = false,
}) => {
  const classes = useStyles();
  const { state } = useDocumentLabeler();
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [bgColor, setBGColor] = useState(fade(color, 0.2));

  useEffect(() => {
    const bottomOffset =
      state.localState.activeField?.type === FieldType.Table
        ? TABLE_AREA_HEIGHT
        : 0;
    if (
      blockRef.current &&
      state.localState.activeField &&
      autoScroll &&
      containerRef &&
      !HtmlVisibilityUtil.isInContainer(blockRef.current, containerRef, {
        bottomOffset,
      })
    ) {
      blockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [state.localState.activeField, blockRef.current]);

  useEffect(() => {
    setBGColor(alpha(color, 0.2));
  }, [color]);

  const handleOnHover = () => {
    setBGColor(alpha(color, 0.8));
  };

  const handleOnHoverExit = () => {
    setBGColor(alpha(color, 0.2));
  };

  const coords = EndUserBlockRenderUtils.getBlockRenderCoords(
    block.boundingBox,
    docPageHeights,
    docRenderWidth,
  );

  return (
    <div
      style={{
        ...coords,
        opacity,
        backgroundColor: bgColor,
        border: `2px solid ${color}`,
      }}
      className={classes.Root}
      onClick={onClick}
      ref={blockRef}
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnHoverExit}
    />
  );
};
