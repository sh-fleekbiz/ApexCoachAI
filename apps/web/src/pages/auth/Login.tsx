import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Auth.module.css';

const demoRoles = [
  {
    role: 'coach',
    label: 'Coach',
    icon: '🎓',
    description: 'Guide clients through coaching',
  },
  {
    role: 'client',
    label: 'Client',
    icon: '💬',
    description: 'Experience the coaching journey',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: '⚙️',
    description: 'Full platform access',
  },
];

export function Login() {
  const [loggingIn, setLoggingIn] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { demoLoginWithRole } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role: string) => {
    setLoggingIn(role);
    setError('');
    try {
      await demoLoginWithRole(role);
      navigate('/');
    } catch (error_: any) {
      setError(error_.message || 'Login failed');
      setLoggingIn(null);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>🎯 Apex Coach AI</h1>
          <p className={styles.authSubtitle}>
            Your AI-powered coaching companion
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <p className={styles.selectRoleText}>
          Select a demo role to get started:
        </p>

        <div className={styles.roleGrid}>
          {demoRoles.map((demo) => (
            <button
              key={demo.role}
              onClick={() => handleDemoLogin(demo.role)}
              disabled={loggingIn !== null}
              className={`${styles.roleButton} ${loggingIn === demo.role ? styles.roleButtonActive : ''}`}
            >
              {loggingIn === demo.role ? (
                <div className={styles.loadingSpinner} />
              ) : (
                <>
                  <span className={styles.roleIcon}>{demo.icon}</span>
                  <span className={styles.roleLabel}>{demo.label}</span>
                  <span className={styles.roleDescription}>
                    {demo.description}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        <p className={styles.footerText}>
          No account needed • Instant access • Try all features
        </p>
      </div>
    </div>
  );
}

export default Login;
