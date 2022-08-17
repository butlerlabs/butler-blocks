import { loadButlerBlocks } from './src/butlerBlocks';
import { TestConstants } from './testConstants';

/**
 * Example Usage of the ButlerBlocks Embedded Doc Labeler
 * This example shows how to import butlerBlocks, fetch data
 * for the document labeler, render the document labeler,
 * and generate a new training document with the updated labels.
 */

const { apiKey, modelId, documentId } = TestConstants;

const butlerBlocks = loadButlerBlocks(apiKey);

const myDocument = {
  modelId,
  documentId,
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

initializeDocLabeler(myDocument);
