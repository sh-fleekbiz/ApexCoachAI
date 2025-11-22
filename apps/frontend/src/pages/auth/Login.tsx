import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, PrimaryButton, Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Auth.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

          {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

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

              <PrimaryButton text={isLoading ? 'Signing in...' : 'Sign In'} type="submit" disabled={isLoading} />

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
