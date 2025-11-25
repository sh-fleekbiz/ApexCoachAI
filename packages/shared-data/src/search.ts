import {
  AzureKeyCredential,
  SearchClient,
  SearchIndexClient,
} from '@azure/search-documents';

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const searchKey = process.env.AZURE_SEARCH_API_KEY;

if (!searchEndpoint || !searchKey) {
  throw new Error('AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_API_KEY not set');
}

const credential = new AzureKeyCredential(searchKey);

export function getSearchClient<T extends object = Record<string, unknown>>(
  indexName: string
): SearchClient<T> {
  if (!searchEndpoint) {
    throw new Error('AZURE_SEARCH_ENDPOINT not set');
  }
  return new SearchClient<T>(searchEndpoint, indexName, credential);
}

export function getSearchIndexClient(): SearchIndexClient {
  if (!searchEndpoint) {
    throw new Error('AZURE_SEARCH_ENDPOINT not set');
  }
  return new SearchIndexClient(searchEndpoint, credential);
}
