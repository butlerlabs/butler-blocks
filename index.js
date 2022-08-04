import { loadButlerBlocks } from "./src/butlerBlocks";

/**
 * Customer's index.js file, will import butlerBlocks via a require statement.
 * initializeDocLabeler and onSaveCallback will be defined by the end user.
 * initializeDocLabeler should fetch document data and feed it to the butlerBlocks
 * doc labeler component.
 * onSaveCallback will be defined by the end user to handle the output document data
 * (could be used in their application, or to power a Butler API label endpoint).
 */

const butlerBlocks = loadButlerBlocks('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzkyNDA4OTUyMDc4OTMxOTQyNyIsImVtYWlsIjoiamFjb2IuZ3JlZW5AYnV0bGVybGFicy5haSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE2MjEyNzg2OTM5MjJ9.io7TqbbqBrT3qXCaEgBsDZ0DcQj58HIZZD8LLVMPiZw');

const stubData = {
  modelId: '09f2067f-c5ee-4fef-ac87-411cb8a24ef2',
  documentId: '9747f61d-0a4c-40e3-99eb-77b4ac389bba',
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
