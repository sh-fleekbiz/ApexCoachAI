import { withClient } from '@shared/data';

interface KnowledgeBaseDocument {
  id: number;
  program_id: number | null;
  title: string;
  type: string;
  source: string;
  status: string;
  training_status: string;
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

interface KnowledgeBaseFilters {
  status?: string;
  search?: string;
  programId?: number;
  trainingStatus?: string;
}

export const knowledgeBaseRepository = {
  async getAllDocuments(
    filters?: KnowledgeBaseFilters
  ): Promise<KnowledgeBaseDocument[]> {
    return withClient(async (client) => {
      let query = `
        SELECT kd.*, p.name as program_name
        FROM knowledge_base_documents kd
        LEFT JOIN programs p ON kd.program_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (filters?.trainingStatus) {
        query += ` AND kd.training_status = $${paramIndex}`;
        params.push(filters.trainingStatus);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND kd.status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.programId) {
        query += ` AND kd.program_id = $${paramIndex}`;
        params.push(filters.programId);
        paramIndex++;
      }

      if (filters?.search) {
        query += ` AND kd.title ILIKE $${paramIndex}`;
        params.push(`%${filters.search}%`);
        paramIndex++;
      }

      query += ' ORDER BY kd.created_at DESC';

      const result = await client.query(query, params);
      return result.rows;
    });
  },

  async getDocumentById(id: number): Promise<KnowledgeBaseDocument | null> {
    return withClient(async (client) => {
      const result = await client.query(
        `SELECT kd.*, p.name as program_name
         FROM knowledge_base_documents kd
         LEFT JOIN programs p ON kd.program_id = p.id
         WHERE kd.id = $1`,
        [id]
      );
      return result.rows[0] || null;
    });
  },

  async createDocument(data: {
    title: string;
    type: string;
    source: string;
    programId?: number | null;
    metadata?: any;
  }): Promise<KnowledgeBaseDocument> {
    return withClient(async (client) => {
      const result = await client.query(
        `INSERT INTO knowledge_base_documents (title, type, source, program_id, metadata, status, training_status)
         VALUES ($1, $2, $3, $4, $5, 'pending', 'not_trained')
         RETURNING *`,
        [
          data.title,
          data.type,
          data.source,
          data.programId || null,
          data.metadata ? JSON.stringify(data.metadata) : null,
        ]
      );
      return result.rows[0];
    });
  },

  async updateDocument(
    id: number,
    data: Partial<{
      title: string;
      status: string;
      trainingStatus: string;
      metadata: any;
      programId: number | null;
    }>
  ): Promise<KnowledgeBaseDocument> {
    return withClient(async (client) => {
      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (data.title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        params.push(data.title);
        paramIndex++;
      }

      if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        params.push(data.status);
        paramIndex++;
      }

      if (data.trainingStatus !== undefined) {
        updates.push(`training_status = $${paramIndex}`);
        params.push(data.trainingStatus);
        paramIndex++;
      }

      if (data.metadata !== undefined) {
        updates.push(`metadata = $${paramIndex}`);
        params.push(JSON.stringify(data.metadata));
        paramIndex++;
      }

      if (data.programId !== undefined) {
        updates.push(`program_id = $${paramIndex}`);
        params.push(data.programId);
        paramIndex++;
      }

      params.push(id);
      const result = await client.query(
        `UPDATE knowledge_base_documents SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
      );
      return result.rows[0];
    });
  },

  async deleteDocument(id: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM knowledge_base_documents WHERE id = $1', [
        id,
      ]);
    });
  },

  async getOverview() {
    return withClient(async (client) => {
      const totalResult = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_documents'
      );
      const totalDocuments = parseInt(totalResult.rows[0].count, 10);

      const trainedResult = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_documents WHERE training_status = $1',
        ['trained']
      );
      const trainedDocuments = parseInt(
        trainedResult.rows[0]?.count || '0',
        10
      );

      const trainingResult = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_documents WHERE training_status = $1',
        ['training']
      );
      const trainingDocuments = parseInt(
        trainingResult.rows[0]?.count || '0',
        10
      );

      const notTrainedResult = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_documents WHERE training_status = $1',
        ['not_trained']
      );
      const notTrainedDocuments = parseInt(
        notTrainedResult.rows[0]?.count || '0',
        10
      );

      const failedResult = await client.query(
        'SELECT COUNT(*) as count FROM knowledge_base_documents WHERE training_status = $1',
        ['failed']
      );
      const failedDocuments = parseInt(failedResult.rows[0]?.count || '0', 10);

      // Also get library resources count for context
      const libraryResult = await client.query(
        'SELECT COUNT(*) as count FROM library_resources'
      );
      const totalResources = parseInt(libraryResult.rows[0].count, 10);

      return {
        totalDocuments,
        trainedDocuments,
        trainingDocuments,
        notTrainedDocuments,
        failedDocuments,
        totalResources,
      };
    });
  },
};
