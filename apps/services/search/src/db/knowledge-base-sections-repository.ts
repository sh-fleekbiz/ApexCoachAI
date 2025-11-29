/**
 * Knowledge Base Sections Repository
 * 
 * Handles CRUD operations for knowledge_base_sections table (vector storage).
 */

import { withClient } from '../lib/db.js';

export interface KnowledgeBaseSection {
  id: number;
  index_name: string;
  content: string;
  category: string;
  sourcepage: string;
  sourcefile: string;
  program_id: number | null;
  embedding: number[];
  created_at: Date;
}

export interface SectionInput {
  content: string;
  category: string;
  sourcepage: string;
  sourcefile: string;
  program_id?: number | null;
  embedding: number[];
}

export const knowledgeBaseSectionsRepository = {
  /**
   * Get all sections for a document (by sourcefile)
   */
  async getSectionsBySourcefile(sourcefile: string): Promise<KnowledgeBaseSection[]> {
    return withClient(async (client) => {
      const result = await client.query(
        `SELECT id, index_name, content, category, sourcepage, sourcefile, program_id, created_at
         FROM knowledge_base_sections
         WHERE sourcefile = $1
         ORDER BY sourcepage`,
        [sourcefile]
      );
      return result.rows;
    });
  },

  /**
   * Delete all sections for a specific sourcefile
   */
  async deleteSectionsBySourcefile(sourcefile: string): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        'DELETE FROM knowledge_base_sections WHERE sourcefile = $1',
        [sourcefile]
      );
      return result.rows?.length || 0;
    });
  },

  /**
   * Delete all sections for a specific index name
   */
  async deleteSectionsByIndexName(indexName: string): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        'DELETE FROM knowledge_base_sections WHERE index_name = $1',
        [indexName]
      );
      return result.rows?.length || 0;
    });
  },

  /**
   * Insert a single section with embedding
   */
  async insertSection(indexName: string, section: SectionInput): Promise<KnowledgeBaseSection> {
    return withClient(async (client) => {
      const embeddingVector = `[${section.embedding.join(',')}]`;
      const result = await client.query(
        `INSERT INTO knowledge_base_sections
          (index_name, content, category, sourcepage, sourcefile, program_id, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
         RETURNING id, index_name, content, category, sourcepage, sourcefile, program_id, created_at`,
        [
          indexName,
          section.content,
          section.category,
          section.sourcepage,
          section.sourcefile,
          section.program_id ?? null,
          embeddingVector,
        ]
      );
      return result.rows[0];
    });
  },

  /**
   * Insert multiple sections in batch
   */
  async insertSectionsBatch(indexName: string, sections: SectionInput[]): Promise<number> {
    if (sections.length === 0) return 0;

    return withClient(async (client) => {
      let inserted = 0;
      for (const section of sections) {
        if (!section.embedding || section.embedding.length === 0) {
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
          ]
        );
        inserted++;
      }
      return inserted;
    });
  },

  /**
   * Count sections for a specific sourcefile
   */
  async countSectionsBySourcefile(sourcefile: string): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_sections WHERE sourcefile = $1',
        [sourcefile]
      );
      return parseInt(result.rows[0]?.count || '0', 10);
    });
  },

  /**
   * Count sections for a specific index
   */
  async countSectionsByIndexName(indexName: string): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_sections WHERE index_name = $1',
        [indexName]
      );
      return parseInt(result.rows[0]?.count || '0', 10);
    });
  },
};
