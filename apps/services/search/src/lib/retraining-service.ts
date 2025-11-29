/**
 * Knowledge Base Retraining Service
 * 
 * Handles the full retraining workflow:
 * 1. Fetch document content from source
 * 2. Process and chunk the content
 * 3. Generate embeddings
 * 4. Store sections in database
 * 5. Update document status
 */

import { EmbeddingService, chunkText, type Logger } from './embedding-service.js';
import { knowledgeBaseSectionsRepository, type SectionInput } from '../db/knowledge-base-sections-repository.js';
import { knowledgeBaseRepository } from '../db/knowledge-base-repository.js';

export interface RetrainResult {
  success: boolean;
  documentId: number;
  sectionsCreated: number;
  error?: string;
}

export class RetrainingService {
  private embeddingService: EmbeddingService;
  private logger: Logger;
  private indexName: string;

  constructor(logger: Logger, indexName: string = 'apexcoach-kb') {
    this.logger = logger;
    this.indexName = indexName;
    this.embeddingService = new EmbeddingService(logger);
  }

  /**
   * Retrain a single document by ID
   */
  async retrainDocument(documentId: number): Promise<RetrainResult> {
    this.logger.info({ documentId }, 'Starting document retraining');

    try {
      // 1. Fetch document metadata
      const document = await knowledgeBaseRepository.getDocumentById(documentId);
      if (!document) {
        return {
          success: false,
          documentId,
          sectionsCreated: 0,
          error: 'Document not found',
        };
      }

      // 2. Get content from source
      const content = await this.fetchDocumentContent(document);
      if (!content || content.trim().length === 0) {
        await knowledgeBaseRepository.updateDocument(documentId, {
          trainingStatus: 'failed',
        });
        return {
          success: false,
          documentId,
          sectionsCreated: 0,
          error: 'Could not fetch content from source',
        };
      }

      this.logger.info({ documentId, contentLength: content.length }, 'Fetched document content');

      // 3. Delete existing sections for this document
      const sourceIdentifier = `kb-doc-${documentId}`;
      await knowledgeBaseSectionsRepository.deleteSectionsBySourcefile(sourceIdentifier);
      this.logger.debug({ documentId }, 'Deleted old sections');

      // 4. Chunk the content
      const chunks = chunkText(content, 1000, 100);
      this.logger.info({ documentId, chunks: chunks.length }, 'Split content into chunks');

      // 5. Generate embeddings in batches
      const sections: SectionInput[] = [];
      const batchSize = 20;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const embeddings = await this.embeddingService.createEmbeddingsBatch(batch);

        for (let j = 0; j < batch.length; j++) {
          if (embeddings[j] && embeddings[j].length > 0) {
            sections.push({
              content: batch[j],
              sourcepage: `${sourceIdentifier}#chunk=${i + j + 1}`,
              sourcefile: sourceIdentifier,
              category: document.type,
              program_id: document.program_id,
              embedding: embeddings[j],
            });
          }
        }

        this.logger.debug(
          { batch: Math.floor(i / batchSize) + 1, total: Math.ceil(chunks.length / batchSize) },
          'Processed embedding batch'
        );
      }

      // 6. Insert new sections
      const inserted = await knowledgeBaseSectionsRepository.insertSectionsBatch(
        this.indexName,
        sections
      );

      this.logger.info({ documentId, inserted }, 'Inserted new sections');

      // 7. Update document status
      await knowledgeBaseRepository.updateDocument(documentId, {
        trainingStatus: 'trained',
      });

      return {
        success: true,
        documentId,
        sectionsCreated: inserted,
      };
    } catch (error) {
      this.logger.error({ documentId, error }, 'Failed to retrain document');

      // Mark as failed
      try {
        await knowledgeBaseRepository.updateDocument(documentId, {
          trainingStatus: 'failed',
        });
      } catch {
        // Ignore error updating status
      }

      return {
        success: false,
        documentId,
        sectionsCreated: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Retrain multiple documents
   */
  async retrainDocuments(documentIds: number[]): Promise<RetrainResult[]> {
    const results: RetrainResult[] = [];

    for (const documentId of documentIds) {
      const result = await this.retrainDocument(documentId);
      results.push(result);
    }

    return results;
  }

  /**
   * Fetch content from document source
   */
  private async fetchDocumentContent(document: any): Promise<string> {
    const { source, type, metadata } = document;

    // Check if content is stored in metadata
    if (metadata?.content) {
      return metadata.content;
    }

    // For URL sources, fetch the content
    if (type === 'url' && source.startsWith('http')) {
      try {
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        // Basic HTML to text conversion
        return this.htmlToText(html);
      } catch (error) {
        this.logger.error({ source, error }, 'Failed to fetch URL content');
        return '';
      }
    }

    // For file sources (pdf, txt, docx), check if content is stored
    // If not, we need the content to be passed via metadata
    if (metadata?.text) {
      return metadata.text;
    }

    // Try to read from Azure Blob Storage if source is a blob path
    if (source.includes('blob.core.windows.net')) {
      try {
        const response = await fetch(source);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        this.logger.warn({ source, error }, 'Could not fetch from blob storage');
      }
    }

    // Return empty if we can't fetch content
    this.logger.warn({ documentId: document.id, source, type }, 'No content available for document');
    return '';
  }

  /**
   * Basic HTML to plain text conversion
   */
  private htmlToText(html: string): string {
    return html
      // Remove scripts and styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Convert common elements to text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      // Remove all remaining tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
  }
}
