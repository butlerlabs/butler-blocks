import React from 'react';
import { DocumentLabelerProvider } from 'documentLabeler/DocumentLabelerProvider';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';

type Props = {
  data: DocumentLabelerData;
  // TODO: define documentLabelerOutput type
  onSaveCallback: (documentLabelerOutput: object) => void;
};

/**
 * Will be in DocumentLabeler.tsx, exported as we do in our
 * regular codebase
 */
export const DocumentLabeler: React.FC<Props> = ({data, onSaveCallback}) => {
   return (
    <DocumentLabelerProvider data={data}>
      <div>
        Document Labeler will go here!
      </div>
    </DocumentLabelerProvider>
  )
 }
