import { useState } from 'react';
import styles from './PersonalityCard.module.css';

interface Personality {
  id: number;
  name: string;
  promptText: string;
  isDefault: boolean;
  createdAt: string;
}

interface PersonalityCardProps {
  personality: Personality;
  onEdit: (personality: Personality) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function PersonalityCard({
  personality,
  onEdit,
  onDelete,
  onSetDefault,
}: PersonalityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPreview = () => {
    if (isExpanded) return personality.promptText;
    if (personality.promptText.length <= 150) return personality.promptText;
    return personality.promptText.substring(0, 150) + '...';
  };

  const needsReadMore = personality.promptText.length > 150;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{personality.name}</h3>
          {personality.isDefault && (
            <span className={styles.defaultBadge}>Default</span>
          )}
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => onEdit(personality)}
            className={styles.editButton}
            aria-label="Edit personality"
            title="Edit personality"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(personality.id)}
            className={styles.deleteButton}
            aria-label="Delete personality"
            title="Delete personality"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.promptText}>{getPreview()}</p>
        {needsReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreButton}
            type="button"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.metadata}>
          <span className={styles.date}>
            Created: {formatDate(personality.createdAt)}
          </span>
        </div>
        {!personality.isDefault && (
          <button
            onClick={() => onSetDefault(personality.id)}
            className={styles.setDefaultButton}
            type="button"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
}
