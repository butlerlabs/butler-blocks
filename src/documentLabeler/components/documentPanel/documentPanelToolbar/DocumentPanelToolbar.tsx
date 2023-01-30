import { useCallback } from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

import {
  Box,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Button,
  ButtonGroup,
} from '@material-ui/core';
import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@material-ui/icons';

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
  const { showPdf, pdfScale } = state.localState;

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

  const handleIncreaseScale = useCallback((event) => {
    event.stopPropagation();
    dispatch({
      type: 'increasePdfScale',
    });
  }, []);

  const handleDecreaseScale = useCallback((event) => {
    event.stopPropagation();
    dispatch({
      type: 'decreasePdfScale',
    });
  }, []);

  console.log(
    'parseFloat(pdfScale.toFixed(1))',
    parseFloat(pdfScale.toFixed(1)),
  );

  if (showToolbar) {
    return (
      <Box className={clsx(classes.Root, 'DocumentPanelToolbar__root')}>
        <Box
          className={clsx(
            classes.ZoomContainer,
            'DocumentPanelToolbar__zoomContainer',
          )}
        >
          <span className={classes.ZoomTitle}>Zoom: </span>
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
                <ArrowDropUpIcon className="DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomUpIcon" />
              </Button>
              <Button
                disableRipple
                onClick={handleDecreaseScale}
                className={clsx(
                  'DocumentPanelToolbar__zoomButton',
                  classes.ZoomButton,
                )}
              >
                <ArrowDropDownIcon className="DocumentPanelToolbar__zoomIcon DocumentPanelToolbar__zoomDownIcon" />
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
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
