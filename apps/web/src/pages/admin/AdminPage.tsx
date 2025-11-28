import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../services/index.js';
import styles from './AdminPage.module.css';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

interface MetaPrompt {
  id: number;
  name: string;
  promptText: string;
  isDefault: boolean;
  createdAt: string;
}

interface Program {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

interface KnowledgeBaseOverview {
  totalResources: number;
  trainedDocuments: number;
  pendingDocuments: number;
  failedDocuments: number;
}

type Tab = 'overview' | 'users' | 'personalities' | 'programs' | 'knowledge';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [personalities, setPersonalities] = useState<MetaPrompt[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [knowledgeBase, setKnowledgeBase] =
    useState<KnowledgeBaseOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    void loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'users') {
        const response = await fetch(`${apiBaseUrl}/admin/users`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } else if (activeTab === 'personalities') {
        const response = await fetch(`${apiBaseUrl}/meta-prompts`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPersonalities(data.metaPrompts);
        }
      } else if (activeTab === 'programs') {
        const response = await fetch(`${apiBaseUrl}/admin/programs`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
        }
      } else if (activeTab === 'knowledge') {
        const response = await fetch(`${apiBaseUrl}/admin/knowledge-base`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setKnowledgeBase(data);
        }
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚙️ Admin Panel</h1>
        <p className={styles.subtitle}>
          Manage users, personalities, programs, and knowledge base
        </p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'personalities' ? styles.active : ''}`}
          onClick={() => setActiveTab('personalities')}
        >
          🎭 Personalities
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'programs' ? styles.active : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          📚 Programs
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'knowledge' ? styles.active : ''}`}
          onClick={() => setActiveTab('knowledge')}
        >
          🧠 Knowledge Base
        </button>
      </nav>

      <main className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {activeTab === 'overview' && (
          <div className={styles.overview}>
            <h2>System Overview</h2>
            <div className={styles.cards}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>👥</div>
                <div className={styles.cardTitle}>Users</div>
                <div className={styles.cardValue}>{users.length || '—'}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🎭</div>
                <div className={styles.cardTitle}>Personalities</div>
                <div className={styles.cardValue}>
                  {personalities.length || '—'}
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>📚</div>
                <div className={styles.cardTitle}>Programs</div>
                <div className={styles.cardValue}>{programs.length || '—'}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>🧠</div>
                <div className={styles.cardTitle}>Knowledge Base</div>
                <div className={styles.cardValue}>
                  {knowledgeBase?.totalResources || '—'}
                </div>
              </div>
            </div>
            <div className={styles.features}>
              <h3>Backend Capabilities</h3>
              <ul>
                <li>✅ RAG with Azure AI Search (hybrid + semantic ranking)</li>
                <li>✅ Custom coaching personalities (meta prompts)</li>
                <li>
                  ✅ Program management with coach/participant assignments
                </li>
                <li>✅ Library resources with transcripts & indexing</li>
                <li>✅ White label branding (logo, colors, custom CSS)</li>
                <li>✅ User roles & invitation system</li>
                <li>✅ Usage analytics & admin action logs</li>
                <li>✅ Real-time streaming chat responses</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.section}>
            <h2>Users</h2>
            {isLoading ? (
              <div className={styles.loading}>Loading users...</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.name || '—'}</td>
                      <td>
                        <span className={styles.badge}>
                          {user.role.toLowerCase()}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'personalities' && (
          <div className={styles.section}>
            <h2>Coaching Personalities</h2>
            <p className={styles.helpText}>
              Custom AI personas with unique coaching styles and approaches
            </p>
            {isLoading ? (
              <div className={styles.loading}>Loading personalities...</div>
            ) : (
              <div className={styles.personalitiesList}>
                {personalities.map((personality) => (
                  <div key={personality.id} className={styles.personalityCard}>
                    <div className={styles.personalityHeader}>
                      <h3>{personality.name}</h3>
                      {personality.isDefault && (
                        <span className={styles.defaultBadge}>Default</span>
                      )}
                    </div>
                    <div className={styles.personalityPrompt}>
                      {personality.promptText.slice(0, 200)}...
                    </div>
                    <div className={styles.personalityFooter}>
                      Created{' '}
                      {new Date(personality.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'programs' && (
          <div className={styles.section}>
            <h2>Programs</h2>
            <p className={styles.helpText}>
              Coaching programs with assigned coaches and participants
            </p>
            {isLoading ? (
              <div className={styles.loading}>Loading programs...</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td>{program.id}</td>
                      <td>{program.name}</td>
                      <td>{program.description || '—'}</td>
                      <td>
                        {new Date(program.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className={styles.section}>
            <h2>Knowledge Base</h2>
            <p className={styles.helpText}>
              RAG-indexed documents and resources for AI responses
            </p>
            {isLoading ? (
              <div className={styles.loading}>Loading knowledge base...</div>
            ) : knowledgeBase ? (
              <div className={styles.knowledgeStats}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Total Resources</div>
                  <div className={styles.statValue}>
                    {knowledgeBase.totalResources}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Trained</div>
                  <div className={styles.statValue}>
                    {knowledgeBase.trainedDocuments}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Pending</div>
                  <div className={styles.statValue}>
                    {knowledgeBase.pendingDocuments}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Failed</div>
                  <div className={styles.statValue}>
                    {knowledgeBase.failedDocuments}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.empty}>
                No knowledge base data available
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
