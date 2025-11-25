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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Data & Privacy</h3>
          <button
            onClick={handleExportData}
            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Export My Data'}
          </button>
          <button
            onClick={handleDeleteAllChats}
            className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Delete All Chats'}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-700 text-white p-2 rounded hover:bg-red-800 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
