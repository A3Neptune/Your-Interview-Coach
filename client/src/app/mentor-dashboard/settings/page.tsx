'use client';

import { useEffect, useState } from 'react';
import { Settings, Bell, Lock, Globe, User, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authAPI } from '@/lib/api';
import LaunchBannerManager from '@/components/admin/LaunchBannerManager';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoConfirmBookings: false,
    allowDirectMessages: true,
    notifyNewBookings: true,
    notifyJobMatches: true,
    emailNotifications: true,
    timezone: 'IST',
    language: 'English',
    businessName: '',
    bio: '',
    website: '',
    maxStudentsPerDay: 5,
    sessionBuffer: 15,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  // Detect changes
  useEffect(() => {
    if (Object.keys(originalSettings).length > 0) {
      const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(changed);
    }
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;
        const loadedSettings = {
          businessName: userData.businessName || '',
          bio: userData.bio || '',
          website: userData.website || '',
          timezone: userData.timezone || 'IST',
          language: userData.language || 'English',
          maxStudentsPerDay: userData.maxStudentsPerDay || 5,
          sessionBuffer: userData.sessionBuffer || 15,
          autoConfirmBookings: userData.autoConfirmBookings || false,
          allowDirectMessages: userData.allowDirectMessages !== undefined ? userData.allowDirectMessages : true,
          notifyNewBookings: userData.notifyNewBookings !== undefined ? userData.notifyNewBookings : true,
          notifyJobMatches: userData.notifyJobMatches !== undefined ? userData.notifyJobMatches : true,
          emailNotifications: userData.emailNotifications !== undefined ? userData.emailNotifications : true,
        };
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
        setHasChanges(false);
      } catch (err: any) {
        console.error('Settings API error:', err);
        if (err?.response?.status === 401) {
          localStorage.removeItem('authToken');
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      await authAPI.updateMentorSettings(settings);

      toast.success('Settings saved successfully!');
      setOriginalSettings(settings);
      setHasChanges(false);
      setIsSaving(false);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error(err.response?.data?.error || 'Failed to save settings');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast('Changes discarded');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Unsaved Changes Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            {hasChanges && (
              <span className="px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-2">Manage your mentor profile and preferences</p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
            >
              Discard
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Now'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Settings */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <User size={24} className="text-blue-400" />
          Profile Information
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({...settings, businessName: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => setSettings({...settings, bio: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              placeholder="Tell students about your expertise..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Website</label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({...settings, website: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Availability Settings */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe size={24} className="text-blue-400" />
          Availability & Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option>IST (Indian Standard Time)</option>
              <option>GMT</option>
              <option>EST</option>
              <option>PST</option>
              <option>CST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Max Students Per Day</label>
            <input
              type="number"
              value={settings.maxStudentsPerDay}
              onChange={(e) => setSettings({...settings, maxStudentsPerDay: parseInt(e.target.value)})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
              min="1"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Session Buffer (minutes)</label>
            <input
              type="number"
              value={settings.sessionBuffer}
              onChange={(e) => setSettings({...settings, sessionBuffer: parseInt(e.target.value)})}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
              min="0"
              max="60"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Bell size={24} className="text-yellow-400" />
          Notifications
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.notifyNewBookings}
              onChange={(e) => setSettings({...settings, notifyNewBookings: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600"
            />
            <div>
              <p className="text-white font-semibold">Notify on New Bookings</p>
              <p className="text-zinc-400 text-sm">Get notified when students book sessions</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.notifyJobMatches}
              onChange={(e) => setSettings({...settings, notifyJobMatches: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600"
            />
            <div>
              <p className="text-white font-semibold">Notify on Job Matches</p>
              <p className="text-zinc-400 text-sm">Get notified when jobs match your skills</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600"
            />
            <div>
              <p className="text-white font-semibold">Email Notifications</p>
              <p className="text-zinc-400 text-sm">Receive important updates via email</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.autoConfirmBookings}
              onChange={(e) => setSettings({...settings, autoConfirmBookings: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600"
            />
            <div>
              <p className="text-white font-semibold">Auto-Confirm Bookings</p>
              <p className="text-zinc-400 text-sm">Automatically confirm booking requests</p>
            </div>
          </label>
        </div>
      </div>

      {/* Launch Banner Manager */}
      <LaunchBannerManager />

      {/* Privacy & Security */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock size={24} className="text-red-400" />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.allowDirectMessages}
              onChange={(e) => setSettings({...settings, allowDirectMessages: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600"
            />
            <div>
              <p className="text-white font-semibold">Allow Direct Messages</p>
              <p className="text-zinc-400 text-sm">Allow students to send you direct messages</p>
            </div>
          </label>

          <button
            onClick={() => toast('Password change feature coming soon!')}
            className="w-full px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-400 font-semibold transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-900/20 via-red-900/10 to-black border border-red-800/50 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-zinc-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button
              onClick={() => {
                if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                  toast.error('Account deletion feature is currently disabled for safety. Please contact support.');
                }
              }}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save Button - Sticky Footer */}
      <div className="sticky bottom-0 bg-black/95 backdrop-blur-sm border-t border-zinc-800 p-4 -mx-8 -mb-8 mt-8">
        <div className="flex justify-between items-center max-w-full">
          <div className="text-sm text-zinc-400">
            {hasChanges ? (
              <span className="flex items-center gap-2 text-yellow-400">
                <AlertCircle size={16} />
                You have unsaved changes
              </span>
            ) : (
              <span className="text-emerald-400">All changes saved</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={!hasChanges || isSaving}
              className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges || isSaving}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
