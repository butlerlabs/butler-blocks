import { DocumentLabeler } from "./documentLabeler/DocumentLabeler";
import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Will be in butlerBlocks.js, exported by our package and imported 
 * via a require statement in our customer's js file
 */
 const createDocLabeler = (docLabelerId: string, docLabelerInfo: {clickCount: number, name: string}, onSaveCallback: () => void) => {
  const docLabelerContainer = document.getElementById(docLabelerId);

  if (!docLabelerContainer) {
    throw new Error(`Could not find container element with id ${docLabelerId}`)
  }

  const docLabelerRoot = ReactDOM.createRoot(docLabelerContainer);

  docLabelerRoot.render(
    <React.StrictMode>
      <DocumentLabeler docLabelerInfo={docLabelerInfo} onSaveCallback={onSaveCallback} />
    </React.StrictMode>
  );
};

export const butlerBlocks = {
  createDocLabeler,
};