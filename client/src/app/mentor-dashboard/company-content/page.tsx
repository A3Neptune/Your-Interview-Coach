'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Edit, Trash2, Eye, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyPrepAPI } from '@/lib/api';

interface Company {
  _id: string;
  companyName: string;
  industry: string;
  price: number;
  totalQuestions: number;
  enrollmentCount: number;
  isActive: boolean;
  featured: boolean;
}

export default function CompanyContentPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await companyPrepAPI.getAllCompanies();
      setCompanies(res.data.companies || []);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await companyPrepAPI.deleteCompany(id);
      toast.success('Company deleted');
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const totalRevenue = companies.reduce((sum, c) => sum + (c.enrollmentCount * c.price), 0);
  const totalStudents = companies.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const totalQuestions = companies.reduce((sum, c) => sum + c.totalQuestions, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Company Prep Content</h1>
          <p className="text-zinc-400">Manage interview questions for different companies</p>
        </div>
        <Link
          href="/mentor-dashboard/company-content/create"
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
        >
          <Plus size={20} />
          Add Company
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-teal-400" size={24} />
            <span className="text-zinc-400">Companies</span>
          </div>
          <p className="text-3xl font-bold text-white">{companies.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="text-blue-400" size={24} />
            <span className="text-zinc-400">Questions</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalQuestions}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-400" size={24} />
            <span className="text-zinc-400">Students</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalStudents}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-emerald-400" size={24} />
            <span className="text-zinc-400">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Companies Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Building2 size={64} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-400 text-lg mb-4">No companies yet</p>
          <Link
            href="/mentor-dashboard/company-content/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
          >
            <Plus size={20} />
            Add Your First Company
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Company</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Industry</th>
                <th className="text-center px-6 py-4 text-zinc-400 font-medium">Questions</th>
                <th className="text-center px-6 py-4 text-zinc-400 font-medium">Students</th>
                <th className="text-center px-6 py-4 text-zinc-400 font-medium">Price</th>
                <th className="text-center px-6 py-4 text-zinc-400 font-medium">Status</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {companies.map((company) => (
                <tr key={company._id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                        <Building2 size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{company.companyName}</p>
                        {company.featured && (
                          <span className="text-xs text-emerald-400">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{company.industry}</td>
                  <td className="px-6 py-4 text-center text-zinc-300">{company.totalQuestions}</td>
                  <td className="px-6 py-4 text-center text-zinc-300">{company.enrollmentCount}</td>
                  <td className="px-6 py-4 text-center text-zinc-300">₹{company.price}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {company.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/company-prep/${company._id}`}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition text-zinc-400 hover:text-white"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/mentor-dashboard/company-content/${company._id}/edit`}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition text-zinc-400 hover:text-white"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(company._id, company.companyName)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-zinc-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
