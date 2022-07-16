import { butlerBlocks } from "./src/butlerBlocks";

/**
 * Customer's index.js file, will import butlerBlocks via a require statement.
 * initializeDocLabeler and onSaveCallback will be defined by the end user.
 * initializeDocLabeler should fetch document data and feed it to the butlerBlocks
 * doc labeler component.
 * onSaveCallback will be defined by the end user to handle the output document data
 * (could be used in their application, or to power a Butler API label endpoint).
 */

const stubData = {clickCount: 1, name: 'DocLabeler'};

const onSaveCallback = (docInfo) => {
  console.log(docInfo);
};

const initializeDocLabeler = (docId) => {
  // in finalized version, our customer would add an API call to our 
  // EUI endpoint here which would fetch the Document Labeler's data, 
  // and then pass it to the following call instead of the stub data.

  butlerBlocks.createDocLabeler("ButlerDocumentLabeler", stubData, onSaveCallback);
};

initializeDocLabeler({docId: 'docId'});