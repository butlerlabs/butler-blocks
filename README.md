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

Fetch Data for a Document using the APIs

Note: Before fetching data, you'll need to use the core
[Butler Product](app.butlerlabs.ai) to create a model, and
then use the core API suite to upload a document to that model

For more help, check out the [documentation](https://docs.butlerlabs.ai/reference/welcome)

```js
//...

// Get this info from the API response when you upload
// your documents!
const myDocument = {
  modelId: 'MY_MODEL_ID',
  documentId: 'MY_DOCUMENT_ID',
};

// This data can be used to initialize a document labeler in your app!
const fetchDocumentData = async ({ modelId, documentId }) => {
  const extractionResultsResponse =
    await butlerBlocks.api.getExtractionResults(modelId, documentId);
  const { data } = extractionResultsResponse;
  return data;
}

//...
```

Embed a Butler Document Labeler

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
// ... Include the previous functions we've defined above

// This function defines what action to take when the user clicks
// the save button in the document labeler
const onSaveCallback = (docInfo) => {
  // The next section will outline how to use this to train your model
  // For now, we'll just log the output.
  console.log(docInfo);
};

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

Submit Training Labels Programmatically

```js
// ... Include the previous functions we've defined above

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
  // Here, we update the onSaveCallback to trigger the submit labels endpoint
    submitLabels(docInfo.trainingDocumentLabels);
};

// ... Then, initialize your Document Labeler as described above!

```
