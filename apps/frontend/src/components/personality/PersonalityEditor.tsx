import { useEffect, useState } from 'react';
import styles from './PersonalityEditor.module.css';

interface Personality {
  id: number;
  name: string;
  promptText: string;
  isDefault: boolean;
  createdAt: string;
}

interface PersonalityEditorProps {
  personality?: Personality | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    promptText: string;
    isDefault: boolean;
  }) => Promise<void>;
}

export function PersonalityEditor({
  personality,
  isOpen,
  onClose,
  onSave,
}: PersonalityEditorProps) {
  const [name, setName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    promptText?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isEditMode = !!personality;

  useEffect(() => {
    if (personality) {
      setName(personality.name);
      setPromptText(personality.promptText);
      setIsDefault(personality.isDefault);
    } else {
      setName('');
      setPromptText('');
      setIsDefault(false);
    }
    setErrors({});
    setSaveError('');
  }, [personality, isOpen]);

  const validate = () => {
    const newErrors: { name?: string; promptText?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (!promptText.trim()) {
      newErrors.promptText = 'Prompt text is required';
    } else if (promptText.length < 50) {
      newErrors.promptText = 'Prompt text must be at least 50 characters';
    } else if (promptText.length > 5000) {
      newErrors.promptText = 'Prompt text must be 5000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      await onSave({
        name: name.trim(),
        promptText: promptText.trim(),
        isDefault,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save personality:', error);
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save personality'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSaving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditMode ? 'Edit Personality' : 'Create New Personality'}
          </h2>
          <button
            onClick={handleCancel}
            className={styles.closeButton}
            disabled={isSaving}
            aria-label="Close"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formBody}>
            {saveError && <div className={styles.errorAlert}>{saveError}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="personality-name" className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                id="personality-name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tim – Inside Out Marriage Coach"
                maxLength={100}
                disabled={isSaving}
                autoFocus
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
              <span className={styles.charCount}>{name.length}/100</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="personality-prompt" className={styles.label}>
                Prompt Text <span className={styles.required}>*</span>
              </label>
              <p className={styles.helpText}>
                This is the system prompt that defines the personality's
                coaching style and behavior. Be specific and detailed.
              </p>
              <textarea
                id="personality-prompt"
                className={`${styles.textarea} ${errors.promptText ? styles.inputError : ''}`}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter the system prompt for this coaching personality..."
                rows={10}
                maxLength={5000}
                disabled={isSaving}
              />
              {errors.promptText && (
                <span className={styles.errorText}>{errors.promptText}</span>
              )}
              <span className={styles.charCount}>
                {promptText.length}/5000 (min 50)
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  disabled={isSaving}
                />
                <span>Set as default personality</span>
              </label>
              <p className={styles.helpText}>
                The default personality will be automatically selected for new
                chats.
              </p>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
