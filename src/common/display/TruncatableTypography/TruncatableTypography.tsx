import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import {
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  TypographyProps,
} from '@material-ui/core';

const DEFAULT_MAX_LENGTH = 250;

type Props = {
  value: string;
  typographyProps?: TypographyProps;
  expandable?: boolean;
  maxCharLength?: number;
  paragraph?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Truncate: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

/**
 * Visual component for displaying text that
 * will truncate based on the size of the parent component.
 *
 * NOTE: In order to truncate correctly within flex display components,
 * the parent component must have an "overflow: hidden" style applied to it.
 *
 * Based off:
 * https://stackoverflow.com/questions/56588625/react-show-material-ui-tooltip-only-for-text-that-has-ellipsis
 *
 * @param props
 */
export const TruncatableTypography: React.FC<Props> = ({
  value,
  typographyProps,
  expandable,
  maxCharLength = DEFAULT_MAX_LENGTH,
  paragraph = true,
}) => {
  const classes = useStyles();
  // Create Ref
  const textElementRef = useRef<HTMLElement>(null);

  // Define state and function to update the value
  const [shouldTruncate, setShouldTruncate] = useState(false);

  const compareSize = () => {
    if (textElementRef === null || textElementRef.current === null) return;

    const shouldTruncate =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    setShouldTruncate(shouldTruncate);
  };

  // compare once and add resize listener on "componentDidMount" and also
  // if the value changes while on screen
  useEffect(() => {
    if (expandable && value.length > maxCharLength) {
      setShouldTruncate(true);
    } else {
      compareSize();
      window.addEventListener('resize', compareSize);
    }
    return () => {
      window.removeEventListener('resize', compareSize);
    };
  }, [value]);

  const displayValue = useMemo(() => {
    if (expandable && value.length > maxCharLength) {
      return `${value.substring(0, maxCharLength)}...`;
    } else {
      return value;
    }
  }, [value]);

  return (
    <Tooltip title={value} interactive disableHoverListener={!shouldTruncate}>
      <Typography
        ref={textElementRef}
        // Need to force the underlying component to be a paragraph
        // so that the styles are applied correctly
        paragraph={paragraph}
        {...typographyProps}
        className={clsx(
          {
            [classes.Truncate]: !expandable,
          },
          [typographyProps?.className],
        )}
      >
        {displayValue}
      </Typography>
    </Tooltip>
  );
};
