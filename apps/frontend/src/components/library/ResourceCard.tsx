import React from 'react';
import styles from './ResourceCard.module.css';

interface Resource {
  id: number;
  title: string;
  description: string | null;
  type: 'video' | 'audio' | 'document';
  thumbnailUrl: string | null;
  status: 'pending' | 'processing' | 'indexed' | 'failed';
  durationSeconds: number | null;
  createdAt: string;
}

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
  formatDuration: (seconds: number | null) => string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onClick,
  formatDuration,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'indexed':
        return '#10b981';
      case 'processing':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbnailContainer}>
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <span className={styles.typeIcon}>
              {getTypeIcon(resource.type)}
            </span>
          </div>
        )}
        {resource.durationSeconds && (
          <div className={styles.duration}>
            {formatDuration(resource.durationSeconds)}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{resource.title}</h3>

        {resource.description && (
          <p className={styles.description}>{resource.description}</p>
        )}

        <div className={styles.footer}>
          <span
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(resource.status) }}
          >
            {resource.status}
          </span>
          <span className={styles.date}>{formatDate(resource.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
