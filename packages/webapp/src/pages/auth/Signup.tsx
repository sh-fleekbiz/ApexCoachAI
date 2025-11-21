import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, PrimaryButton, Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { useAuth } from '../../contexts/AuthContext.js';
import styles from './Auth.module.css';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name || undefined);
      navigate('/');
    } catch (error_: any) {
      setError(error_.message || 'Signup failed');
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
              Begin Your Journey
            </Text>
            <Text variant="medium" className={styles.authSubtitle}>
              Create an account to unlock your potential
            </Text>
          </div>

          {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

          <form onSubmit={handleSubmit}>
            <Stack tokens={{ childrenGap: 15 }}>
              <TextField
                label="Name (optional)"
                type="text"
                value={name}
                onChange={(_, newValue) => setName(newValue || '')}
                autoComplete="name"
              />

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
                autoComplete="new-password"
                description="Must be at least 8 characters"
              />

              <PrimaryButton text={isLoading ? 'Creating account...' : 'Sign Up'} type="submit" disabled={isLoading} />

              <Text variant="small" className={styles.authLink}>
                Already have an account? <Link to="/login">Sign in</Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </div>
    </div>
  );
}

export default Signup;
