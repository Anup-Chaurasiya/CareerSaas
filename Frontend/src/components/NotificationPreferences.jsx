// Create src/components/NotificationPreferences.js
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: {
      welcome: true,
      resumeAnalyzed: true,
      subscription: true,
      promotional: true,
      productUpdates: true
    },
    inApp: {
      resumeAnalyzed: true,
      subscription: true,
      recommendations: true
    }
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await api.get('/notifications/preferences');
      setPreferences(response.data);
    } catch (err) {
      console.error('Failed to fetch notification preferences');
    }
  };

  const handleToggle = async (category, type) => {
    const updatedPreferences = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [type]: !preferences[category][type]
      }
    };

    setPreferences(updatedPreferences);

    try {
      setLoading(true);
      await api.put('/notifications/preferences', updatedPreferences);
      success('Preferences updated successfully');
    } catch (err) {
      error('Failed to update preferences');
      // Revert on error
      setPreferences(preferences);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries(preferences.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={`email-${key}`} className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id={`email-${key}`}
                    checked={value}
                    onChange={() => handleToggle('email', key)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-App Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
          <div className="space-y-4">
            {Object.entries(preferences.inApp).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={`inApp-${key}`} className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id={`inApp-${key}`}
                    checked={value}
                    onChange={() => handleToggle('inApp', key)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;