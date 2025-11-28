import React, { useState } from 'react';
import styles from './BulkActions.module.css';

interface BulkActionsProps {
  selectedCount: number;
  onDeleteAll: () => void;
  onRetrainAll: () => void;
  onAssignProgram?: (programId: number | null) => void;
  onClearSelection: () => void;
  programs?: Array<{ id: number; name: string }>;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDeleteAll,
  onRetrainAll,
  onAssignProgram,
  onClearSelection,
  programs = [],
}) => {
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDeleteAll();
    setShowDeleteConfirm(false);
  };

  const handleProgramAssign = (programId: number | null) => {
    if (onAssignProgram) {
      onAssignProgram(programId);
    }
    setShowProgramDropdown(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.info}>
          <span className={styles.count}>{selectedCount}</span>
          <span className={styles.label}>
            {selectedCount === 1 ? 'document' : 'documents'} selected
          </span>
        </div>
        <div className={styles.actions}>
          <button
            onClick={onRetrainAll}
            className={`${styles.button} ${styles.primary}`}
            title="Retrain selected documents"
          >
            🔄 Retrain All
          </button>
          {onAssignProgram && programs.length > 0 && (
            <div className={styles.dropdown}>
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className={`${styles.button} ${styles.secondary}`}
              >
                📚 Assign Program
              </button>
              {showProgramDropdown && (
                <div className={styles.dropdownMenu}>
                  <button
                    onClick={() => handleProgramAssign(null)}
                    className={styles.dropdownItem}
                  >
                    None (Remove program)
                  </button>
                  {programs.map((program) => (
                    <button
                      key={program.id}
                      onClick={() => handleProgramAssign(program.id)}
                      className={styles.dropdownItem}
                    >
                      {program.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleDelete}
            className={`${styles.button} ${styles.danger}`}
            title="Delete selected documents"
          >
            🗑️ Delete All
          </button>
          <button
            onClick={onClearSelection}
            className={`${styles.button} ${styles.ghost}`}
            title="Clear selection"
          >
            ✕ Clear
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className={styles.backdrop}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmTitle}>
              Delete {selectedCount} Documents?
            </h3>
            <p className={styles.confirmText}>
              This action cannot be undone. All selected documents and their
              training data will be permanently deleted.
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className={styles.deleteButton}>
                Delete {selectedCount}{' '}
                {selectedCount === 1 ? 'Document' : 'Documents'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
