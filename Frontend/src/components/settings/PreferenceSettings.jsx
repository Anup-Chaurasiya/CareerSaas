// Create src/components/settings/PreferenceSettings.js
import { useState } from 'react';

const PreferenceSettings = ({ preferences, onSave, saving }) => {
  const [formData, setFormData] = useState(preferences);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Application Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Email Frequency
            </label>
            <select
              id="emailFrequency"
              name="emailFrequency"
              value={formData.emailFrequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="never">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <label htmlFor="resumeAutoAnalyze" className="text-sm font-medium text-gray-700">
              Auto-analyze resumes on upload
            </label>
            <p className="text-xs text-gray-500">Automatically analyze resumes when they are uploaded</p>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input 
              type="checkbox" 
              id="resumeAutoAnalyze"
              checked={formData.resumeAutoAnalyze}
              onChange={() => handleToggle('resumeAutoAnalyze')}
              className="sr-only"
            />
            <div className={`block w-10 h-6 rounded-full ${formData.resumeAutoAnalyze ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.resumeAutoAnalyze ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </div>

        <div className="flex justify-end">
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

export default PreferenceSettings;