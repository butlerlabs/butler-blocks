import { MimeType } from 'common/types/DocumentLabelerTypes';
import React, { useEffect, useCallback, useMemo } from 'react';
import { Page, pdfjs } from 'react-pdf';
import { useDocumentLabeler } from 'documentLabeler/DocumentLabelerProvider';

import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// Serve pdf worker from CDN because the CRA build
// does not work properly for this dependency.
// https://butlerinc.atlassian.net/browse/BUTL-96
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export type DocumentDisplayerState = {
  pages: Array<JSX.Element>;
  pageHeights: Array<number>;
  loaders: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPdfDocumentLoadSuccess: (pdf: any) => void;
    onImgDocumentLoadSuccess: (pageHeight: number) => void;
  };
  documentIsVisible: boolean;
};

export type Viewport = {
  width: number;
  height: number;
};

const DEFAULT_SCALE = 1;

/**
 * Reusable hook for the purpose of displaying a multi page
 * document.
 *
 * @param stepLabels
 */
export const useDocumentDisplayer = (
  mimeType: string,
  size: {
    width: number;
    height: number;
  },
  docUri?: string,
): DocumentDisplayerState => {
  const isPdf = mimeType === MimeType.Pdf;

  // State for image rendering
  const [renderedImgHeight, setRenderedImageHeight] = React.useState(
    size.height,
  );

  // State for PDF rendering
  // - pages: array of Page components for the PDF
  // - renderedHeights: map of page index to rendered height
  const [numPages, setNumPages] = React.useState(0);
  const [renderedHeights, setRenderedHeights] = React.useState<number[]>([]);

  const { state } = useDocumentLabeler();

  // When a new document is loaded, we clear out the existing pages and page heights
  // To ensure that the newly rendered pages generate correctly
  useEffect(() => {
    setRenderedHeights([]);
  }, [docUri]);

  // Get heights for each page
  // - PDF: then convert renderedHeights map to an array
  // - image: assume single page with component height
  const pageHeights = isPdf ? renderedHeights : [renderedImgHeight];

  // When the document data is successfully loaded
  // - render a Page component for each page of fixed width
  // - on render success save the rendered height

  const onPdfDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  }, []);

  const pages = useMemo(() => {
    if (numPages === 0) {
      return [];
    }

    const newPages: JSX.Element[] = [];

    for (let pageIndex = 0; pageIndex < numPages; ++pageIndex) {
      // The onRenderSuccess prop is typed incorrectly for the react-pdf
      // Page component as a function with no arguments.
      //
      // - Declare a function with an argument that contains the fields
      //   we need to properly determine the rendered height.
      // - Force cast to function with no arguments when passing in prop
      //   to silence compiler errors.
      const onRenderSuccess = (renderedPage: {
        height: number;
        width: number;
        rotate: number;
        getViewport: (prop: { scale?: number; rotate?: number }) => Viewport;
      }): void => {
        setRenderedHeights((prev) => {
          const newArray = prev.slice();

          // Get the default viewport
          const defaultViewPort = renderedPage.getViewport({
            scale: DEFAULT_SCALE,
            rotate: renderedPage.rotate,
          });

          // Calculate the actual scale based on rendered page.
          // Can be be different than default scale if rendered page is scaled
          // for some reason (ex. window resize etc)
          const scale =
            (DEFAULT_SCALE * renderedPage.width) / defaultViewPort.width;

          // Get the actual current viewport
          const viewPort = renderedPage.getViewport({
            scale,
            rotate: renderedPage.rotate,
          });

          // If page is rotated an odd multiple of 90 degrees
          // use the viewport width as the page height instead.
          //
          // One case where this can happen if the PDF is configured to
          // display pages in landscape mode
          if ((renderedPage.rotate / 90 + 2) % 2 === 1) {
            newArray[pageIndex] = viewPort.width;
          } else {
            newArray[pageIndex] = viewPort.height;
          }

          return newArray;
        });
      };
      newPages.push(
        <Page
          scale={state.localState.pdfScale}
          key={pageIndex}
          pageIndex={pageIndex}
          width={size.width}
          onRenderSuccess={onRenderSuccess as () => void}
          renderAnnotationLayer={false}
        />,
      );
    }

    return newPages;
  }, [numPages, docUri, state.localState.pdfScale]);

  // When the image is rendered successfully, render the height
  // so that the blocks are rendered correctly
  const onImgDocumentLoadSuccess = (height: number): void => {
    setRenderedImageHeight(height);
  };

  // Tells the consumer of this hook when the document is readily viewable
  const documentIsVisible =
    (isPdf && pages.length > 0 && renderedHeights.length === pages.length) ||
    (!isPdf && renderedImgHeight > 0);

  return {
    pages,
    pageHeights,
    loaders: {
      onPdfDocumentLoadSuccess,
      onImgDocumentLoadSuccess,
    },
    documentIsVisible,
  };
};
