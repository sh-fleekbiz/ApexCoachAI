import React from 'react';
import styles from './EmptyKnowledgeBase.module.css';

interface EmptyKnowledgeBaseProps {
  onUploadClick: () => void;
}

export const EmptyKnowledgeBase: React.FC<EmptyKnowledgeBaseProps> = ({
  onUploadClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6h5M12 10h5M12 14h5"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className={styles.title}>No documents in knowledge base yet</h2>
      <p className={styles.description}>
        Upload your first document to start training your AI coach. Documents
        are indexed using RAG to power intelligent, context-aware responses.
      </p>
      <button onClick={onUploadClick} className={styles.uploadButton}>
        📤 Upload Your First Document
      </button>
      <div className={styles.examples}>
        <h3 className={styles.examplesTitle}>Supported document types:</h3>
        <div className={styles.examplesList}>
          <div className={styles.exampleItem}>
            <span className={styles.exampleIcon}>📄</span>
            <span className={styles.exampleLabel}>PDF Documents</span>
          </div>
          <div className={styles.exampleItem}>
            <span className={styles.exampleIcon}>📝</span>
            <span className={styles.exampleLabel}>Word Files (DOCX)</span>
          </div>
          <div className={styles.exampleItem}>
            <span className={styles.exampleIcon}>📋</span>
            <span className={styles.exampleLabel}>Text Files (TXT)</span>
          </div>
          <div className={styles.exampleItem}>
            <span className={styles.exampleIcon}>🔗</span>
            <span className={styles.exampleLabel}>Web URLs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
