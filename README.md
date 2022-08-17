# Butler Blocks
Butler Blocks is Butler Labs Inc.'s Library of embeddable UI components and api wrappers to power AI for developers

---

## Install Butler Blocks

```cli
npm install butler-blocks --save
```

## Using Butler Blocks

Load Butler Blocks with your API Key

Note: You'll need your API key, which can be found
on the settings page of the [Butler Product](app.butlerlabs.ai)

```js
import { loadButlerBlocks } from 'butler-blocks';

//...

// Get this API key from your Butler Account!
const myApiKey = 'MY_API_KEY';

const butlerBlocks = loadButlerBlocks(myApiKey);

//...
```

## Example Workflow with the Document Labeler

Note: Before fetching data, you'll need to use the core
[Butler Product](app.butlerlabs.ai) to create a model, and
then use the core API suite to upload a document to that model

For more help, check out the [documentation](https://docs.butlerlabs.ai/reference/welcome)

```html
<body>
  <!-- We will put our Butler Block component inside this div. -->
  <!-- Note that you can add custom styling to the container here as you wish -->
  <div
    id="ButlerDocumentLabeler"
    style="height: calc(100vh - 32px); width: calc(100vw - 32px); padding: 8px"
  ></div>

  <!-- ... -->
</body>
```

```js
import { loadButlerBlocks } from 'butler-blocks';

// Step 1: Initialize Butler Blocks with your API Key

// Get this API key from your Butler Account!
const myApiKey = 'MY_API_KEY';

const butlerBlocks = loadButlerBlocks(myApiKey);

// Step 2: Get your Document Info

// Get this info from the API response when you upload your documents!
const myDocument = {
  modelId: 'MY_MODEL_ID',
  documentId: 'MY_DOCUMENT_ID',
};

// Step 3: Fetch data about your document from Butler
const fetchDocumentData = async ({ modelId, documentId }) => {
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
const initializeDocLabeler = ({ modelId, documentId }) => {
  // using the function we defined earlier to fetch document data
  const data = await fetchDocumentData(modelId, documentId);

  // Note: the first parameter for this function should be the Id
  // that you specified in your html div element
  butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, onSaveCallback);
};

// Call this function when you want to display the labeler!
initializeDocLabeler(myDocument);
```
