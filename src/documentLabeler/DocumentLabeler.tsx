import React, { useRef } from 'react';
import { DocumentLabelerProvider } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { DocumentLabelerContent } from 'documentLabeler/DocumentLabelerContent';
import { makeStyles } from '@material-ui/core';

type Props = {
  data: DocumentLabelerData;
};

const useStyles = makeStyles(() => ({
  Root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabeler: React.FC<Props> = ({ data }) => {
  const classes = useStyles();

  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <DocumentLabelerProvider data={data} rootRef={rootRef.current}>
      <div ref={rootRef} className={classes.Root}>
        <DocumentLabelerContent />
      </div>
    </DocumentLabelerProvider>
  );
};
