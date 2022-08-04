import React from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { FieldsPanel } from 'documentLabeler/components/fieldsPanel/FieldsPanel';
import { DocumentPanel } from 'documentLabeler/components/documentPanel/DocumentPanel';
import { FieldType } from 'common/types/DocumentLabelerTypes';
import { TableLabeler } from 'documentLabeler/components/tableLabeler/TableLabeler';

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flex: 1,
  },
  FieldsPanelContainer: {
    width: theme.spacing(45),
    display: 'flex',
  },
  DocumentDisplayerContainer: {
    flex: 1,
    display: 'flex',
  }
 }));

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, as well as an onSaveCallback to be executed when the save button
 * is clicked.  Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabelerContent: React.FC = () => {
  const classes = useStyles();

  const { state } = useDocumentLabeler();

  return (
    <Box className={classes.Root}>
      <Box className={classes.DocumentDisplayerContainer}>
        <DocumentPanel />
      </Box>
      <Box className={classes.FieldsPanelContainer}>
        <FieldsPanel />
      </Box>
      {state.localState.activeField &&
        state.localState.activeField.type === FieldType.Table && (
          <TableLabeler />
        )}
    </Box>
  )
 }
