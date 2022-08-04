import axios, { AxiosResponse } from 'axios';

import { TrainingDocumentResultDto } from 'common/types/DocumentLabelerTypes';
import { DocumentLabelerData } from 'documentLabeler/state/DocumentLabelerState';

const API_BASE_URL = 'https://app.butlerlabs.ai/api';

type GetExtractionResultsApiCall = (modelId: string, documentId: string) => Promise<AxiosResponse<DocumentLabelerData>>;
type SubmitDocumentLabelsApiCall = (
  modelId: string, 
  documentId: string, 
  labels: TrainingDocumentResultDto
) => Promise<AxiosResponse<void>>;

export type ButlerBlockApi = {
  getExtractionResults: GetExtractionResultsApiCall;
  submitDocumentLabels: SubmitDocumentLabelsApiCall;
}

const getAuthHeaders = (apiKey: string) => ({
  'Authorization': `Bearer ${apiKey}`
})

const createGetExtractionResultsApiCall = (
  apiKey: string,
  apiBaseUrl: string
): GetExtractionResultsApiCall => {
  return (
    modelId: string,
    documentId: string
  ) => {
    const authHeaders = getAuthHeaders(apiKey);

    const extractionResultsUrl =
      `${apiBaseUrl}/models/${modelId}/documents/${documentId}/enhanced_results`;

    return axios.get(
      extractionResultsUrl,
      { headers: { ...authHeaders } }
    );
  }
}

/**
 * Creates the Submit Document Labels API call for the API key
 * that is provided
 * @param apiKey
 * @param apiBaseUrl
 * @returns
 */
const createSubmitDocumentLabelsApiCall = (
  apiKey: string,
  apiBaseUrl: string
): SubmitDocumentLabelsApiCall => {
  return (
    modelId: string,
    documentId: string,
    labels: TrainingDocumentResultDto 
  ) => {
    const authHeaders = getAuthHeaders(apiKey);

    const submitLabelsUrl =
      `${apiBaseUrl}/models/${modelId}/documents/${documentId}/labels`;
    
    return axios.put(
      submitLabelsUrl,
      labels,
      { headers: { ...authHeaders }  }
    );
  }
}

/**
 * Factory used to initialize the Butler REST API using the provided API key.
 * @param apiKey Your personal API key
 * @param apiBaseUrl The API Base URL. Should be left to the default for most cases
 * @returns
 */
export const ButlerApiCallFactory = {
  create: (
    apiKey: string,
    apiBaseUrl: string = API_BASE_URL
  ): ButlerBlockApi => {
    return {
      getExtractionResults: createGetExtractionResultsApiCall(apiKey, apiBaseUrl),
      submitDocumentLabels: createSubmitDocumentLabelsApiCall(apiKey, apiBaseUrl)
    }
  }
}
