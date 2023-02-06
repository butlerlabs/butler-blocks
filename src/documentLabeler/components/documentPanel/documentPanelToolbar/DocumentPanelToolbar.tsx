import React, { useCallback } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

import { Box, makeStyles, Button, ButtonGroup } from '@material-ui/core';
import {
  ArrowDropUp,
  ArrowDropDown,
  ArrowDownward,
  ArrowUpward,
} from '@material-ui/icons';

import clsx from 'clsx';

type Props = {
  onZoomIn?: (event: React.MouseEventHandler<HTMLButtonElement>) => void;
  onZoomOut?: (event: React.MouseEventHandler<HTMLButtonElement>) => void;
};

const useStyles = makeStyles((theme) => {
  return {
    Root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1.5),
    },
    Box: {
      position: 'relative',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        '&:after': {
          position: 'absolute',
          content: "''",
          // top: 16,
          right: 0,
          width: 2.5,
          height: 18,
          backgroundColor: '#e5e5e5',
        },
      },
    },
    ZoomContainer: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
    },
    ZoomTitle: {
      marginTop: theme.spacing(0.5),
    },
    ZoomButtonsContainer: {},
    ZoomButton: {
      padding: 0,
      display: 'block',
      height: theme.spacing(2),
      minWidth: 35,
      border: 'none',
      '&:hover': {
        background: 'transparent',
        border: 'none',
      },
      '&:ntn-child(2)': {
        marginBottom: theme.spacing(0.5),
      },
      '& .DocumentPanelToolbar__zoomIcon': {
        cursor: 'pointer',
        color: theme.palette.common.black,
        padding: 0,
      },

      '&.disabled': {
        opacity: 0.5,
        userSelect: 'none',
        pointerEvents: 'none',
      },
    },
    ShowHidePdf: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 4,
      cursor: 'pointer',
    },
    ShowHidePdfLabel: {
      fontFamily: 'auto',
      lineHeight: 'initial',
      letterSpacing: 0,
    },
    ZoomIcon: {},
    ZoomCurrentValue: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(0.5),
    },
    ShowHideCheckbox: {
      '&:hover': {
        backgroundColor: 'transparent !important',
      },
    },
    ShowHideLabel: {},
    ShowHideIcon: {
      marginLeft: theme.spacing(1),
      width: 16,
      height: 16,
      color: theme.palette.common.black,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.common.black,
      borderRadius: '50%',
    },
  };
});

const DocumentPanelToolbar: React.FC<Props> = (props) => {
  const { onZoomIn, onZoomOut } = props;

  const classes = useStyles();
  const { showToolbar, toolbarProps } = useBBConfiguration();
  const { state, dispatch } = useDocumentLabeler();
  const { showPdf, pdfScale } = state.localState;

  const handleChangeShowHidePdf = useCallback(() => {
    dispatch({
      type: 'setShowHidePdf',
      payload: !showPdf,
    });
    toolbarProps?.onToggleShowPdf && toolbarProps.onToggleShowPdf(!showPdf);
  }, [toolbarProps, showPdf]);

  const handleIncreaseScale = useCallback((event) => {
    event.stopPropagation();
    dispatch({
      type: 'increasePdfScale',
    });
    onZoomIn && onZoomIn(event);
  }, []);

  const handleDecreaseScale = useCallback((event) => {
    event.stopPropagation();
    dispatch({
      type: 'decreasePdfScale',
    });
    onZoomOut && onZoomOut(event);
  }, []);

  const renderShowHideLabelAndIcon = useCallback(() => {
    const label = showPdf ? 'Hide Document' : 'Show Document';
    const Icon = showPdf ? ArrowUpward : ArrowDownward;

    return (
      <>
        <span className={classes.ShowHideLabel}>{label}</span>
        <Icon className={classes.ShowHideIcon} />
      </>
    );
  }, []);

  if (showToolbar) {
    return (
      <Box className={clsx(classes.Root, 'DocumentPanelToolbar__root')}>
        <Box
          className={clsx(classes.Box, classes.ShowHidePdf)}
          onClick={handleChangeShowHidePdf}
        >
          {renderShowHideLabelAndIcon()}
        </Box>

        {showPdf && (
          <Box
            className={clsx(
              classes.ZoomContainer,
              classes.Box,
              'DocumentPanelToolbar__zoomContainer',
            )}
          >
            <span className={classes.ZoomTitle}>Zoom</span>
            <span className={classes.ZoomCurrentValue}>
              {pdfScale.toFixed(1)}
            </span>
            <Box
              className={clsx(
                classes.ZoomButtonsContainer,
                'DocumentPanelToolbar__zoomButtons',
              )}
            >
              <ButtonGroup
                orientation="vertical"
                color="primary"
                disableRipple
                aria-label="vertical outlined primary button group"
              >
                <Button
                  disableRipple
                  className={clsx(
                    'DocumentPanelToolbar__zoomButton',
                    classes.ZoomButton,
                  )}
                  onClick={handleIncreaseScale}
                >
                  <ArrowDropUp
                    className={clsx(
                      classes.ZoomIcon,
                      'DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomUpIcon',
                    )}
                  />
                </Button>
                <Button
                  disableRipple
                  onClick={handleDecreaseScale}
                  className={clsx(
                    'DocumentPanelToolbar__zoomButton',
                    classes.ZoomButton,
                  )}
                >
                  <ArrowDropDown
                    className={clsx(
                      classes.ZoomIcon,
                      'DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomDownIcon',
                    )}
                  />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return <div />;
};

export { DocumentPanelToolbar };
