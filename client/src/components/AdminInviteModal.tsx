'use client';

import { useEffect, useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

interface AdminInviteModalProps {
  isOpen: boolean;
  gdId: string;
  gdTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminInviteModal({
  isOpen,
  gdId,
  gdTitle,
  onClose,
  onSuccess,
}: AdminInviteModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setIsFetching(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${API_URL}/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data.users || []);
    } catch (err: any) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setIsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      await axios.post(
        `${API_URL}/group-discussions/${gdId}/invite-users`,
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Invited ${selectedUsers.length} users to ${gdTitle}`);
      onSuccess();
      onClose();
      setSelectedUsers([]);
      setSearchTerm('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to invite users');
      console.error('Invite error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-white">Invite Users to GD</h2>
            <p className="text-sm text-zinc-400 mt-1">{gdTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg transition"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {isFetching ? (
            <div className="p-8 text-center text-zinc-400">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              {users.length === 0 ? 'No users found' : 'No matching users'}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {filteredUsers.map(user => (
                <button
                  key={user._id}
                  onClick={() => toggleUserSelection(user._id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-zinc-800/50 transition text-left ${
                    selectedUsers.includes(user._id) ? 'bg-blue-500/10' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedUsers.includes(user._id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-zinc-600'
                    }`}
                  >
                    {selectedUsers.includes(user._id) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                  </div>

                  {/* User Type Badge */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                      user.userType === 'student'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {user.userType}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={isLoading || selectedUsers.length === 0}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {isLoading ? 'Inviting...' : 'Send Invitations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
