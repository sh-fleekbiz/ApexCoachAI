import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { useAuth } from '../contexts/AuthContext.js';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size={SpinnerSize.large} label="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
