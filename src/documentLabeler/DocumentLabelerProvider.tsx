import { createContext, useContext, useReducer } from 'react';
import { DocumentLabelerDispatch, documentLabelerReducer } from 'documentLabeler/state/DocumentLabelerReducer';
import { DocumentLabelerData, DocumentLabelerInternalState, DocumentLabelerState } from 'documentLabeler/state/DocumentLabelerState';

export const DocumentLabelerStateContext = createContext<DocumentLabelerInternalState | null>(null);

export const DocumentLabelerDispatchContext = createContext<DocumentLabelerDispatch | null>(null);

  type Props = {
   data: DocumentLabelerData;
   onSaveCallback: (outputData: object) => void;
   children: React.ReactNode;
  };

  /**
  * Document Labeler Provider, handles state management and actions for the Document Labeler
  *
  * State functions are handled in DocuemntLabelerState.tsx and the
  * Action reducer is handled in DocumentLabelerReducer.tsx
  */
  export const DocumentLabelerProvider: React.FC<Props> = ({
   data,
   onSaveCallback,
   children,
  }) => {
   const [state, dispatch] = useReducer(
     documentLabelerReducer,
     DocumentLabelerState.generateInitialState(data, onSaveCallback),
   );

   return (
     <DocumentLabelerStateContext.Provider value={state}>
       <DocumentLabelerDispatchContext.Provider value={dispatch}>
         {children}
       </DocumentLabelerDispatchContext.Provider>
     </DocumentLabelerStateContext.Provider>
   );
  };

  /**
  * This useState fn is responsible for transforming the internal state of
  * this provider into more easily consumable external state for
  * use in children components.
  */
  const useState = (): DocumentLabelerInternalState => {
   const context = useContext(DocumentLabelerStateContext);

   if (context === null) {
     throw new Error('Document Labeler useState must be used within a Provider');
   }

   return context;
  };

  const useDispatch = (): DocumentLabelerDispatch => {
   const context = useContext(DocumentLabelerDispatchContext);

   if (context === null) {
     throw new Error('Document Labeler useDispatch must be used within a Provider');
   }

   return context;
  };

  export const useDocumentLabeler = () => {
   return { state: useState(), dispatch: useDispatch() };
  };
