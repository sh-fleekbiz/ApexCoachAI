import React, { useEffect, useState } from 'react';
import {
  apiBaseUrl,
  bulkDeleteKnowledgeBaseDocuments,
  bulkRetrainKnowledgeBaseDocuments,
  deleteKnowledgeBaseDocument,
  getKnowledgeBaseDocuments,
  retrainKnowledgeBaseDocument,
  updateKnowledgeBaseDocument,
} from '../../../api/index.js';
import { BulkActions } from '../../../components/knowledge-base/BulkActions.js';
import { DocumentStatusBadge } from '../../../components/knowledge-base/DocumentStatusBadge.js';
import { EmptyKnowledgeBase } from '../../../components/knowledge-base/EmptyKnowledgeBase.js';
import { UploadDocument } from '../../../components/knowledge-base/UploadDocument.js';
import styles from './KnowledgeBase.module.css';

interface KnowledgeBaseDocument {
  id: number;
  program_id: number | null;
  program_name?: string;
  title: string;
  type: string;
  source: string;
  status: string;
  training_status: 'not_trained' | 'training' | 'trained' | 'failed';
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface Program {
  id: number;
  name: string;
}

const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalDocuments: 0,
    trainedDocuments: 0,
    trainingDocuments: 0,
    notTrainedDocuments: 0,
    failedDocuments: 0,
  });

  useEffect(() => {
    loadDocuments();
    loadPrograms();

    // Poll for training status updates every 5 seconds
    const interval = setInterval(() => {
      if (documents.some((doc) => doc.training_status === 'training')) {
        loadDocuments();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [statusFilter, searchQuery]);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.trainingStatus = statusFilter;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }

      const data = await getKnowledgeBaseDocuments(filters);
      setDocuments(data.documents || []);
      setStats({
        totalDocuments: data.totalDocuments || 0,
        trainedDocuments: data.trainedDocuments || 0,
        trainingDocuments: data.trainingDocuments || 0,
        notTrainedDocuments: data.notTrainedDocuments || 0,
        failedDocuments: data.failedDocuments || 0,
      });
    } catch (error_) {
      console.error('Failed to load documents:', error_);
      setError('Failed to load knowledge base documents');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/programs`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data || []);
      }
    } catch (error_) {
      console.error('Failed to load programs:', error_);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleSelectDoc = (id: number) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocs.size === documents.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents.map((doc) => doc.id)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteKnowledgeBaseDocument(id);
      showMessage('success', 'Document deleted successfully');
      await loadDocuments();
    } catch (error_) {
      showMessage('error', 'Failed to delete document');
    }
  };

  const handleRetrain = async (id: number) => {
    try {
      await retrainKnowledgeBaseDocument(id);
      showMessage('success', 'Retraining initiated');
      await loadDocuments();
    } catch (error_) {
      showMessage('error', 'Failed to retrain document');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteKnowledgeBaseDocuments(Array.from(selectedDocs));
      showMessage('success', `${selectedDocs.size} documents deleted`);
      setSelectedDocs(new Set());
      await loadDocuments();
    } catch (error_) {
      showMessage('error', 'Failed to delete documents');
    }
  };

  const handleBulkRetrain = async () => {
    try {
      await bulkRetrainKnowledgeBaseDocuments(Array.from(selectedDocs));
      showMessage(
        'success',
        `${selectedDocs.size} documents queued for retraining`
      );
      setSelectedDocs(new Set());
      await loadDocuments();
    } catch (error_) {
      showMessage('error', 'Failed to retrain documents');
    }
  };

  const handleBulkAssignProgram = async (programId: number | null) => {
    try {
      const promises = Array.from(selectedDocs).map((id) =>
        updateKnowledgeBaseDocument(id, { programId })
      );
      await Promise.all(promises);
      showMessage('success', 'Program assignment updated');
      setSelectedDocs(new Set());
      await loadDocuments();
    } catch (error_) {
      showMessage('error', 'Failed to assign program');
    }
  };

  const handleUploadComplete = () => {
    loadDocuments();
    showMessage('success', 'Document uploaded successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📋';
      case 'url':
        return '🔗';
      default:
        return '📁';
    }
  };

  if (loading && documents.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading knowledge base...</div>
      </div>
    );
  }

  if (documents.length === 0 && !searchQuery && statusFilter === 'all') {
    return (
      <div className={styles.container}>
        <EmptyKnowledgeBase onUploadClick={() => setIsUploadOpen(true)} />
        <UploadDocument
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadComplete={handleUploadComplete}
          programs={programs}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Knowledge Base</h1>
          <p className={styles.subtitle}>
            Manage training documents for RAG-powered AI responses
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className={styles.uploadButton}
        >
          📤 Upload Document
        </button>
      </div>

      {actionMessage && (
        <div
          className={
            actionMessage.type === 'success'
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {actionMessage.text}
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalDocuments}</div>
            <div className={styles.statLabel}>Total Documents</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.trainedDocuments}</div>
            <div className={styles.statLabel}>Trained</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔄</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.trainingDocuments}</div>
            <div className={styles.statLabel}>Training</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.notTrainedDocuments}</div>
            <div className={styles.statLabel}>Not Trained</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="🔍 Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="trained">✅ Trained</option>
          <option value="training">🔄 Training</option>
          <option value="not_trained">⏳ Not Trained</option>
          <option value="failed">❌ Failed</option>
        </select>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedDocs.size}
        onDeleteAll={handleBulkDelete}
        onRetrainAll={handleBulkRetrain}
        onAssignProgram={handleBulkAssignProgram}
        onClearSelection={() => setSelectedDocs(new Set())}
        programs={programs}
      />

      {/* Documents Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxColumn}>
                <input
                  type="checkbox"
                  checked={
                    selectedDocs.size === documents.length &&
                    documents.length > 0
                  }
                  onChange={handleSelectAll}
                  aria-label="Select all documents"
                />
              </th>
              <th>Title</th>
              <th>Type</th>
              <th>Training Status</th>
              <th>Program</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className={selectedDocs.has(doc.id) ? styles.selectedRow : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDocs.has(doc.id)}
                    onChange={() => handleSelectDoc(doc.id)}
                    aria-label={`Select ${doc.title}`}
                  />
                </td>
                <td>
                  <div className={styles.titleCell}>
                    <span className={styles.typeIcon}>
                      {getTypeIcon(doc.type)}
                    </span>
                    <span className={styles.docTitle}>{doc.title}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.typeBadge}>
                    {doc.type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <DocumentStatusBadge status={doc.training_status} />
                </td>
                <td>
                  {doc.program_name ? (
                    <span className={styles.programBadge}>
                      {doc.program_name}
                    </span>
                  ) : (
                    <span className={styles.noProgram}>—</span>
                  )}
                </td>
                <td className={styles.dateCell}>
                  {new Date(doc.updated_at).toLocaleDateString()}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleRetrain(doc.id)}
                      className={styles.actionButton}
                      title="Retrain document"
                      disabled={doc.training_status === 'training'}
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className={`${styles.actionButton} ${styles.deleteAction}`}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {documents.length === 0 && (searchQuery || statusFilter !== 'all') && (
        <div className={styles.noResults}>
          <p>No documents match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <UploadDocument
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
        programs={programs}
      />
    </div>
  );
};

export default KnowledgeBase;
