import React from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { useBBConfiguration } from 'documentLabeler/context/BBConfigurationProvider';

import { Box, Button, makeStyles, Theme } from '@material-ui/core';
import { DocumentLabelerState } from 'documentLabeler/state/DocumentLabelerState';
import { DocumentPanelToolbar } from 'documentLabeler/components/documentPanel/documentPanelToolbar/DocumentPanelToolbar';

const useStyles = makeStyles<Theme, { showPdf: boolean }>((theme) => ({
  Root: {
    padding: ({ showPdf }) => (showPdf ? theme.spacing(2) : 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Button: {
    width: theme.spacing(12),
    textTransform: 'none',
  },
}));

// const FIELDS = 'Fields';

const SAVE = 'Save';

/**
 * Header component for the fields panel which contains the title of the panel
 * and the save button which dispatches the onSaveCallback action
 */
export const FieldsPanelHeader: React.FC = () => {
  const { saveActionButtonText, displayOnly, hideSaveButton, onSaveCallback } =
    useBBConfiguration();

  const { state } = useDocumentLabeler();
  const { showPdf } = state.localState;

  const classes = useStyles({ showPdf });

  const onSaveClick = () =>
    onSaveCallback(
      DocumentLabelerState.convertInternalStateToOutputData(state),
    );

  const shouldShowSaveButton = !hideSaveButton && !displayOnly;

  return (
    <Box className={classes.Root}>
      {!showPdf && <DocumentPanelToolbar />}
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
