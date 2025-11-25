import type { Citation } from 'shared/chat-types';
import styles from './CitationsList.module.css';

interface CitationsListProps {
  citations: Citation[];
}

export function CitationsList({ citations }: CitationsListProps) {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>📚</span>
        <span className={styles.title}>Sources Used: {citations.length}</span>
      </div>
      <div className={styles.citationsList}>
        {citations.map((citation, index) => (
          <div key={citation.id || index} className={styles.citationCard}>
            <div className={styles.citationHeader}>
              <span className={styles.citationType}>
                {citation.type === 'video' ? '🎥' : '📄'}
              </span>
              <span className={styles.citationTitle}>{citation.title}</span>
            </div>
            {citation.snippet && (
              <div className={styles.citationSnippet}>{citation.snippet}</div>
            )}
            <div className={styles.citationMeta}>
              {citation.page !== undefined && (
                <span className={styles.metaItem}>Page {citation.page}</span>
              )}
              {citation.startSeconds !== undefined && (
                <span className={styles.metaItem}>
                  {Math.floor(citation.startSeconds / 60)}:
                  {String(citation.startSeconds % 60).padStart(2, '0')}
                </span>
              )}
              <span className={styles.sourceId} title={citation.sourceId}>
                {citation.sourceId.split('/').pop() || citation.sourceId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
