import { useEffect, useState } from 'react';
import { getLibraryResources } from '../../services/index.js';
import { ResourceCard } from '../../components/library/ResourceCard.js';
import { ResourceDetail } from '../../components/library/ResourceDetail.js';
import { UploadResource } from '../../components/library/UploadResource.js';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Library.module.css';

interface LibraryResource {
  id: number;
  programId: number | null;
  title: string;
  description: string | null;
  type: 'video' | 'audio' | 'document';
  source: string;
  thumbnailUrl: string | null;
  status: 'pending' | 'processing' | 'indexed' | 'failed';
  transcriptJson: string | null;
  durationSeconds: number | null;
  speakerMetaJson: string | null;
  createdAt: string;
  updatedAt: string;
}

const Library: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LibraryResource[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] =
    useState<LibraryResource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = resources;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.source.toLowerCase().includes(search)
      );
    }

    setFilteredResources(filtered);
  }, [resources, statusFilter, searchTerm]);

  const loadResources = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getLibraryResources();
      setResources(data.resources || []);
    } catch (error_) {
      console.error('Failed to load library resources:', error_);
      setError('Failed to load library resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceClick = (resource: LibraryResource) => {
    setSelectedResource(resource);
  };

  const handleCloseDetail = () => {
    setSelectedResource(null);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    loadResources();
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading library...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Content Library</h1>
          <p className={styles.subtitle}>
            Browse videos, transcripts, and indexed content powering your AI
            coach
          </p>
        </div>
        {isAdmin && (
          <button
            className={styles.uploadButton}
            onClick={() => setShowUploadModal(true)}
            type="button"
          >
            + Upload Resource
          </button>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="indexed">Indexed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              type="button"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              type="button"
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>No resources found</h2>
          <p className={styles.emptyText}>
            {resources.length === 0
              ? 'Upload your first video or content to get started.'
              : 'Try adjusting your filters or search term.'}
          </p>
          {isAdmin && resources.length === 0 && (
            <button
              className={styles.emptyButton}
              onClick={() => setShowUploadModal(true)}
              type="button"
            >
              Upload First Resource
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => handleResourceClick(resource)}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      )}

      {selectedResource && (
        <ResourceDetail
          resource={selectedResource}
          onClose={handleCloseDetail}
          formatDuration={formatDuration}
        />
      )}

      {showUploadModal && isAdmin && (
        <UploadResource
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Library;
