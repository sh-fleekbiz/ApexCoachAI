import React, { useRef, useState } from 'react';
import { apiBaseUrl } from '../../services/index.js';
import styles from './UploadDocument.module.css';

interface UploadDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  programs?: Array<{ id: number; name: string }>;
}

type UploadTab = 'file' | 'url';

export const UploadDocument: React.FC<UploadDocumentProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  programs = [],
}) => {
  const [activeTab, setActiveTab] = useState<UploadTab>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [programId, setProgramId] = useState<number | null>(null);
  const [autoTrain, setAutoTrain] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      validateAndSetFiles(newFiles);
    }
  };

  const validateAndSetFiles = (newFiles: File[]) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = newFiles.filter((file) => {
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);
    setError('');

    // Auto-fill title from first file if empty
    if (!title && validFiles.length > 0) {
      setTitle(validFiles[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndSetFiles(droppedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError('');

    // Auto-fill title from URL if empty
    if (!title && newUrl) {
      try {
        const urlObj = new URL(newUrl);
        setTitle(urlObj.hostname);
      } catch {
        // Invalid URL, ignore
      }
    }
  };

  const validateUrl = () => {
    try {
      new URL(url);
      return true;
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (activeTab === 'file' && files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    if (activeTab === 'url' && !validateUrl()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (activeTab === 'file') {
        // Upload files
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);
          formData.append(
            'title',
            i === 0 ? title : file.name.replace(/\.[^/.]+$/, '')
          );
          if (description) formData.append('description', description);
          if (programId) formData.append('programId', programId.toString());
          formData.append('autoTrain', autoTrain.toString());

          // Simulate progress (real implementation would use XHR for progress tracking)
          setUploadProgress(((i + 0.5) / files.length) * 100);

          const response = await fetch(`${apiBaseUrl}/admin/knowledge-base`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          setUploadProgress(((i + 1) / files.length) * 100);
        }
      } else {
        // Upload URL
        const response = await fetch(`${apiBaseUrl}/admin/knowledge-base`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            type: 'url',
            source: url,
            programId: programId || null,
            metadata: { description, autoTrain },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create document from URL');
        }
        setUploadProgress(100);
      }

      // Success
      setTimeout(() => {
        onUploadComplete();
        handleClose();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      setUrl('');
      setTitle('');
      setDescription('');
      setProgramId(null);
      setAutoTrain(true);
      setError('');
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Upload Document</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isUploading}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'file' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('file')}
            disabled={isUploading}
          >
            📤 File Upload
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'url' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('url')}
            disabled={isUploading}
          >
            🔗 URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {activeTab === 'file' ? (
            <div className={styles.section}>
              <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.dropIcon}>📁</div>
                <p className={styles.dropText}>
                  Drag and drop files here, or click to browse
                </p>
                <p className={styles.dropHint}>
                  Supports: PDF, DOCX, TXT (max 10MB each)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  disabled={isUploading}
                />
              </div>

              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className={styles.removeFile}
                          aria-label="Remove file"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.section}>
              <label className={styles.label}>
                URL
                <input
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/document"
                  className={styles.input}
                  required
                  disabled={isUploading}
                />
              </label>
            </div>
          )}

          <div className={styles.section}>
            <label className={styles.label}>
              Title *
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                className={styles.input}
                required
                disabled={isUploading}
              />
            </label>

            <label className={styles.label}>
              Description (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document"
                className={styles.textarea}
                rows={3}
                disabled={isUploading}
              />
            </label>

            {programs.length > 0 && (
              <label className={styles.label}>
                Program (optional)
                <select
                  value={programId || ''}
                  onChange={(e) =>
                    setProgramId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className={styles.select}
                  disabled={isUploading}
                >
                  <option value="">None</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={autoTrain}
                onChange={(e) => setAutoTrain(e.target.checked)}
                disabled={isUploading}
              />
              <span>Auto-train after upload</span>
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {isUploading && (
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={styles.progressText}>
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
