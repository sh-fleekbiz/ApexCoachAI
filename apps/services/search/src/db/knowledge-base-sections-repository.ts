/**
 * Knowledge Base Sections Repository
 * 
 * Handles CRUD operations for knowledge_base_sections table (vector storage).
 * Uses raw SQL for pgvector operations since Prisma doesn't support pgvector natively.
 */

import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

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

export const createKnowledgeBaseSectionsRepository = (prisma: PrismaClient) => ({
  /**
   * Get all sections for a document (by sourcefile)
   */
  async getSectionsBySourcefile(sourcefile: string): Promise<KnowledgeBaseSection[]> {
    const result = await prisma.$queryRaw<KnowledgeBaseSection[]>`
      SELECT id, index_name, content, category, sourcepage, sourcefile, program_id, created_at
      FROM knowledge_base_sections
      WHERE sourcefile = ${sourcefile}
      ORDER BY sourcepage
    `;
    return result;
  },

  /**
   * Delete all sections for a specific sourcefile
   */
  async deleteSectionsBySourcefile(sourcefile: string): Promise<number> {
    const result = await prisma.$executeRaw`
      DELETE FROM knowledge_base_sections WHERE sourcefile = ${sourcefile}
    `;
    return result;
  },

  /**
   * Delete all sections for a specific index name
   */
  async deleteSectionsByIndexName(indexName: string): Promise<number> {
    const result = await prisma.$executeRaw`
      DELETE FROM knowledge_base_sections WHERE index_name = ${indexName}
    `;
    return result;
  },

  /**
   * Insert a single section with embedding
   */
  async insertSection(indexName: string, section: SectionInput): Promise<KnowledgeBaseSection> {
    const embeddingVector = `[${section.embedding.join(',')}]`;
    const result = await prisma.$queryRaw<KnowledgeBaseSection[]>`
      INSERT INTO knowledge_base_sections
        (index_name, content, category, sourcepage, sourcefile, program_id, embedding)
      VALUES (
        ${indexName},
        ${section.content},
        ${section.category},
        ${section.sourcepage},
        ${section.sourcefile},
        ${section.program_id ?? null},
        ${embeddingVector}::vector
      )
      RETURNING id, index_name, content, category, sourcepage, sourcefile, program_id, created_at
    `;
    return result[0];
  },

  /**
   * Insert multiple sections in batch
   */
  async insertSectionsBatch(indexName: string, sections: SectionInput[]): Promise<number> {
    if (sections.length === 0) return 0;

    let inserted = 0;
    for (const section of sections) {
      if (!section.embedding || section.embedding.length === 0) {
        continue;
      }
      const embeddingVector = `[${section.embedding.join(',')}]`;
      await prisma.$executeRaw`
        INSERT INTO knowledge_base_sections
          (index_name, content, category, sourcepage, sourcefile, program_id, embedding)
        VALUES (
          ${indexName},
          ${section.content},
          ${section.category},
          ${section.sourcepage},
          ${section.sourcefile},
          ${section.program_id ?? null},
          ${embeddingVector}::vector
        )
      `;
      inserted++;
    }
    return inserted;
  },

  /**
   * Count sections for a specific sourcefile
   */
  async countSectionsBySourcefile(sourcefile: string): Promise<number> {
    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM knowledge_base_sections WHERE sourcefile = ${sourcefile}
    `;
    return Number(result[0]?.count || 0);
  },

  /**
   * Count sections for a specific index
   */
  async countSectionsByIndexName(indexName: string): Promise<number> {
    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM knowledge_base_sections WHERE index_name = ${indexName}
    `;
    return Number(result[0]?.count || 0);
  },
});
