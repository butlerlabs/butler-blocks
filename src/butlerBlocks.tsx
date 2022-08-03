import React from 'react';
import ReactDOM from 'react-dom/client';
import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { ButlerProvider } from 'common/theme/ButlerProvider';
import { DocumentLabelerOutputDataDto } from 'common/types/DocumentLabelerTypes';
import { ButlerBlockApi, ButlerApiCallFactory } from 'api/apiCalls';

type CreateDocLabelerFn = (
  id: string,
  data: DocumentLabelerData,
  onSaveCallback: (data: DocumentLabelerOutputDataDto) => void
) => void;

/**
 * Will be in butlerBlocks.js, exported by our package and imported
 * via a require statement in our customer's js file
 */
 const createDocLabeler = (
    id: string,
    data: DocumentLabelerData,
    onSaveCallback: (data: DocumentLabelerOutputDataDto) => void
  ) => {
    const docLabelerContainer = document.getElementById(id);

    if (!docLabelerContainer) {
      throw new Error(`Could not find container element with id ${id}`)
    }

    const docLabelerRoot = ReactDOM.createRoot(docLabelerContainer);

    docLabelerRoot.render(
      <React.StrictMode>
        <ButlerProvider>
          <DocumentLabeler data={data} onSaveCallback={onSaveCallback} />
        </ButlerProvider>
      </React.StrictMode>
    );
};

type LoadedButlerBlocksSdk = {
  createDocLabeler: CreateDocLabelerFn;
  api: ButlerBlockApi;
}

const loadButlerBlocks = (apiKey: string): LoadedButlerBlocksSdk => {

  return {
    createDocLabeler,
    api: ButlerApiCallFactory.create(apiKey),
  }
}

export {
  loadButlerBlocks,
};
