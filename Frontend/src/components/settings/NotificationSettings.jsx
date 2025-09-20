// Create src/components/settings/NotificationSettings.js
import { useState } from 'react';

const NotificationSettings = ({ notifications, onSave, saving }) => {
  const [preferences, setPreferences] = useState(notifications);

  const handleToggle = (category, type) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(preferences);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      <form onSubmit={handleSubmit}>
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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;