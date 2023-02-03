import { loadButlerBlocks } from '../src/butlerBlocks';

let docInfoState;
// Example of custom Save UI
const saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
  if (docInfoState) {
    submitLabels(docInfoState.trainingDocumentLabels);
  }
});

// Step 1: Initialize Butler Blocks with your API Key

// Get this API key from your Butler Account!
const myApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMTE3OTg3NDE5MTAwMTg0MTkwNSIsImVtYWlsIjoiYW50aG9ueUBjb25jb3JkbWF0ZXJpYWxzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE2NzA1NTQzNDE2MTF9.Z5g0P0DQ7MCfkJWGDgvd20Tl4Ac-rYbVzYXqX2b70YA';

const butlerBlocks = loadButlerBlocks(myApiKey);

// Step 2: Get your Document Info

// Get this info from the API response when you upload your documents!
const myDocument = {
  modelId: '4f3033b9-d673-4ee9-b476-be6ce6016808',
  documentId: '47bcfb6c-6f92-4da3-9f2a-214ceb6e1912'
};

// Step 3: Fetch data about your document from Butler
const fetchDocumentData = async (modelId, documentId) => {
  const extractionResultsResponse =
    await butlerBlocks.api.getExtractionResults(modelId, documentId);
  const { data } = extractionResultsResponse;
  return data;
}

// Step 4: Handle saving labels

// Define a submit labels function, which will pass the output of the
// document labeler to the API to help train your model!
const submitLabels = async (trainingDocumentLabels) => {
  await butlerBlocks.api.submitDocumentLabels(
    myDocument.modelId,
    myDocument.documentId,
    trainingDocumentLabels.results
  );
}

// This function defines what action to take when the user clicks
// the save button in the document labeler
const onSaveCallback = (docInfo) => {
    submitLabels(docInfo.trainingDocumentLabels);
};

// Step 5: Initialize your Document Labeler!

// This function will inject the Butler Document Labeler into the
// div element you specified earlier with the fetched document data
const initializeDocLabeler = async ({ modelId, documentId }) => {
  // using the function we defined earlier to fetch document data
  const data = await fetchDocumentData(modelId, documentId);

  // Note: the first parameter for this function should be the Id
  // that you specified in your html div element
  butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, {
    saveActionButtonText: 'Confirm',
    fieldDisplayNameFormatter: (fieldName) => fieldName.toUpperCase(),
    // displayOnly: true,
    // hideSaveButton: true,
    onSaveCallback,
    onLabelUpdate: (_docInfo) => {
      console.log('DEBUG: onLabelUpdate', _docInfo);
      docInfoState = _docInfo;
    },
    showToolbar: true,
    toolbarProps: {
      // showPdf: false,
      // zoomMaxScale: 1,
      // zoomMinScale: 0.1,
      onToggleShowPdf: function(nextValue) {
        console.log('nextValue', nextValue)
      }
    }
  });
};

// Call this function when you want to display the labeler!
initializeDocLabeler(myDocument);
