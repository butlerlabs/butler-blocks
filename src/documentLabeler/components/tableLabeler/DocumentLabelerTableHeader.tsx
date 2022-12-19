import React from 'react';
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';
import { FieldType } from 'common/types/DocumentLabelerTypes';

const ADD_ROW = 'Add Row';

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    gap: theme.spacing(4),
  },
  Expanded: {
    flex: 1,
  },
  Close: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  IconButton: {
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  LeftContent: {
    display: 'flex',
    alignItems: 'center',
  },
}));

/**
 * Reusable display component, responsible for displaying the
 * name of the table, edit button for editing the table name,
 * and close button for exiting the table editor.
 * @param Props
 */
export const DocumentLabelerTableHeader: React.FC = () => {
  const classes = useStyles();

  const { state, dispatch } = useDocumentLabeler();

  const selectedTable = DocumentLabelerReducerUtils.getSelectedTable(state);

  if (
    !state.localState.activeField ||
    state.localState.activeField.type !== FieldType.Table
  ) {
    throw new Error(
      'DocumentLabelerTableHeader cannot be rendered when there is no active table in the Document Labeler',
    );
  }

  const handleOnTableViewClose = () => {
    dispatch({
      type: 'setActiveField',
      payload: undefined,
    });
  };

  const handleAddRow = () => {
    dispatch({
      type: 'addRowToTable',
      payload: {
        tableId: selectedTable.id,
      },
    });
  };

  return (
    <Box className={classes.Root}>
      <Box className={classes.LeftContent}>
        <Typography variant="subtitle1">
          <b>{selectedTable.name}</b>
        </Typography>
      </Box>
      <Box className={classes.Expanded} />
      <Button color="primary" onClick={handleAddRow}>
        {ADD_ROW}
      </Button>
      <IconButton
        className={classes.IconButton}
        onClick={handleOnTableViewClose}
      >
        <Close className={classes.Close} />
      </IconButton>
    </Box>
  );
};
