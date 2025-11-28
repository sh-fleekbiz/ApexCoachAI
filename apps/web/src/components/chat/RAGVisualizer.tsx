import { useEffect, useState } from 'react';
import styles from './RAGVisualizer.module.css';

interface RAGVisualizerProps {
  isActive: boolean;
  sourcesCount?: number;
}

type RAGState = 'searching' | 'found' | 'generating' | 'complete';

export function RAGVisualizer({
  isActive,
  sourcesCount = 0,
}: RAGVisualizerProps) {
  const [currentState, setCurrentState] = useState<RAGState>('searching');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setCurrentState('searching');

    // Simulate RAG process stages
    const searchTimer = setTimeout(() => {
      setCurrentState('found');
    }, 1000);

    const generateTimer = setTimeout(() => {
      setCurrentState('generating');
    }, 2000);

    const completeTimer = setTimeout(() => {
      setCurrentState('complete');
      setTimeout(() => setIsVisible(false), 500);
    }, 3000);

    return () => {
      clearTimeout(searchTimer);
      clearTimeout(generateTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive]);

  if (!isVisible) {
    return null;
  }

  const stateConfig = {
    searching: {
      icon: '🔍',
      text: 'Searching knowledge base...',
      color: '#3b82f6',
    },
    found: {
      icon: '🧠',
      text: `Found ${sourcesCount || 'multiple'} sources`,
      color: '#10b981',
    },
    generating: {
      icon: '✨',
      text: 'Generating response...',
      color: '#8b5cf6',
    },
    complete: {
      icon: '✅',
      text: 'Complete',
      color: '#22c55e',
    },
  };

  const config = stateConfig[currentState];

  return (
    <div className={styles.container}>
      <div className={styles.visualizer} style={{ borderColor: config.color }}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{config.icon}</span>
          <div
            className={styles.pulse}
            style={{ backgroundColor: config.color }}
          />
        </div>
        <span className={styles.text} style={{ color: config.color }}>
          {config.text}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              backgroundColor: config.color,
              width:
                currentState === 'searching'
                  ? '33%'
                  : currentState === 'found'
                    ? '66%'
                    : '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
