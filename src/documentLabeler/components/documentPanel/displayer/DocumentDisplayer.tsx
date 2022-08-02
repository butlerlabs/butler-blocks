import React from 'react';
import { Document } from 'react-pdf';

import { Box, makeStyles } from '@material-ui/core';
import { MimeType } from 'documentLabeler/types/DocumentLabelerTypes';

// State Properties
type Props = {
  document: string;
  pages: Array<JSX.Element>;
  loaders: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPdfDocumentLoadSuccess: (pdf: any) => void;
    onImgDocumentLoadSuccess: (pageHeight: number) => void;
  };
  width: number;
  mimeType: string;
};

const useStyles = makeStyles(() => ({
  DocumentContainer: {
    // Enforces that the canvas always only takes 100% of the available space
    // This prevents horizontal scroll
    // NOTE: The !important is needed to override the underlying react-pdf
    //       canvas width
    '& .react-pdf__Page__canvas, & .react-pdf__Page__textContent': {
      width: '100% !important',
    },
  },
  ImageView: {
    userSelect: 'none',
  },
}));

/**
 * Reusable component that displays a document based off the type of
 * document that it is passed. Used for rendering doc extraction images.
 * @param props
 */
export const DocumentDisplayer: React.FC<Props> = ({
  document,
  loaders,
  pages,
  mimeType,
  width,
}) => {
  const isPdf = mimeType === MimeType.Pdf;
  const classes = useStyles();

  const onImgLoad = (event: any) => {
    loaders.onImgDocumentLoadSuccess(event.target.offsetHeight);
  };

  return isPdf ? (
    <Box className={classes.DocumentContainer}>
      <Document
        file={document}
        onLoadSuccess={loaders.onPdfDocumentLoadSuccess}
      >
        {pages}
      </Document>
    </Box>
  ) : (
    <img
      className={classes.ImageView}
      onLoad={onImgLoad}
      width={width}
      alt="Document"
      src={document}
    />
  );
};
