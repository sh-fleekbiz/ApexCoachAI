import React from 'react';
import styles from './ResourceDetail.module.css';
import { VideoPlayer } from './VideoPlayer.js';

interface Resource {
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

interface ResourceDetailProps {
  resource: Resource;
  onClose: () => void;
  formatDuration: (seconds: number | null) => string;
}

export const ResourceDetail: React.FC<ResourceDetailProps> = ({
  resource,
  onClose,
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

  const handleCopyUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}#/library?id=${resource.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{resource.title}</h2>
            <div className={styles.metadata}>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(resource.status) }}
              >
                {resource.status}
              </span>
              {resource.durationSeconds && (
                <span className={styles.metaItem}>
                  ⏱ {formatDuration(resource.durationSeconds)}
                </span>
              )}
              <span className={styles.metaItem}>
                📅 {formatDate(resource.createdAt)}
              </span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {resource.type === 'video' && (
            <VideoPlayer
              source={resource.source}
              transcriptJson={resource.transcriptJson}
              title={resource.title}
            />
          )}

          {resource.type === 'audio' && (
            <div className={styles.audioPlayer}>
              <audio src={resource.source} controls className={styles.audio}>
                Your browser does not support the audio element.
              </audio>
              {resource.transcriptJson && (
                <div className={styles.transcriptOnly}>
                  {/* Could reuse TranscriptViewer here without video sync */}
                  <p>Transcript available</p>
                </div>
              )}
            </div>
          )}

          {resource.type === 'document' && (
            <div className={styles.documentViewer}>
              <p>Document preview not available</p>
              <a
                href={resource.source}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                Download Document
              </a>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.shareButton}
            onClick={handleCopyUrl}
            type="button"
          >
            🔗 Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};
