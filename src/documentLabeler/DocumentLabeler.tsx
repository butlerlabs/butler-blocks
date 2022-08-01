import React from 'react';
import { DocumentLabelerProvider } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { FieldsPanel } from 'documentLabeler/components/fieldsPanel/FieldsPanel';

type Props = {
  data: DocumentLabelerData;
  // TODO: define documentLabelerOutput type
  onSaveCallback: (documentLabelerOutput: object) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  Root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flex: 1,
  },
  FieldsPanelContainer: {
    width: theme.spacing(45),
  },
  DocumentDisplayerContainer: {
    flex: 1,
  }
 }));

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, as well as an onSaveCallback to be executed when the save button
 * is clicked.  Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabeler: React.FC<Props> = ({data, onSaveCallback}) => {
  const classes = useStyles();

  return (
    <DocumentLabelerProvider data={data} onSaveCallback={onSaveCallback}>
      <Box className={classes.Root}>
        <Box className={classes.DocumentDisplayerContainer}>
          Document will go here
        </Box>
        <Box className={classes.FieldsPanelContainer}>
          <FieldsPanel />
        </Box>
      </Box>
    </DocumentLabelerProvider>
  )
 }
