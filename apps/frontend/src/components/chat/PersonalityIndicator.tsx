import { useState } from 'react';
import { usePersonality } from '../../contexts/PersonalityContext';
import styles from './PersonalityIndicator.module.css';

export function PersonalityIndicator() {
  const { personalities, selectedPersonalityId } = usePersonality();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedPersonality = personalities.find(
    (p) => p.id === selectedPersonalityId
  );

  if (!selectedPersonality) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.badge}
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        aria-expanded={isExpanded}
        aria-label="Toggle personality description"
      >
        <span className={styles.icon}>💬</span>
        <span className={styles.text}>
          Chatting with: <strong>{selectedPersonality.name}</strong>
        </span>
        <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && selectedPersonality.promptText && (
        <div className={styles.description}>
          <p>{selectedPersonality.promptText}</p>
        </div>
      )}
    </div>
  );
}
