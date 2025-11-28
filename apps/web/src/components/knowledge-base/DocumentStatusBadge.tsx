import React from 'react';
import styles from './DocumentStatusBadge.module.css';

interface DocumentStatusBadgeProps {
  status: 'not_trained' | 'training' | 'trained' | 'failed';
  size?: 'small' | 'medium' | 'large';
}

const statusConfig = {
  trained: {
    label: 'Trained',
    icon: '✅',
    color: '#10b981',
    tooltip: 'Document has been successfully trained and is ready for use',
  },
  training: {
    label: 'Training',
    icon: '🔄',
    color: '#3b82f6',
    tooltip: 'Document is currently being processed and trained',
  },
  not_trained: {
    label: 'Not Trained',
    icon: '⏳',
    color: '#6b7280',
    tooltip: 'Document has not been trained yet',
  },
  failed: {
    label: 'Failed',
    icon: '❌',
    color: '#ef4444',
    tooltip: 'Training failed - check logs or retry',
  },
};

export const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = statusConfig[status];

  return (
    <div
      className={`${styles.badge} ${styles[size]} ${styles[status]}`}
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
      title={config.tooltip}
    >
      <span
        className={`${styles.icon} ${status === 'training' ? styles.spinning : ''}`}
      >
        {config.icon}
      </span>
      <span className={styles.label}>{config.label}</span>
    </div>
  );
};
