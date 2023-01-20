import { useCallback } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

import { Box, makeStyles, FormControlLabel, Checkbox } from '@material-ui/core';
// import {
//   ArrowDropUp as ArrowDropUpIcon,
//   ArrowDropDown as ArrowDropDownIcon,
// } from '@material-ui/icons';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => {
  return {
    Root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
    },
    ZoomContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    ZoomTitle: {
      marginTop: theme.spacing(0.5),
    },
    ZoomButtons: {
      '& .DocumentPanelToolbar__zoomButton': {
        padding: 0,
        display: 'block',
        height: theme.spacing(2),
        minWidth: 35,
        '&:hover': {
          background: 'transparent',
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
    },
    ShowHidePdf: {
      marginTop: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
    ShowHidePdfLabel: {
      fontFamily: 'auto',
      lineHeight: 'initial',
      letterSpacing: 0,
    },
  };
});

function DocumentPanelToolbar() {
  const classes = useStyles();
  const { showToolbar, toolbarProps } = useBBConfiguration();
  const { state, dispatch } = useDocumentLabeler();
  const { showPdf } = state.localState;

  const handleChangeShowHidePdf = useCallback(
    (_, checked: boolean) => {
      dispatch({
        type: 'setShowHidePdf',
        payload: checked,
      });
      toolbarProps?.onToggleShowPdf && toolbarProps.onToggleShowPdf(checked);
    },
    [toolbarProps],
  );

  // const handleIncreaseScale = useCallback(() => {
  //   dispatch({
  //     type: 'increasePdfScale',
  //   });
  // }, []);

  // const handleDecreaseScale = useCallback(() => {
  //   dispatch({
  //     type: 'decreasePdfScale',
  //   });
  // }, []);

  if (showToolbar) {
    return (
      <Box className={clsx(classes.Root, 'DocumentPanelToolbar__root')}>
        {/* <Box
          className={clsx(
            classes.ZoomContainer,
            'DocumentPanelToolbar__zoomContainer',
          )}
        >
          <span className={classes.ZoomTitle}>Zoom: </span>
          <Box
            className={clsx(
              classes.ZoomButtons,
              'DocumentPanelToolbar__zoomButtons',
            )}
          >
            <Tooltip title="Zoom in" placement="top">
              <Button
                disableRipple
                onClick={handleIncreaseScale}
                className={clsx('DocumentPanelToolbar__zoomButton', {
                  disabled: pdfScale >= 2,
                })}
              >
                <ArrowDropUpIcon className="DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomUpIcon" />
              </Button>
            </Tooltip>
            <Tooltip title="Zoom out" placement="bottom">
              <Button
                disableRipple
                onClick={handleDecreaseScale}
                className={clsx('DocumentPanelToolbar__zoomButton', {
                  disabled: pdfScale <= 0.3,
                })}
              >
                <ArrowDropDownIcon className="DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomDownIcon" />
              </Button>
            </Tooltip>
          </Box>
        </Box> */}
        <Box>
          <FormControlLabel
            className={classes.ShowHidePdf}
            labelPlacement="end"
            color="secondary"
            control={<Checkbox />}
            label="Show / Hide PDF"
            classes={{
              label: classes.ShowHidePdfLabel,
            }}
            checked={showPdf}
            onChange={handleChangeShowHidePdf}
          />
        </Box>
      </Box>
    );
  }

  return <div />;
}

export { DocumentPanelToolbar };
