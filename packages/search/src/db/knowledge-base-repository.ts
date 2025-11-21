import { database } from './database.js';

export const knowledgeBaseRepository = {
  getOverview() {
    const totalResources = database.prepare('SELECT COUNT(*) as count FROM library_resources').get() as { count: number };
    const trainedDocuments = database.prepare('SELECT COUNT(*) as count FROM kb_documents WHERE status = ?').get('trained') as { count: number };
    const pendingDocuments = database.prepare('SELECT COUNT(*) as count FROM kb_documents WHERE status = ?').get('pending') as { count: number };
    const failedDocuments = database.prepare('SELECT COUNT(*) as count FROM kb_documents WHERE status = ?').get('failed') as { count: number };
    const documents = database.prepare('SELECT * FROM kb_documents').all();

    return {
      totalResources: totalResources.count,
      trainedDocuments: trainedDocuments.count,
      pendingDocuments: pendingDocuments.count,
      failedDocuments: failedDocuments.count,
      documents,
    };
  },
};
