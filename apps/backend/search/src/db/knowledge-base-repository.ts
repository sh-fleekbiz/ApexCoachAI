import { withClient } from '@shared/data';

export const knowledgeBaseRepository = {
  async getOverview() {
    return withClient(async (client) => {
      const totalResourcesResult = await client.query(
        'SELECT COUNT(*) as count FROM library_resources'
      );
      const totalResources = parseInt(totalResourcesResult.rows[0].count, 10);

      const trainedResult = await client.query(
        'SELECT COUNT(*) as count FROM kb_documents WHERE status = $1',
        ['trained']
      );
      const trainedDocuments = parseInt(
        trainedResult.rows[0]?.count || '0',
        10
      );

      const pendingResult = await client.query(
        'SELECT COUNT(*) as count FROM kb_documents WHERE status = $1',
        ['pending']
      );
      const pendingDocuments = parseInt(
        pendingResult.rows[0]?.count || '0',
        10
      );

      const failedResult = await client.query(
        'SELECT COUNT(*) as count FROM kb_documents WHERE status = $1',
        ['failed']
      );
      const failedDocuments = parseInt(failedResult.rows[0]?.count || '0', 10);

      const documentsResult = await client.query('SELECT * FROM kb_documents');
      const documents = documentsResult.rows;

      return {
        totalResources,
        trainedDocuments,
        pendingDocuments,
        failedDocuments,
        documents,
      };
    });
  },
};
