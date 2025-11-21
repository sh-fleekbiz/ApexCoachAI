import React, { useEffect, useState } from 'react';

interface KnowledgeBaseOverview {
  totalResources: number;
  trainedDocuments: number;
  pendingDocuments: number;
  failedDocuments: number;
  documents: any[];
}

const KnowledgeBase: React.FC = () => {
  const [overview, setOverview] = useState<KnowledgeBaseOverview | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/knowledge-base');
      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge base overview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Knowledge Base Overview</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (overview ? (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 shadow">
              <h2 className="text-lg font-bold">Total Resources</h2>
              <p className="text-2xl">{overview.totalResources}</p>
            </div>
            <div className="bg-white p-4 shadow">
              <h2 className="text-lg font-bold">Trained Documents</h2>
              <p className="text-2xl">{overview.trainedDocuments}</p>
            </div>
            <div className="bg-white p-4 shadow">
              <h2 className="text-lg font-bold">Pending/Processing</h2>
              <p className="text-2xl">{overview.pendingDocuments}</p>
            </div>
            <div className="bg-white p-4 shadow">
              <h2 className="text-lg font-bold">Failed</h2>
              <p className="text-2xl">{overview.failedDocuments}</p>
            </div>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Resource Title</th>
                <th className="py-2">Type</th>
                <th className="py-2">Program</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created At</th>
                <th className="py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {overview.documents.map((document) => (
                <tr key={document.id}>
                  <td className="border px-4 py-2">{document.resource_title}</td>
                  <td className="border px-4 py-2">{document.type}</td>
                  <td className="border px-4 py-2">{document.program || '-'}</td>
                  <td className="border px-4 py-2">{document.status}</td>
                  <td className="border px-4 py-2">{new Date(document.created_at).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(document.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Failed to load overview.</p>
      ))}
    </div>
  );
};

export default KnowledgeBase;
