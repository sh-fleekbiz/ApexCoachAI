import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DemoLoginButtons from '../../components/auth/DemoLoginButtons.js';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Auth.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [autoLoginInProgress, setAutoLoginInProgress] = useState(false);
  const { login, demoLoginWithRole, user, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-login with demo coach account on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('apexcoach_visited');
    if (!hasVisited && !user && !loading && !autoLoginInProgress) {
      setAutoLoginInProgress(true);
      localStorage.setItem('apexcoach_visited', 'true');
      handleAutoLogin();
    }
  }, [user, loading]);

  const handleAutoLogin = async () => {
    try {
      await demoLoginWithRole('coach');
      navigate('/');
    } catch (error_: any) {
      console.error('Auto-login failed:', error_);
      setAutoLoginInProgress(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    setError('');
    try {
      await demoLoginWithRole('coach');
      navigate('/');
    } catch (error_: any) {
      setError(error_.message || 'Demo login failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error_: any) {
      setError(error_.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state during auto-login
  if (autoLoginInProgress) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
            <Text variant="xxLarge" className={styles.authTitle}>
              🚀 Welcome to Apex Coach AI
            </Text>
            <Text
              variant="medium"
              style={{ color: '#666', textAlign: 'center' }}
            >
              Setting up your demo experience...
            </Text>
            <div className={styles.loadingSpinner} />
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <Stack tokens={{ childrenGap: 20 }}>
          <div className={styles.authHeader}>
            <Text variant="xxLarge" className={styles.authTitle}>
              🎯 Apex Coach AI
            </Text>
            <Text variant="medium" className={styles.authSubtitle}>
              Your AI-powered coaching companion
            </Text>
          </div>

          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}

          {/* Quick Demo Button - Primary CTA */}
          <button
            onClick={handleQuickDemo}
            disabled={isLoading}
            className={styles.quickDemoButton}
          >
            {isLoading ? (
              <span className={styles.buttonLoading}>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className={styles.spinnerTrack}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className={styles.spinnerHead}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting Demo...
              </span>
            ) : (
              <>
                <span className={styles.buttonIcon}>▶️</span>
                <span>
                  <strong>Try Demo Now</strong>
                  <span className={styles.buttonSubtext}>
                    No account needed - instant access
                  </span>
                </span>
              </>
            )}
          </button>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <Text variant="small" className={styles.dividerText}>
              or choose a role
            </Text>
            <div className={styles.dividerLine} />
          </div>

          {/* Demo Role Selection */}
          <DemoLoginButtons />

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <Text variant="small" className={styles.dividerText}>
              have an account?
            </Text>
            <div className={styles.dividerLine} />
          </div>

          {/* Toggle to show login form */}
          {!showLoginForm ? (
            <button
              onClick={() => setShowLoginForm(true)}
              className={styles.secondaryButton}
            >
              Sign in with email
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack tokens={{ childrenGap: 15 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(_, newValue) => setEmail(newValue || '')}
                  required
                  autoComplete="email"
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(_, newValue) => setPassword(newValue || '')}
                  required
                  autoComplete="current-password"
                />

                <PrimaryButton
                  text={isLoading ? 'Signing in...' : 'Sign In'}
                  type="submit"
                  disabled={isLoading}
                />

                <Text variant="small" className={styles.authLink}>
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </Text>
              </Stack>
            </form>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default Login;
