import { encoding_for_model, type TiktokenModel } from '@dqbd/tiktoken';
import { type BaseLogger } from 'pino';
import { type AzureClients } from '../plugins/azure.js';
import { type OpenAiService } from '../plugins/openai.js';
import { BlobStorage } from './blob-storage.js';
import { DocumentProcessor } from './document-processor.js';
import { type Section } from './document.js';
import { extractText, extractTextFromPdf } from './formats/index.js';
import { MODELS_SUPPORTED_BATCH_SIZE } from './model-limits.js';
import { withClient } from './db.js';

export interface IndexFileOptions {
  useVectors?: boolean;
  uploadToStorage?: boolean;
  throwErrors?: boolean;
}

export interface FileInfos {
  filename: string;
  data: Buffer;
  type: string;
  category: string;
  programId?: number;
}

export class Indexer {
  private blobStorage: BlobStorage;

  constructor(
    private logger: BaseLogger,
    azure: AzureClients,
    private openai: OpenAiService,
    private embeddingModelName: string = 'text-embedding-3-small'
  ) {
    this.blobStorage = new BlobStorage(logger, azure);
  }

  async createSearchIndex(indexName: string, useSemanticRanker = false) {
    this.logger.debug(
      `Ensuring logical index "${indexName}" exists in Postgres (pgvector); no Azure Search is used.`,
    );
  }

  async deleteSearchIndex(indexName: string) {
    this.logger.debug(
      `Deleting logical index "${indexName}" from knowledge_base_sections table`,
    );

    await withClient(async (client) => {
      await client.query(
        'DELETE FROM knowledge_base_sections WHERE index_name = $1',
        [indexName],
      );
    });

    await this.blobStorage.deleteAll();
  }

  async indexFile(
    indexName: string,
    fileInfos: FileInfos,
    options: IndexFileOptions = {}
  ) {
    const { filename, data, type, category, programId } = fileInfos;
    this.logger.debug(
      `Indexing file "${filename}" into search index "${indexName}..."`
    );

    try {
      if (options.uploadToStorage) {
        // TODO: use separate containers for each index?
        await this.blobStorage.upload(filename, data, type);
      }

      const documentProcessor = new DocumentProcessor(this.logger);
      documentProcessor.registerFormatHandler('text/plain', extractText);
      documentProcessor.registerFormatHandler('text/markdown', extractText);
      documentProcessor.registerFormatHandler(
        'application/pdf',
        extractTextFromPdf
      );
      const document = await documentProcessor.createDocumentFromFile(
        filename,
        data,
        type,
        category,
        programId
      );
      const sections = document.sections;
      await this.updateEmbeddingsInBatch(sections);

      await withClient(async (client) => {
        for (const section of sections) {
          if (!section.embedding) {
            continue;
          }

          const embeddingVector = `[${section.embedding.join(',')}]`;

          await client.query(
            `INSERT INTO knowledge_base_sections
              (index_name, content, category, sourcepage, sourcefile, program_id, embedding)
             VALUES ($1, $2, $3, $4, $5, $6, $7::vector)`,
            [
              indexName,
              section.content,
              section.category,
              section.sourcepage,
              section.sourcefile,
              section.program_id ?? null,
              embeddingVector,
            ],
          );
        }
      });
    } catch (_error: unknown) {
      const error = _error as Error;
      if (options.throwErrors) {
        throw error;
      } else {
        this.logger.error(
          `Error indexing file "${filename}": ${error.message}`
        );
      }
    }
  }

  async deleteFromIndex(indexName: string, filename?: string) {
    this.logger.debug(
      `Removing sections from "${filename ?? '<all>'}" for logical index "${indexName}"`
    );
    await withClient(async (client) => {
      if (filename) {
        await client.query(
          'DELETE FROM knowledge_base_sections WHERE index_name = $1 AND sourcefile = $2',
          [indexName, filename],
        );
      } else {
        await client.query(
          'DELETE FROM knowledge_base_sections WHERE index_name = $1',
          [indexName],
        );
      }
    });

    if (filename) {
      await this.blobStorage.delete(filename);
    } else {
      await this.blobStorage.deleteAll();
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    // TODO: add retry
    const embeddingsClient = await this.openai.getEmbeddings();
    const result = await embeddingsClient.create({
      input: text,
      model: this.embeddingModelName,
    });
    return result.data[0].embedding;
  }

  async createEmbeddingsInBatch(texts: string[]): Promise<Array<number[]>> {
    // TODO: add retry
    const embeddingsClient = await this.openai.getEmbeddings();
    const result = await embeddingsClient.create({
      input: texts,
      model: this.embeddingModelName,
    });
    return result.data.map((d) => d.embedding);
  }

  async updateEmbeddingsInBatch(sections: Section[]): Promise<Section[]> {
    const batchSize = MODELS_SUPPORTED_BATCH_SIZE[this.embeddingModelName];
    const batchQueue: Section[] = [];
    let tokenCount = 0;

    for (const [index, section] of sections.entries()) {
      tokenCount += getTokenCount(section.content, this.embeddingModelName);
      batchQueue.push(section);

      if (
        tokenCount > batchSize.tokenLimit ||
        batchQueue.length >= batchSize.maxBatchSize ||
        index === sections.length - 1
      ) {
        const embeddings = await this.createEmbeddingsInBatch(
          batchQueue.map((section) => section.content)
        );
        for (const [index_, section] of batchQueue.entries())
          section.embedding = embeddings[index_];
        this.logger.debug(
          `Batch Completed. Batch size ${batchQueue.length} Token count ${tokenCount}`
        );

        batchQueue.length = 0;
        tokenCount = 0;
      }
    }

    return sections;
  }
}

export function getTokenCount(input: string, model: string): number {
  const encoder = encoding_for_model(model as TiktokenModel);
  const tokens = encoder.encode(input).length;
  encoder.free();
  return tokens;
}
