import React, { useRef } from 'react';
import { DocumentLabelerProvider } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { DocumentLabelerContent } from 'documentLabeler/DocumentLabelerContent';
import { DocumentLabelerOutputDataDto } from 'common/types/DocumentLabelerTypes';

type Props = {
  data: DocumentLabelerData;
  onSaveCallback: (documentLabelerOutput: DocumentLabelerOutputDataDto) => void;
};

/**
 * Top level component containing the Embedded Document Labeler.  Takes in document info
 * as the data property, as well as an onSaveCallback to be executed when the save button
 * is clicked.  Handles positioning and rendering of the sub components
 * @param Props
 */
export const DocumentLabeler: React.FC<Props> = ({data, onSaveCallback}) => {

  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <DocumentLabelerProvider data={data} onSaveCallback={onSaveCallback} rootRef={rootRef.current}>
      <div ref={rootRef}>
        <DocumentLabelerContent />
      </div>
    </DocumentLabelerProvider>
  )
 }
