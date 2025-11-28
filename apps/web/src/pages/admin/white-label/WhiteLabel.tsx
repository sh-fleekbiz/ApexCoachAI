import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../../services/index.js';

interface WhiteLabelSettings {
  id: number;
  logoUrl: string | null;
  brandColor: string | null;
  appName: string | null;
  customCss: string | null;
  updatedAt: string;
}

const WhiteLabel: React.FC = () => {
  const [settings, setSettings] = useState<WhiteLabelSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: MessageBarType;
    text: string;
  } | null>(null);

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [brandColor, setBrandColor] = useState<string>('');
  const [appName, setAppName] = useState<string>('');
  const [customCss, setCustomCss] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/white-label-settings`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setLogoUrl(data.logoUrl || '');
        setBrandColor(data.brandColor || '');
        setAppName(data.appName || '');
        setCustomCss(data.customCss || '');
      }
    } catch (error) {
      console.error('Failed to load white label settings:', error);
      setMessage({
        type: MessageBarType.error,
        text: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`${apiBaseUrl}/api/white-label-settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoUrl: logoUrl || null,
          brandColor: brandColor || null,
          appName: appName || null,
          customCss: customCss || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setMessage({
          type: MessageBarType.success,
          text: 'Settings saved successfully!',
        });
      } else {
        const error = await response.json();
        setMessage({
          type: MessageBarType.error,
          text: error.error || 'Failed to save settings',
        });
      }
    } catch (error) {
      console.error('Failed to save white label settings:', error);
      setMessage({
        type: MessageBarType.error,
        text: 'Failed to save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all white label settings to default?'
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`${apiBaseUrl}/api/white-label-settings`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setLogoUrl('');
        setBrandColor('');
        setAppName('');
        setCustomCss('');
        setMessage({
          type: MessageBarType.success,
          text: 'Settings reset to default',
        });
      } else {
        const error = await response.json();
        setMessage({
          type: MessageBarType.error,
          text: error.error || 'Failed to reset settings',
        });
      }
    } catch (error) {
      console.error('Failed to reset white label settings:', error);
      setMessage({
        type: MessageBarType.error,
        text: 'Failed to reset settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={SpinnerSize.large} label="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">White Label Settings</h2>
        <p className="text-gray-600">
          Customize the branding and appearance of your application
        </p>
      </div>

      {message && (
        <MessageBar
          messageBarType={message.type}
          onDismiss={() => setMessage(null)}
          className="mb-4"
        >
          {message.text}
        </MessageBar>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <TextField
            label="Application Name"
            value={appName}
            onChange={(_, newValue) => setAppName(newValue || '')}
            placeholder="Apex Coach AI"
            description="The name that appears in the application header and title"
          />
        </div>

        <div>
          <TextField
            label="Logo URL"
            value={logoUrl}
            onChange={(_, newValue) => setLogoUrl(newValue || '')}
            placeholder="https://example.com/logo.png"
            description="URL to your logo image (recommended: PNG or SVG, max height 48px)"
          />
          {logoUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={logoUrl}
                alt="Logo preview"
                className="max-h-12"
                onError={() =>
                  setMessage({
                    type: MessageBarType.warning,
                    text: 'Failed to load logo image',
                  })
                }
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={brandColor || '#0078D4'}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-11 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <TextField
              value={brandColor}
              onChange={(_, newValue) => setBrandColor(newValue || '')}
              placeholder="#0078D4"
              styles={{ root: { width: 120 } }}
            />
            <span className="text-sm text-gray-600">
              Primary brand color for buttons and accents
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Custom CSS</label>
          <textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder="/* Add custom CSS styles here */
.custom-class {
  /* your styles */
}"
            rows={10}
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm"
          />
          <p className="text-sm text-gray-600 mt-2">
            Advanced: Add custom CSS to further customize the appearance
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <PrimaryButton
            text={saving ? 'Saving...' : 'Save Settings'}
            onClick={handleSave}
            disabled={saving}
          />
          <PrimaryButton
            text="Reset to Default"
            onClick={handleReset}
            disabled={saving}
          />
        </div>

        {settings && (
          <div className="text-sm text-gray-500 pt-4 border-t">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteLabel;
