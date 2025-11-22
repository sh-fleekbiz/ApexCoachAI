import {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential
} from "@azure/search-documents";

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const searchKey = process.env.AZURE_SEARCH_API_KEY;

if (!searchEndpoint || !searchKey) {
  throw new Error("AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_API_KEY not set");
}

const credential = new AzureKeyCredential(searchKey);

export function getSearchClient(indexName: string): SearchClient {
  return new SearchClient(searchEndpoint, indexName, credential);
}

export function getSearchIndexClient(): SearchIndexClient {
  return new SearchIndexClient(searchEndpoint, credential);
}

