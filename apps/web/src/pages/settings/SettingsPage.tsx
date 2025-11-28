import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserSettings, updateUserSettings } from '../../services/index.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePersonality } from '../../contexts/PersonalityContext.js';
import styles from './SettingsPage.module.css';

interface UserSettings {
  userId: number;
  defaultPersonalityId?: number;
  nickname?: string;
  occupation?: string;
}

export default function SettingsPage() {
  const { personalities, isLoading: personalitiesLoading } = usePersonality();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [settings, setSettings] = useState<UserSettings>({
    userId: 0,
    defaultPersonalityId: undefined,
    nickname: '',
    occupation: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserSettings();
        setSettings({
          userId: data.settings.userId,
          defaultPersonalityId: data.settings.defaultPersonalityId,
          nickname: data.settings.nickname || '',
          occupation: data.settings.occupation || '',
        });
      } catch (error_) {
        console.error('Failed to load settings:', error_);
        setError('Failed to load settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError('');

    try {
      await updateUserSettings({
        defaultPersonalityId: settings.defaultPersonalityId,
        nickname: settings.nickname || undefined,
        occupation: settings.occupation || undefined,
      });
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error_) {
      console.error('Failed to save settings:', error_);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || personalitiesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <form onSubmit={handleSave} className={styles.form}>
        {/* Default Personality Section - always show */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Default Coaching Personality</h2>
          {personalities.length === 0 ? (
            <div className={styles.emptyPersonalityState}>
              <p className={styles.helpText}>
                No coaching personalities are available yet.
              </p>
              {isAdmin && (
                <p className={styles.helpText}>
                  <Link to="/admin/meta-prompts" className={styles.link}>
                    Create your first personality
                  </Link>{' '}
                  to get started.
                </p>
              )}
            </div>
          ) : (
            <>
              <p className={styles.helpText}>
                This personality will be used for new chats by default. You can
                change it for any individual chat.
              </p>
              <div className={styles.formGroup}>
                <label htmlFor="defaultPersonality" className={styles.label}>
                  Default Personality
                </label>
                <select
                  id="defaultPersonality"
                  className={styles.select}
                  value={settings.defaultPersonalityId || ''}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSettings({
                      ...settings,
                      defaultPersonalityId: Number.isNaN(value)
                        ? undefined
                        : value,
                    });
                  }}
                >
                  <option value="">None selected</option>
                  {personalities.map((personality) => (
                    <option key={personality.id} value={personality.id}>
                      {personality.name}
                      {personality.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {isAdmin && (
                <p className={styles.helpText}>
                  <Link to="/admin/meta-prompts" className={styles.link}>
                    Manage personalities
                  </Link>
                </p>
              )}
            </>
          )}
        </section>

        {/* Profile Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <p className={styles.helpText}>
            Help your coach understand you better.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="nickname" className={styles.label}>
              Preferred Name
            </label>
            <input
              type="text"
              id="nickname"
              className={styles.input}
              placeholder="How would you like to be called?"
              value={settings.nickname}
              onChange={(event) =>
                setSettings({ ...settings, nickname: event.target.value })
              }
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="occupation" className={styles.label}>
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              className={styles.input}
              placeholder="What do you do?"
              value={settings.occupation}
              onChange={(event) =>
                setSettings({ ...settings, occupation: event.target.value })
              }
              maxLength={200}
            />
          </div>
        </section>

        {/* Messages */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {saveMessage && (
          <div className={styles.successMessage}>{saveMessage}</div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
