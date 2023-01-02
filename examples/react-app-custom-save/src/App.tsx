import './App.css';
import { useEffect, useRef } from 'react';
import { loadButlerBlocks } from 'butler-blocks';

// Replace this with your API key
const myApiKey = 'YOUR_API_KEY';

// Replace these with your model and document IDs
const myDocument = {
  modelId: 'YOUR_MODEL_ID',
  documentId: 'YOUR_DOCUMENT_ID',
};

type DocParams = {
  modelId: string;
  documentId: string;
};

function App() {

  const butlerBlocksRef = useRef<any | null>();
  const updatedLabels = useRef<any | null>(null);

  // Create a custom save function to be called by your custom button
  const customSaveLabels = () => {
    if (updatedLabels.current) {

      const trainingDocumentLabels = updatedLabels.current.trainingDocumentLabels;

      // Make call to your API with the updated labels
      console.log('trainingDocumentLabels', trainingDocumentLabels);

      // If you want to save the labels to Butler for future training, 
      // you can use the submitDocumentLabels function
      // const butlerBlocks = butlerBlocksRef.current;
      // butlerBlocks.api.submitDocumentLabels(
      //   myDocument.modelId,
      //   myDocument.documentId,
      //   trainingDocumentLabels.results
      // );
    }
  }
  
  // Initialize Butler Blocks on component mount
  useEffect(() => {
    butlerBlocksRef.current = loadButlerBlocks(myApiKey);
    const butlerBlocks = butlerBlocksRef.current;

    // On component mount, fetch the document data from the API
    const fetchDocumentData = async (modelId: any, documentId: any) => {
      const extractionResultsResponse =
        await butlerBlocks.api.getExtractionResults(modelId, documentId);
      const { data } = extractionResultsResponse;
      return data;
    }  

    // Define a callback function to be passed as a prop to the labeler
    // Since we are using a custom save button, this function should never be called
    const onSaveCallback = (docInfo: any) => {
      throw new Error('This should never be called');
    };

    const initializeDocLabeler = async ({ modelId, documentId }: DocParams) => {
      // Use the function we defined earlier to fetch document data
      const data = await fetchDocumentData(modelId, documentId);
    
      // Note: the first parameter for this function should be the Id
      // that you specified in your html div element
      butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, {
        onSaveCallback,
        displayOnly: false,
        // Hide the default save button since we are using a custom one instead
        hideSaveButton: true,
        // Define a custom function to format the field names
        fieldDisplayNameFormatter: (fieldName: string) => fieldName.toUpperCase(),
        // Save the updated labels in a ref so we can access them later via the custom save button
        onLabelUpdate: (docInfo: any) => {
          updatedLabels.current = docInfo;
        }
      });
    };
    
    // Call this function when you want to display the labeler!
    initializeDocLabeler(myDocument);
  }, []);

  return (
    <div>
      {/* The Document Labeler component will attach to this div */}
      <div className='App' id='ButlerDocumentLabeler'>
      </div>

      {/* Custom save button */}
      <div className='CustomSave-container'>
        <button className='CustomSave-button' onClick={customSaveLabels}>Save Changes</button>
      </div>
    </div>
  );
}

export default App;