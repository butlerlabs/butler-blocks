import React from 'react';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { FieldsPanel } from 'documentLabeler/components/fieldsPanel/FieldsPanel';
import { DocumentPanel } from 'documentLabeler/components/documentPanel/DocumentPanel';
import { FieldType } from 'common/types/DocumentLabelerTypes';
import { TableLabeler } from 'documentLabeler/components/tableLabeler/TableLabeler';
import clsx from 'clsx';

import type { DocumentLabelerInternalState } from 'documentLabeler/state/DocumentLabelerState';

const useStyles = makeStyles<Theme, DocumentLabelerInternalState>((theme) => ({
  Root: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    overflow: 'auto',
  },
  FieldsPanelContainer: {
    width: ({ localState }) =>
      localState.showPdf ? theme.spacing(45) : '100%',
    display: 'flex',
  },
  DocumentDisplayerContainer: {
    flex: 1,
    display: 'flex',
    padding: theme.spacing(0, 2),
  },
  Content: {
    display: 'flex',
  },
}));

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, as well as an onSaveCallback to be executed when the save button
 * is clicked.  Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabelerContent: React.FC = () => {
  const { state } = useDocumentLabeler();
  const classes = useStyles(state);

  return (
    <Box className={clsx(classes.Root, 'DocumentLabelerContent__root')}>
      <Box className={clsx(classes.Content, 'DocumentLabelerContent__content')}>
        {state.localState.showPdf && (
          <Box
            className={clsx(
              classes.DocumentDisplayerContainer,
              'DocumentLabelerContent__documentDisplayerContainer',
            )}
          >
            <DocumentPanel />
          </Box>
        )}

        <Box
          className={clsx(
            classes.FieldsPanelContainer,
            'DocumentLabelerContent__fieldsPanelContainer',
          )}
        >
          <FieldsPanel />
        </Box>
        {state.localState.activeField &&
          state.localState.activeField.type === FieldType.Table && (
            <TableLabeler />
          )}
      </Box>
    </Box>
  );
};
