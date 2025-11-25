import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Auth.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login, demoLogin, user } = useAuth();
  const navigate = useNavigate();

  // Auto-login with demo account on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited && !user) {
      localStorage.setItem('hasVisited', 'true');
      handleDemoLogin();
    }
  }, [user]);

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

  const handleDemoLogin = async () => {
    setError('');
    setIsDemoLoading(true);

    try {
      await demoLogin();
      navigate('/');
    } catch (error_: any) {
      setError(error_.message || 'Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <Stack tokens={{ childrenGap: 20 }}>
          <div className={styles.authHeader}>
            <Text variant="xxLarge" className={styles.authTitle}>
              Welcome Back
            </Text>
            <Text variant="medium" className={styles.authSubtitle}>
              Sign in to continue your growth journey
            </Text>
          </div>

          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}

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
                disabled={isLoading || isDemoLoading}
              />

              <DefaultButton
                text={
                  isDemoLoading ? 'Logging in with demo...' : 'Try Demo Account'
                }
                onClick={handleDemoLogin}
                disabled={isLoading || isDemoLoading}
              />

              <Text variant="small" className={styles.authLink}>
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </div>
    </div>
  );
}

export default Login;
