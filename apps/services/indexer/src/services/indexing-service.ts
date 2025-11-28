import type { Indexer, FileInfos, IndexFileOptions } from '../lib/indexer.js';

export const indexingService = {
  async createIndex(indexer: Indexer, name: string): Promise<void> {
    await indexer.createSearchIndex(name);
  },

  async deleteIndex(indexer: Indexer, name: string): Promise<void> {
    await indexer.deleteSearchIndex(name);
  },

  async indexFile(
    indexer: Indexer,
    indexName: string,
    fileInfos: FileInfos,
    options?: IndexFileOptions
  ): Promise<void> {
    await indexer.indexFile(indexName, fileInfos, options);
  },

  async deleteFromIndex(
    indexer: Indexer,
    indexName: string,
    filename?: string
  ): Promise<void> {
    await indexer.deleteFromIndex(indexName, filename);
  },
};
