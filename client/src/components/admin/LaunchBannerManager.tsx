'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface BannerData {
  isActive: boolean;
  message: string;
  originalPrice: number;
  discountedPrice: number;
  ctaText: string;
  ctaLink: string;
  countdownHours: number;
  showCountdown: boolean;
  badgeText: string;
  savePercentage: number;
}

export default function LaunchBannerManager() {
  const [bannerData, setBannerData] = useState<BannerData>({
    isActive: true,
    message: 'Grand Launch: All sessions',
    originalPrice: 999,
    discountedPrice: 9,
    ctaText: 'Claim Now',
    ctaLink: '/signup',
    countdownHours: 48,
    showCountdown: true,
    badgeText: 'Launch Offer',
    savePercentage: 99,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch current banner data
  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await fetch(`${API_URL}/launch-banner/active`);
      const data = await response.json();

      if (data.success && data.data) {
        setBannerData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch banner data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login.' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/launch-banner/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Banner updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update banner' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update banner' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login.' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/launch-banner/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBannerData(data.data);
        setMessage({
          type: 'success',
          text: `Banner ${data.data.isActive ? 'activated' : 'deactivated'} successfully!`
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle banner' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Launch Banner Settings</h2>
          <p className="text-sm text-zinc-400">Manage the promotional banner displayed on your website</p>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            bannerData.isActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          {bannerData.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {bannerData.isActive ? 'Active' : 'Inactive'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
        }`}>
          <AlertCircle className={`w-4 h-4 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
          <span className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {message.text}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Banner Message</label>
          <input
            type="text"
            value={bannerData.message}
            onChange={(e) => setBannerData({ ...bannerData, message: e.target.value })}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Grand Launch: All sessions"
          />
        </div>

        {/* Badge Text */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Badge Text</label>
          <input
            type="text"
            value={bannerData.badgeText}
            onChange={(e) => setBannerData({ ...bannerData, badgeText: e.target.value })}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Launch Offer"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Original Price (₹)</label>
            <input
              type="number"
              value={bannerData.originalPrice}
              onChange={(e) => setBannerData({ ...bannerData, originalPrice: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Discounted Price (₹)</label>
            <input
              type="number"
              value={bannerData.discountedPrice}
              onChange={(e) => setBannerData({ ...bannerData, discountedPrice: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Save Percentage (%)</label>
            <input
              type="number"
              value={bannerData.savePercentage}
              onChange={(e) => setBannerData({ ...bannerData, savePercentage: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={bannerData.ctaText}
              onChange={(e) => setBannerData({ ...bannerData, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Claim Now"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CTA Link</label>
            <input
              type="text"
              value={bannerData.ctaLink}
              onChange={(e) => setBannerData({ ...bannerData, ctaLink: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="/signup"
            />
          </div>
        </div>

        {/* Countdown Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Countdown Duration (hours)</label>
            <input
              type="number"
              value={bannerData.countdownHours}
              onChange={(e) => setBannerData({ ...bannerData, countdownHours: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              min="1"
              max="168"
            />
            <p className="text-xs text-zinc-500 mt-1">Maximum 168 hours (7 days)</p>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bannerData.showCountdown}
                onChange={(e) => setBannerData({ ...bannerData, showCountdown: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700"
              />
              <span className="text-sm text-zinc-300">Show Countdown Timer</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={fetchBannerData}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-all"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
