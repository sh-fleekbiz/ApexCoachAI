import React, { useState } from 'react';
import { createLibraryResource } from '../../services/index.js';
import styles from './UploadResource.module.css';

interface UploadResourceProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadResource: React.FC<UploadResourceProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    source: '',
    thumbnailUrl: '',
    programId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.source.trim()) {
      setError('Video URL is required');
      return;
    }

    if (!validateUrl(formData.source)) {
      setError('Please enter a valid URL');
      return;
    }

    if (formData.thumbnailUrl && !validateUrl(formData.thumbnailUrl)) {
      setError('Please enter a valid thumbnail URL');
      return;
    }

    setIsSubmitting(true);

    try {
      await createLibraryResource({
        title: formData.title.trim(),
        type: formData.type,
        source: formData.source.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        programId: formData.programId
          ? Number.parseInt(formData.programId, 10)
          : null,
      });

      onSuccess();
    } catch (error_) {
      console.error('Failed to create resource:', error_);
      setError(
        error_ instanceof Error ? error_.message : 'Failed to upload resource'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Upload Resource</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter resource title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Type <span className={styles.required}>*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="source" className={styles.label}>
              URL <span className={styles.required}>*</span>
            </label>
            <input
              id="source"
              name="source"
              type="url"
              value={formData.source}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/video.mp4"
              required
            />
            <p className={styles.helpText}>
              Enter the direct URL to the video, audio, or document file
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="thumbnailUrl" className={styles.label}>
              Thumbnail URL
            </label>
            <input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className={styles.helpText}>Optional: URL to thumbnail image</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="programId" className={styles.label}>
              Program ID
            </label>
            <input
              id="programId"
              name="programId"
              type="number"
              value={formData.programId}
              onChange={handleChange}
              className={styles.input}
              placeholder="Optional: Link to a program"
            />
            <p className={styles.helpText}>
              Optional: Associate this resource with a program
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
