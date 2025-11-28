import {
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../../api/index.js';

interface AdminActionLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  description: string | null;
  meta_json: string | null;
  created_at: string;
}

const ActionLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminActionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(50);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiBaseUrl}/api/admin-action-logs?limit=${limit}&offset=${(page - 1) * limit}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to load action logs');
      }
    } catch (error) {
      console.error('Failed to load action logs:', error);
      setError('Failed to load action logs');
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action: string): string => {
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActionColor = (action: string): string => {
    if (action.includes('create')) return 'text-green-600 bg-green-50';
    if (action.includes('update')) return 'text-blue-600 bg-blue-50';
    if (action.includes('delete') || action.includes('cancel'))
      return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={SpinnerSize.large} label="Loading action logs..." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Admin Action Logs</h2>
        <p className="text-gray-600">
          View all administrative actions performed in the system
        </p>
      </div>

      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={() => setError(null)}
          className="mb-4"
        >
          {error}
        </MessageBar>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No action logs found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.entity_type && log.entity_id ? (
                          <span>
                            {log.entity_type} #{log.entity_id}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md">
                          {log.description || (
                            <span className="text-gray-400">
                              No description
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Page {page} • {logs.length} logs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={logs.length < limit}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionLogs;
