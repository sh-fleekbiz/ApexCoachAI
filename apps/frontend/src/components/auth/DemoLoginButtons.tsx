import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DemoRole {
  role: string;
  label: string;
  description: string;
}

const DemoLoginButtons: React.FC = () => {
  const { demoLoginWithRole } = useAuth();
  const [demoRoles, setDemoRoles] = useState<DemoRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoRoles = async () => {
      try {
        const response = await fetch('/auth/demo-users', {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      setLoggingIn(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600">Loading demo options...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (demoRoles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-center text-sm text-gray-600 mb-4">
        Try ApexCoach AI with different personas:
      </div>
      {demoRoles.map((demoRole) => (
        <button
          key={demoRole.role}
          onClick={() => handleDemoLogin(demoRole.role)}
          disabled={loggingIn !== null}
          className={`
            w-full px-4 py-3 rounded-md text-sm font-medium
            transition-colors duration-200
            ${
              loggingIn === demoRole.role
                ? 'bg-blue-700 text-white cursor-wait'
                : loggingIn !== null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {loggingIn === demoRole.role ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            <div className="text-left">
              <div className="font-semibold">{demoRole.label}</div>
              <div className="text-xs opacity-90 mt-1">
                {demoRole.description}
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default DemoLoginButtons;
