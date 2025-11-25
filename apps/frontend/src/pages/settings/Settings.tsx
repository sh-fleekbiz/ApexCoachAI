import React, { useState } from 'react';
import { apiBaseUrl } from '../../api/index.js';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(`${apiBaseUrl}/me/export-data`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to export data: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.json';
      document.body.append(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to export data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllChats = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete all your chats? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(`${apiBaseUrl}/me/delete-all-chats`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chats: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to delete chats'
      );
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(`${apiBaseUrl}/me/delete-account`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }

      window.location.href = '/#/login';
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to delete account'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Data & Privacy</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mb-6 space-y-3">
          <p className="text-gray-600 mb-4">
            Manage your data and account settings.
          </p>
          <button
            onClick={handleExportData}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Export My Data'}
          </button>
          <button
            onClick={handleDeleteAllChats}
            className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Delete All Chats'}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-700 text-white p-3 rounded hover:bg-red-800 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 p-3 rounded hover:bg-gray-300 transition-colors"
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
