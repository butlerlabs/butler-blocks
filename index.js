import { loadButlerBlocks } from "./src/butlerBlocks";

/**
 * Customer's index.js file, will import butlerBlocks via a require statement.
 * initializeDocLabeler and onSaveCallback will be defined by the end user.
 * initializeDocLabeler should fetch document data and feed it to the butlerBlocks
 * doc labeler component.
 * onSaveCallback will be defined by the end user to handle the output document data
 * (could be used in their application, or to power a Butler API label endpoint).
 */

const butlerBlocks = loadButlerBlocks('MY_API_KEY');

const stubData = {
  modelId: 'MY_MODEL_ID',
  documentId: 'MY_DOCUMENT_ID',
};

const onSaveCallback = (docInfo) => {
  console.log(docInfo);
};

const initializeDocLabeler = async ({ modelId, documentId }) => {
  // in finalized version, our customer would add an API call to our
  // EUI endpoint here which would fetch the Document Labeler's data,
  // and then pass it to the following call instead of the stub data.
  const extractionResultsResponse = await butlerBlocks.api.getExtractionResults(modelId, documentId);
  const { data } = extractionResultsResponse;

  butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, onSaveCallback);
};

initializeDocLabeler(stubData);
