'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import axios from 'axios';

interface GD {
  _id: string;
  title: string;
  topic: string;
  scheduledDate: string;
  duration: number;
  maxParticipants: number;
  participants: any[];
  isFull: boolean;
  status: string;
  meetingLink?: string;
}

const fetcher = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

export default function GDDashboard() {
  const [joinedGDs, setJoinedGDs] = useState<string[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // SWR with polling - refreshes every 5 seconds
  const { data, isLoading, mutate } = useSWR(
    `${API_URL}/group-discussions/all`,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
      dedupingInterval: 2000,
      revalidateIfStale: true,
    }
  );

  const gds: GD[] = data?.gds || [];

  const handleJoin = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `${API_URL}/group-discussions/${gdId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJoinedGDs([...joinedGDs, gdId]);
      toast.success(response.data.message);
      mutate(); // Refresh GD list immediately
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to join');
    }
  };

  const handleLeave = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.post(
        `${API_URL}/group-discussions/${gdId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJoinedGDs(joinedGDs.filter(id => id !== gdId));
      toast.success('Left group discussion');
      mutate(); // Refresh GD list immediately
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to leave');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded mb-4" />
            <div className="h-4 bg-zinc-800 rounded mb-3" />
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Available Group Discussions</h2>
        <p className="text-zinc-400">Join a GD session with other professionals. Limited to 6 slots per session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gds.map(gd => (
          <div
            key={gd._id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{gd.title}</h3>
                <p className="text-sm text-zinc-400">{gd.topic}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                gd.isFull
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {gd.isFull ? 'Full' : 'Available'}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(gd.scheduledDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {new Date(gd.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {gd.duration} min
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                {gd.participants.length}/{gd.maxParticipants} slots filled
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition"
                style={{ width: `${(gd.participants.length / gd.maxParticipants) * 100}%` }}
              />
            </div>

            {/* Meeting Link for Joined Users */}
            {joinedGDs.includes(gd._id) && gd.meetingLink && (
              <a
                href={gd.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-lg bg-green-600/20 text-green-300 hover:bg-green-600/30 font-medium transition text-center mb-2"
              >
                Join Meeting
              </a>
            )}

            {/* Action Button */}
            {joinedGDs.includes(gd._id) ? (
              <button
                onClick={() => handleLeave(gd._id)}
                className="w-full py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 font-medium transition flex items-center justify-center gap-2"
              >
                <X size={16} />
                Leave
              </button>
            ) : (
              <button
                onClick={() => handleJoin(gd._id)}
                disabled={gd.isFull}
                className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  gd.isFull
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Check size={16} />
                {gd.isFull ? 'Join Waitlist' : 'Join'}
              </button>
            )}
          </div>
        ))}
      </div>

      {gds.length === 0 && (
        <div className="text-center py-10">
          <p className="text-zinc-400">No group discussions available at the moment.</p>
        </div>
      )}
    </div>
  );
}
