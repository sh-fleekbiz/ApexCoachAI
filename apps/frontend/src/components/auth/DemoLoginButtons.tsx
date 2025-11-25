import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../../api/index.js';
import { useAuth } from '../../contexts/AuthContext';

interface DemoRole {
  role: string;
  label: string;
  email: string;
  userRole: string;
}

const roleDescriptions: Record<string, string> = {
  admin: 'Full platform access & settings',
  coach: 'Guide clients through coaching',
  client: 'Experience the coaching journey',
};

const roleIcons: Record<string, string> = {
  admin: '⚙️',
  coach: '🎓',
  client: '💬',
};

const DemoLoginButtons: React.FC = () => {
  const { demoLoginWithRole } = useAuth();
  const navigate = useNavigate();
  const [demoRoles, setDemoRoles] = useState<DemoRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoRoles = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/demo-users`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch demo roles');
        }

        const data = await response.json();
        setDemoRoles(data.demoUsers || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load demo options'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDemoRoles();
  }, []);

  const handleDemoLogin = async (role: string) => {
    setLoggingIn(role);
    setError(null);
    try {
      await demoLoginWithRole(role);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      setLoggingIn(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '12px 0' }}>
        Loading demo options...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#dc2626', padding: '12px 0' }}>
        {error}
      </div>
    );
  }

  if (demoRoles.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {demoRoles.map((demoRole) => (
        <button
          key={demoRole.role}
          onClick={() => handleDemoLogin(demoRole.role)}
          disabled={loggingIn !== null}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            background: loggingIn === demoRole.role ? '#667eea' : 'white',
            color: loggingIn === demoRole.role ? 'white' : '#374151',
            fontSize: '14px',
            cursor: loggingIn !== null ? 'not-allowed' : 'pointer',
            opacity:
              loggingIn !== null && loggingIn !== demoRole.role ? 0.5 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
          }}
          onMouseOver={(e) => {
            if (loggingIn === null) {
              e.currentTarget.style.borderColor = '#667eea';
            }
          }}
          onMouseOut={(e) => {
            if (loggingIn !== demoRole.role) {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          {loggingIn === demoRole.role ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
              }}
            >
              <svg
                style={{
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite',
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            <>
              <span style={{ fontSize: '20px' }}>
                {roleIcons[demoRole.role] || '👤'}
              </span>
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block', marginBottom: '2px' }}>
                  {demoRole.role.charAt(0).toUpperCase() +
                    demoRole.role.slice(1)}
                </strong>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {roleDescriptions[demoRole.role] || demoRole.label}
                </span>
              </span>
            </>
          )}
        </button>
      ))}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DemoLoginButtons;
