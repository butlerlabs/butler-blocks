import { DocumentLabelerInternalState } from "documentLabeler/state/DocumentLabelerState";
import { FieldLabelDto } from "documentLabeler/types/DocumentLabelerTypes";

/**
 * Helper function to look up active field information for a specified 
 * field Id in the document labeler state.  
 * @param state 
 * @param fieldId 
 * @returns the field information and its index in the fields list
 */
const getActiveFieldFromState = (
  state: DocumentLabelerInternalState, 
  fieldId: string
): { 
  activeField: FieldLabelDto, 
  idx: number,
} => {
  const { fields } = state.docInfo.labels;
  const activeFieldIdx = fields.findIndex((field) => field.id === fieldId);
  if (activeFieldIdx === -1) {
    throw new Error(`Did not find unique field info in document labels when looking up field id ${fieldId}`)
  }
  return {
    activeField: fields[activeFieldIdx],
    idx: activeFieldIdx,
  }
}

export const DocumentLabelerReducerUtils = {
  getActiveFieldFromState,
};