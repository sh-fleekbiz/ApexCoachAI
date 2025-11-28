import { useEffect, useState } from 'react';
import {
  createMetaPrompt,
  deleteMetaPrompt,
  getMetaPrompts,
  updateMetaPrompt,
} from '../../../api/index.js';
import { PersonalityCard } from '../../../components/personality/PersonalityCard.js';
import { PersonalityEditor } from '../../../components/personality/PersonalityEditor.js';
import { usePersonality } from '../../../contexts/PersonalityContext.js';
import styles from './MetaPrompts.module.css';

interface Personality {
  id: number;
  name: string;
  promptText: string;
  isDefault: boolean;
  createdAt: string;
}

const MetaPrompts: React.FC = () => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPersonality, setEditingPersonality] =
    useState<Personality | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const { refreshPersonalities } = usePersonality();

  useEffect(() => {
    loadPersonalities();
  }, []);

  const loadPersonalities = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getMetaPrompts();
      setPersonalities(data.metaPrompts || []);
      // Also refresh the global personality context
      await refreshPersonalities();
    } catch (error_) {
      console.error('Failed to load personalities:', error_);
      setError('Failed to load personalities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleCreateNew = () => {
    setEditingPersonality(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (personality: Personality) => {
    setEditingPersonality(personality);
    setIsEditorOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    promptText: string;
    isDefault: boolean;
  }) => {
    try {
      if (editingPersonality) {
        await updateMetaPrompt(editingPersonality.id, data);
        showMessage('success', 'Personality updated successfully!');
      } else {
        await createMetaPrompt(data);
        showMessage('success', 'Personality created successfully!');
      }
      await loadPersonalities();
      setIsEditorOpen(false);
      setEditingPersonality(null);
    } catch (error_) {
      throw error_; // Let the editor handle the error
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteMetaPrompt(deleteConfirmId);
      showMessage('success', 'Personality deleted successfully!');
      await loadPersonalities();
    } catch (error_) {
      console.error('Failed to delete personality:', error_);
      showMessage('error', 'Failed to delete personality. Please try again.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await updateMetaPrompt(id, { isDefault: true });
      showMessage('success', 'Default personality updated!');
      await loadPersonalities();
    } catch (error_) {
      console.error('Failed to set default:', error_);
      showMessage('error', 'Failed to set default personality.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading personalities...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Coaching Personalities</h1>
          <p className={styles.subtitle}>
            Manage AI coaching personas and their system prompts
          </p>
        </div>
        <button onClick={handleCreateNew} className={styles.createButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Create New Personality
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {actionMessage && (
        <div
          className={
            actionMessage.type === 'success'
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {actionMessage.text}
        </div>
      )}

      {personalities.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No personalities yet</h2>
          <p className={styles.emptyText}>
            Create your first coaching personality to get started. Each
            personality has a custom system prompt that defines its coaching
            style.
          </p>
          <button onClick={handleCreateNew} className={styles.emptyButton}>
            Create Your First Personality
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {personalities.map((personality) => (
            <PersonalityCard
              key={personality.id}
              personality={personality}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <PersonalityEditor
        personality={editingPersonality}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPersonality(null);
        }}
        onSave={handleSave}
      />

      {deleteConfirmId !== null && (
        <div className={styles.backdrop}>
          <div className={styles.confirmDialog}>
            <h3 className={styles.confirmTitle}>Delete Personality?</h3>
            <p className={styles.confirmText}>
              Are you sure you want to delete this personality? This action
              cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaPrompts;
