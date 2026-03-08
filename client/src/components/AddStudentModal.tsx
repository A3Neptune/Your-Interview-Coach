'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newStudent: any) => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
}: AddStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    userType: 'student',
    yearOfStudy: '1',
    skills: '',
    company: '',
    designation: '',
    yearsOfExperience: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserType = e.target.value;
    setUserType(newUserType);
    setFormData(prev => ({ ...prev, userType: newUserType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Type-specific validation
    if (userType === 'student' && !formData.yearOfStudy) {
      toast.error('Please select year of study');
      return;
    }

    if (userType === 'professional') {
      if (!formData.company || !formData.designation || !formData.yearsOfExperience) {
        toast.error('Please fill in company, designation, and years of experience');
        return;
      }
      if (isNaN(Number(formData.yearsOfExperience))) {
        toast.error('Years of experience must be a number');
        return;
      }
    }

    try {
      setIsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        userType: userType,
        skills: formData.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),
      };

      if (userType === 'student') {
        Object.assign(payload, {
          yearOfStudy: Number(formData.yearOfStudy),
        });
      } else if (userType === 'professional') {
        Object.assign(payload, {
          company: formData.company,
          designation: formData.designation,
          yearsOfExperience: Number(formData.yearsOfExperience),
        });
      }

      if (formData.password) {
        Object.assign(payload, { password: formData.password });
      }

      const response = await axios.post(
        `${API_URL}/auth/users/create`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Transform response to match table format
      const newStudent = {
        id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        mobile: response.data.user.mobile,
        joinDate: response.data.user.createdAt,
        sessions: 0,
        totalSpent: 0,
        status: 'Active',
        avatar: (response.data.user.name || '')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        skills: response.data.user.skills || [],
        userType: response.data.user.userType,
        company: response.data.user.company || 'N/A',
        designation: response.data.user.designation || 'N/A',
        yearOfStudy: response.data.user.yearOfStudy,
        yearsOfExperience: response.data.user.yearsOfExperience,
      };

      toast.success('Student added successfully');
      onAdd(newStudent);
      onClose();

      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        userType: 'student',
        yearOfStudy: '1',
        skills: '',
        company: '',
        designation: '',
        yearsOfExperience: '',
        password: '',
      });
      setUserType('student');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add student';
      toast.error(errorMsg);
      console.error('Add user error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-xl font-bold text-white">Add New Student</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg transition"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              User Type *
            </label>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="student">Student</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Mobile & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Mobile *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Password (optional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Student-specific fields */}
          {userType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Year of Study *
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          )}

          {/* Professional-specific fields */}
          {userType === 'professional' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Job title"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
