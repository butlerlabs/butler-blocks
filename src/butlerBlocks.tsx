import ReactDOM from 'react-dom';
import { DocumentLabeler } from 'documentLabeler/DocumentLabeler';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';
import { ButlerProvider } from 'common/theme/ButlerProvider';
import { ButlerBlockApi, ButlerApiCallFactory } from 'api/apiCalls';
import {
  BBConfigurationProvider,
  BBConfigurations,
} from "documentLabeler/context/BBConfigurationProvider";

type CreateDocLabelerFn = (
  id: string,
  data: DocumentLabelerData,
  config: BBConfigurations
) => void;

/**
 * Will be in butlerBlocks.js, exported by our package and imported
 * via a require statement in our customer's js file
 */
const createDocLabeler = (
  id: string,
  data: DocumentLabelerData,
  config: BBConfigurations
) => {
  const docLabelerContainer = document.getElementById(id);

  if (!docLabelerContainer) {
    throw new Error(`Could not find container element with id ${id}`)
  }

  ReactDOM.render(
    <BBConfigurationProvider config={config}>
      <ButlerProvider>
        <DocumentLabeler data={data} />
      </ButlerProvider>
    </BBConfigurationProvider>,
    docLabelerContainer
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
