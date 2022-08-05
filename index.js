import { loadButlerBlocks } from 'butlerblocks';

/**
 * Example Usage of the ButlerBlocks Embedded Doc Labeler
 * This example shows how to import butlerBlocks, fetch data 
 * for the document labeler, render the document labeler,
 * and generate a new training document with the updated labels.
 */

const butlerBlocks = loadButlerBlocks('MY_API_KEY');

const myDocument = {
  modelId: 'MY_MODEL_ID',
  documentId: 'MY_DOCUMENT_ID',
};

const submitLabels = async (trainingDocumentLabels) => {
  await butlerBlocks.api.submitDocumentLabels(
    myDocument.modelId, 
    myDocument.documentId, 
    trainingDocumentLabels.results
  );
}

const onSaveCallback = (docInfo) => {
  submitLabels(docInfo.trainingDocumentLabels);
};

const initializeDocLabeler = async ({ modelId, documentId }) => {
  const extractionResultsResponse = 
    await butlerBlocks.api.getExtractionResults(modelId, documentId);
  const { data } = extractionResultsResponse;

  butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, onSaveCallback);
};

initializeDocLabeler(stubData);