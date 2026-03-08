'use client';

import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  title: string;
  value: string;
  points: string[];
  level: string;
  support: string;
  access: string;
}

interface Stat {
  stat: string;
  desc: string;
}

interface PricingData {
  _id?: string;
  header: {
    badge: string;
    title: string;
    subtitle: string;
  };
  services: Service[];
  stats: Stat[];
  ctaButtonText: string;
  autoPlayInterval: number;
  showGridView: boolean;
  showStats: boolean;
}

export default function AdminPricingPage() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Service | null>(null);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      const res = await axios.get(`${API_URL}/pricing-section/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setPricingData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      toast.error('Failed to load pricing data');
      setIsLoading(false);
    }
  };

  const handleHeaderChange = (field: string, value: string) => {
    if (!pricingData) return;
    setPricingData({
      ...pricingData,
      header: {
        ...pricingData.header,
        [field]: value,
      },
    });
  };

  const handleSaveHeader = async () => {
    if (!pricingData) return;
    try {
      setIsSaving(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      await axios.put(
        `${API_URL}/pricing-section/admin/header`,
        pricingData.header,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success('Header updated successfully!');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving header:', error);
      toast.error('Failed to save header');
      setIsSaving(false);
    }
  };

  const handleServiceChange = (serviceId: string, field: string, value: any) => {
    if (!pricingData) return;
    setPricingData({
      ...pricingData,
      services: pricingData.services.map(s =>
        s.id === serviceId ? { ...s, [field]: value } : s
      ),
    });
  };

  const handleSaveService = async (serviceId: string) => {
    if (!pricingData) return;
    try {
      setIsSaving(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');
      const service = pricingData.services.find(s => s.id === serviceId);

      if (!service) return;

      await axios.put(
        `${API_URL}/pricing-section/admin/services/${serviceId}`,
        service,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success('Service updated successfully!');
      setEditingServiceId(null);
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!pricingData) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      await axios.delete(`${API_URL}/pricing-section/admin/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setPricingData({
        ...pricingData,
        services: pricingData.services.filter(s => s.id !== serviceId),
      });

      toast.success('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  if (isLoading || !pricingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Pricing Section Manager</h1>
        <p className="text-zinc-400 mt-2">Manage all pricing section content and services</p>
      </div>

      {/* Section Header Editor */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Badge</label>
            <input
              type="text"
              value={pricingData.header.badge}
              onChange={(e) => handleHeaderChange('badge', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Title</label>
            <input
              type="text"
              value={pricingData.header.title}
              onChange={(e) => handleHeaderChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Subtitle</label>
            <textarea
              value={pricingData.header.subtitle}
              onChange={(e) => handleHeaderChange('subtitle', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSaveHeader}
            disabled={isSaving}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Header'}
          </button>
        </div>
      </div>

      {/* Services Editor */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
        <div className="space-y-6">
          {pricingData.services.map((service) => (
            <div key={service.id} className="border border-zinc-700 rounded-xl p-6 bg-zinc-800/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingServiceId(editingServiceId === service.id ? null : service.id)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {editingServiceId === service.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => handleServiceChange(service.id, 'price', parseInt(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Duration</label>
                      <input
                        type="text"
                        value={service.duration}
                        onChange={(e) => handleServiceChange(service.id, 'duration', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Description</label>
                    <textarea
                      value={service.value}
                      onChange={(e) => handleServiceChange(service.id, 'value', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveService(service.id)}
                    disabled={isSaving}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              ) : (
                <div className="text-zinc-400">
                  <p>Price: ₹{service.price}</p>
                  <p>Duration: {service.duration}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
