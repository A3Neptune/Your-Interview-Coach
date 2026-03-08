'use client';

import { useEffect, useState } from 'react';
import { Video, Phone, Plus, Calendar, Users, Clock, Play, Pause, Download, Share2, Edit2, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import axios from 'axios';
import ScheduleGDModal from '@/components/ScheduleGDModal';
import AdminInviteModal from '@/components/AdminInviteModal';

export default function GDPracticePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedGDId, setSelectedGDId] = useState<string>('');
  const [selectedGDTitle, setSelectedGDTitle] = useState<string>('');
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, gdId: '', gdTitle: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState({ open: false, gdId: '' });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // SWR with polling - refreshes every 5 seconds for live updates
  const { data, isLoading, mutate } = useSWR(
    `${API_URL}/group-discussions/all`,
    async (url: string) => {
      const res = await axios.get(url);
      return res.data;
    },
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  const sessions = data?.gds || [];

  const totalSessions = sessions.length;
  const studentsTrained = sessions.reduce((sum: number, s: any) => sum + s.participants.length, 0);
  const recordings = sessions.filter((s: any) => s.recordingLink).length;

  const handleCancelGD = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/group-discussions/${gdId}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('GD cancelled and notifications sent to participants');
      setCancelReason('');
      setShowCancelConfirm({ open: false, gdId: '' });
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel GD');
    }
  };

  const handleRescheduleGD = async (gdId: string, newDate: string, reason: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_URL}/group-discussions/${gdId}/reschedule`,
        { newScheduledDate: newDate, reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('GD rescheduled and notifications sent to participants');
      setRescheduleModal({ open: false, gdId: '', gdTitle: '' });
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reschedule GD');
    }
  };

  const handleDeleteGD = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `${API_URL}/group-discussions/${gdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('GD deleted successfully');
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete GD');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">GD Practice Setup</h1>
          <p className="text-zinc-400 mt-2">Schedule and manage group discussions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          <Plus size={20} />
          Schedule New GD
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Total Sessions</p>
          <p className="text-3xl font-bold text-blue-400">{totalSessions}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Students Trained</p>
          <p className="text-3xl font-bold text-purple-400">{studentsTrained}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Recordings</p>
          <p className="text-3xl font-bold text-emerald-400">{recordings}</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <p>No group discussions scheduled yet. Click "Schedule New GD" to create one!</p>
          </div>
        ) : (
          sessions.map((session: any) => (
            <div key={session._id} className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-3">{session.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3">{session.topic}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar size={16} className="text-blue-400" />
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Clock size={16} className="text-purple-400" />
                      {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Users size={16} className="text-pink-400" />
                      {session.participants.length}/{session.maxParticipants}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Video size={16} className="text-emerald-400" />
                      {session.duration} min
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.isFull
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {session.status === 'cancelled' ? 'Cancelled' : session.isFull ? 'Full' : 'Open'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGDId(session._id);
                      setSelectedGDTitle(session.title);
                      setInviteModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition opacity-0 group-hover:opacity-100"
                    title="Invite users"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => setRescheduleModal({ open: true, gdId: session._id, gdTitle: session.title })}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition opacity-0 group-hover:opacity-100"
                    title="Reschedule"
                  >
                    <Calendar size={18} />
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm({ open: true, gdId: session._id })}
                    className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition opacity-0 group-hover:opacity-100"
                    title="Cancel"
                  >
                    <AlertCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteGD(session._id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Setup Guide */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">How to Setup GD Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              step: 1,
              title: 'Schedule Session',
              desc: 'Choose date, time, and topic for the group discussion',
              icon: '📅',
            },
            {
              step: 2,
              title: 'Invite Students',
              desc: 'Add students from your enrollment list',
              icon: '👥',
            },
            {
              step: 3,
              title: 'Start Meeting',
              desc: 'Join video call with integrated Zoom/Meet',
              icon: '🎥',
            },
            {
              step: 4,
              title: 'Record & Share',
              desc: 'Recordings are saved for playback',
              icon: '💾',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white">
                  {item.step}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule GD Modal */}
      <ScheduleGDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => mutate()}
      />

      {/* Admin Invite Modal */}
      <AdminInviteModal
        isOpen={inviteModalOpen}
        gdId={selectedGDId}
        gdTitle={selectedGDTitle}
        onClose={() => {
          setInviteModalOpen(false);
          setSelectedGDId('');
          setSelectedGDTitle('');
        }}
        onSuccess={() => mutate()}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Cancel GD</h3>
            <p className="text-zinc-400 mb-4">Are you sure you want to cancel this GD? All participants will be notified and eligible for refunds.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 mb-4 resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelConfirm({ open: false, gdId: '' });
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
              >
                No, Keep it
              </button>
              <button
                onClick={() => handleCancelGD(showCancelConfirm.gdId)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Yes, Cancel GD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Reschedule: {rescheduleModal.gdTitle}</h3>
            <RescheduleForm
              onSubmit={(newDate: string, reason: string) => {
                handleRescheduleGD(rescheduleModal.gdId, newDate, reason);
              }}
              onCancel={() => setRescheduleModal({ open: false, gdId: '', gdTitle: '' })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Reschedule Form Component
function RescheduleForm({ onSubmit, onCancel }: { onSubmit: (date: string, reason: string) => void; onCancel: () => void }) {
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      toast.error('Please select a new date');
      return;
    }
    onSubmit(newDate, reason);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-300 mb-2">New Date & Time</label>
        <input
          type="datetime-local"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-300 mb-2">Reason (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rescheduling"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 resize-none"
          rows={2}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Reschedule
        </button>
      </div>
    </form>
  );
}
