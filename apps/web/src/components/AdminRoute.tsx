import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle both uppercase (from backend) and lowercase role values
  const userRole = user?.role?.toLowerCase();
  if (!user || (userRole !== 'admin' && userRole !== 'owner')) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
