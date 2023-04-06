import React from 'react';
import { Box, Button, makeStyles, Theme, Typography } from '@material-ui/core';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerState } from 'documentLabeler/state/DocumentLabelerState';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Button: {
    width: theme.spacing(12),
    textTransform: 'none',
  },
}));

const FIELDS = 'Fields';

const SAVE = 'Save';

/**
 * Header component for the fields panel which contains the title of the panel
 * and the save button which dispatches the onSaveCallback action
 */
export const FieldsPanelHeader: React.FC = () => {
  const classes = useStyles();

  const { saveActionButtonText, displayOnly, hideSaveButton, onSaveCallback } =
    useBBConfiguration();
  const { state } = useDocumentLabeler();

  const onSaveClick = () =>
    onSaveCallback(
      DocumentLabelerState.convertInternalStateToOutputData(state),
      !!state.localState.haveLabelsChanged,
    );

  const shouldShowSaveButton = !hideSaveButton && !displayOnly;

  return (
    <Box className={classes.Root}>
      <Typography variant="subtitle2">{FIELDS}</Typography>
      {shouldShowSaveButton && (
        <Button
          variant="contained"
          color="primary"
          className={classes.Button}
          onClick={onSaveClick}
          disableElevation
        >
          {saveActionButtonText || SAVE}
        </Button>
      )}
    </Box>
  );
};
