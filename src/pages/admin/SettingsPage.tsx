import { useState, FormEvent } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const [siteNameBn, setSiteNameBn] = useState(settings?.siteName?.bn || '');
  const [themeNavy, setThemeNavy] = useState(settings?.theme?.navy || '#0A2148');
  const [themeOrange, setThemeOrange] = useState(settings?.theme?.orange || '#F5821F');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateSettings({
        ...settings,
        siteName: { ...settings?.siteName, bn: siteNameBn },
        theme: { ...settings?.theme, navy: themeNavy, orange: themeOrange }
      });
      setMessage('Settings updated successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold font-bangla text-tiger-navy mb-6">সাইট সেটিংস (Site Settings)</h2>
      
      {message && <div className="mb-4 p-3 bg-gray-100 rounded text-sm">{message}</div>}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bangla mb-1">সাইটের নাম (Bangla)</label>
          <input 
            type="text" 
            value={siteNameBn} 
            onChange={(e) => setSiteNameBn(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bangla mb-1">প্রাইমারি কালার (Navy)</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={themeNavy} 
              onChange={(e) => setThemeNavy(e.target.value)}
              className="w-10 h-10 border-0 p-0"
            />
            <span className="font-mono text-sm">{themeNavy}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bangla mb-1">অ্যাকসেন্ট কালার (Orange)</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={themeOrange} 
              onChange={(e) => setThemeOrange(e.target.value)}
              className="w-10 h-10 border-0 p-0"
            />
            <span className="font-mono text-sm">{themeOrange}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-tiger-navy text-white px-6 py-2 rounded-sm font-bangla mt-6 hover:bg-tiger-navy/90 disabled:opacity-50"
        >
          {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </button>
      </form>
    </div>
  );
}
