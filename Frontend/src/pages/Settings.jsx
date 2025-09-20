// Create src/pages/Settings.js
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileSettings from '../components/settings/ProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PreferenceSettings from '../components/settings/PreferenceSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (err) {
      error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (section, data) => {
    setSaving(true);
    try {
      const response = await api.put(`/settings/${section}`, data);
      setSettings(prev => ({ ...prev, [section]: response.data[section] }));
      success('Settings updated successfully');
      return true;
    } catch (err) {
      error('Failed to update settings');
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading settings..." />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Failed to load settings</p>
          <button 
            onClick={fetchSettings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'profile' && (
            <ProfileSettings 
              profile={settings.profile} 
              onSave={(data) => updateSettings('profile', data)}
              saving={saving}
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettings 
              notifications={settings.notifications} 
              onSave={(data) => updateSettings('notifications', data)}
              saving={saving}
            />
          )}
          
          {activeTab === 'preferences' && (
            <PreferenceSettings 
              preferences={settings.preferences} 
              onSave={(data) => updateSettings('preferences', data)}
              saving={saving}
            />
          )}
          
          {activeTab === 'security' && (
            <SecuritySettings 
              onSave={(data) => updateSettings('change-password', data)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;