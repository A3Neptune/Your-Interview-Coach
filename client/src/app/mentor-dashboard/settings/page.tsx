'use client';

import { useEffect, useState } from 'react';
import { Settings, Bell, Lock, Globe, User, Save, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
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
    availabilitySettings: {
      startHour: 9,
      endHour: 18,
      slotDuration: 60,
      bufferMinutes: 0,
      daysOff: [] as number[],
      blockedDates: [] as string[],
      dateOverrides: [] as { date: string; startHour: number; endHour: number }[],
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<any>({});
  const [blockDateInput, setBlockDateInput] = useState('');
  const [overrideForm, setOverrideForm] = useState({ date: '', startHour: 9, endHour: 18 });

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
          availabilitySettings: {
            startHour: userData.availabilitySettings?.startHour ?? 9,
            endHour: userData.availabilitySettings?.endHour ?? 18,
            slotDuration: userData.availabilitySettings?.slotDuration ?? 60,
            bufferMinutes: userData.availabilitySettings?.bufferMinutes ?? 0,
            daysOff: userData.availabilitySettings?.daysOff ?? [],
            blockedDates: userData.availabilitySettings?.blockedDates ?? [],
            dateOverrides: userData.availabilitySettings?.dateOverrides ?? [],
          },
        };
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
        setHasChanges(false);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          localStorage.removeItem('authToken');
        }
      }

      setIsLoading(false);
    } catch (err) {
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

      {/* Slot Availability Settings */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Clock size={24} className="text-green-400" />
          Slot Availability
        </h2>
        <p className="text-zinc-500 text-sm mb-6">Set your weekly schedule. Students only see open, future slots.</p>

        {/* Working hours row */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">From</label>
            <select
              value={settings.availabilitySettings.startHour}
              onChange={(e) => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, startHour: Number(e.target.value) } })}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-green-500 focus:outline-none transition"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
          <span className="text-zinc-500 text-sm pb-2.5">to</span>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">To</label>
            <select
              value={settings.availabilitySettings.endHour}
              onChange={(e) => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, endHour: Number(e.target.value) } })}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-green-500 focus:outline-none transition"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Slot Duration</label>
            <select
              value={settings.availabilitySettings.slotDuration}
              onChange={(e) => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, slotDuration: Number(e.target.value) } })}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-green-500 focus:outline-none transition"
            >
              {[30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} mins</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Break After</label>
            <select
              value={settings.availabilitySettings.bufferMinutes}
              onChange={(e) => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, bufferMinutes: Number(e.target.value) } })}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-green-500 focus:outline-none transition"
            >
              {[0, 5, 10, 15, 30].map(b => <option key={b} value={b}>{b === 0 ? 'None' : `${b} mins`}</option>)}
            </select>
          </div>
        </div>

        {/* Days off */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Days Off</label>
          <div className="flex gap-1.5">
            {['S','M','T','W','T','F','S'].map((d, idx) => {
              const isOff = settings.availabilitySettings.daysOff.includes(idx);
              return (
                <button key={idx} type="button"
                  onClick={() => {
                    const daysOff = isOff
                      ? settings.availabilitySettings.daysOff.filter(x => x !== idx)
                      : [...settings.availabilitySettings.daysOff, idx];
                    setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, daysOff } });
                  }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${isOff ? 'bg-red-600/30 border border-red-500 text-red-400' : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                  title={['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]}
                >{d}</button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 my-6" />

        {/* Block a date */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Block a Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={blockDateInput}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setBlockDateInput(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none transition"
            />
            <button type="button"
              onClick={() => {
                if (!blockDateInput) return;
                if (settings.availabilitySettings.blockedDates.includes(blockDateInput)) { toast.error('Already blocked'); return; }
                setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, blockedDates: [...settings.availabilitySettings.blockedDates, blockDateInput].sort() } });
                setBlockDateInput('');
              }}
              className="px-4 py-2.5 rounded-lg bg-red-600/20 border border-red-500/60 text-red-400 text-sm font-semibold hover:bg-red-600/30 transition whitespace-nowrap"
            >+ Block</button>
          </div>
          {settings.availabilitySettings.blockedDates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {settings.availabilitySettings.blockedDates.map(d => (
                <span key={d} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-semibold">
                  {new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  <button type="button" onClick={() => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, blockedDates: settings.availabilitySettings.blockedDates.filter(x => x !== d) } })} className="hover:text-white ml-0.5 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Custom slot for a date */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Custom Hours for a Date</label>
          <p className="text-zinc-600 text-xs mb-3">Override the working window for one specific date only.</p>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={overrideForm.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setOverrideForm(f => ({ ...f, date: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-blue-500 focus:outline-none transition flex-1 min-w-[130px]"
            />
            <select value={overrideForm.startHour} onChange={e => setOverrideForm(f => ({ ...f, startHour: Number(e.target.value) }))}
              className="px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-blue-500 focus:outline-none">
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>)}
            </select>
            <span className="text-zinc-500 text-sm self-center">–</span>
            <select value={overrideForm.endHour} onChange={e => setOverrideForm(f => ({ ...f, endHour: Number(e.target.value) }))}
              className="px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-blue-500 focus:outline-none">
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>)}
            </select>
            <button type="button"
              onClick={() => {
                if (!overrideForm.date) { toast.error('Pick a date'); return; }
                if (overrideForm.startHour >= overrideForm.endHour) { toast.error('Start must be before end'); return; }
                if (settings.availabilitySettings.blockedDates.includes(overrideForm.date)) { toast.error('Date is blocked — unblock it first'); return; }
                if (settings.availabilitySettings.dateOverrides.find(o => o.date === overrideForm.date)) { toast.error('Override already exists for this date'); return; }
                setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, dateOverrides: [...settings.availabilitySettings.dateOverrides, { ...overrideForm }].sort((a, b) => a.date.localeCompare(b.date)) } });
                setOverrideForm({ date: '', startHour: 9, endHour: 18 });
              }}
              className="px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/60 text-blue-400 text-sm font-semibold hover:bg-blue-600/30 transition whitespace-nowrap"
            >+ Add</button>
          </div>
          {settings.availabilitySettings.dateOverrides.length > 0 && (
            <div className="space-y-1.5 mt-3">
              {settings.availabilitySettings.dateOverrides.map(o => {
                const fmt = (h: number) => h < 12 ? `${h || 12} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
                return (
                  <div key={o.date} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700 text-sm">
                    <span className="text-white font-semibold w-24 shrink-0">{new Date(o.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-blue-400 flex-1">{fmt(o.startHour)} – {fmt(o.endHour)}</span>
                    <button type="button" onClick={() => setSettings({ ...settings, availabilitySettings: { ...settings.availabilitySettings, dateOverrides: settings.availabilitySettings.dateOverrides.filter(x => x.date !== o.date) } })} className="text-zinc-600 hover:text-red-400 transition text-base leading-none">×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live summary */}
        {(() => {
          const { startHour, endHour, slotDuration, bufferMinutes, blockedDates, dateOverrides, daysOff } = settings.availabilitySettings;
          const fmt = (h: number) => h < 12 ? `${h || 12} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
          const inc = slotDuration + bufferMinutes;
          const slots = inc > 0 && endHour > startHour ? Math.floor(((endHour - startHour) * 60) / inc) : 0;
          const offDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].filter((_, i) => daysOff.includes(i));
          return (
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-green-600/15 border border-green-500/30 text-green-400">{fmt(startHour)} – {fmt(endHour)}</span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">{slotDuration} mins · {slots} slot{slots !== 1 ? 's' : ''}/day</span>
              {offDays.length > 0 && <span className="px-2.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400">Off: {offDays.join(', ')}</span>}
              {blockedDates.length > 0 && <span className="px-2.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400">{blockedDates.length} date{blockedDates.length > 1 ? 's' : ''} blocked</span>}
              {dateOverrides.length > 0 && <span className="px-2.5 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400">{dateOverrides.length} custom date{dateOverrides.length > 1 ? 's' : ''}</span>}
            </div>
          );
        })()}
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
          {/* <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition">
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
          </label> */}

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
