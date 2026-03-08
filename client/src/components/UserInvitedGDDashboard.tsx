'use client';

import { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, Users, Check, X, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AcceptedGDCard from './AcceptedGDCard';

interface GD {
  _id: string;
  title: string;
  topic: string;
  description?: string;
  scheduledDate: string;
  duration: number;
  maxParticipants: number;
  participants: any[];
  isFull: boolean;
  status: string;
  price: number;
  meetingLink?: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface GDInvitation {
  gdId: string;
  status: 'pending' | 'accepted' | 'declined';
  paymentVerified: boolean;
  respondedAt?: string;
}

export default function UserInvitedGDDashboard() {
  const [invitedGDs, setInvitedGDs] = useState<GD[]>([]);
  const [invitationStatuses, setInvitationStatuses] = useState<Record<string, GDInvitation>>({});
  const [paymentVerified, setPaymentVerified] = useState<Record<string, boolean>>({});
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial GDs
  useEffect(() => {
    const fetchInitialGDs = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/group-discussions/user/invitations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvitedGDs(res.data.gds);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching GDs:', err);
        setIsLoading(false);
      }
    };

    fetchInitialGDs();
  }, [API_URL]);

  // Listen to notifications for real-time updates
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const eventSource = new EventSource(
        `${API_URL}/notifications/stream/connect?token=${encodeURIComponent(token)}`
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            // If notification is about GD acceptance, refresh GDs
            const notification = data.data;
            if (notification.type === 'gd-accepted' || notification.type === 'gd-started') {
              // Refresh the GD list
              const refreshGDs = async () => {
                const res = await axios.get(`${API_URL}/group-discussions/user/invitations`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setInvitedGDs(res.data.gds);
              };
              refreshGDs();
            }
          }
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      eventSourceRef.current = eventSource;

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    } catch (err) {
      console.error('SSE connection error:', err);
    }
  }, [API_URL]);

  const handleAccept = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      // Get payment amount for this GD
      const paymentCheck = await axios.get(
        `${API_URL}/group-discussions/check-payment?gdId=${gdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store payment amount for this GD
      setPaymentAmounts(prev => ({
        ...prev,
        [gdId]: paymentCheck.data.paymentAmount,
      }));

      // Join the GD (without payment verification - will show locked card for payment)
      await axios.post(
        `${API_URL}/group-discussions/${gdId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvitationStatuses(prev => ({
        ...prev,
        [gdId]: {
          ...prev[gdId],
          status: 'accepted',
          paymentVerified: false // Locked until payment
        },
      }));

      toast.success('✅ Accepted! Now showing payment details.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to accept invite');
    }
  };

  const handleDecline = async (gdId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.post(
        `${API_URL}/group-discussions/${gdId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from list immediately
      setInvitedGDs(prev => prev.filter(gd => gd._id !== gdId));

      toast.success('Declined GD invitation');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to decline invitation');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
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

  const pendingGDs = invitedGDs.filter(gd => {
    const status = invitationStatuses[gd._id]?.status || 'pending';
    return status === 'pending';
  });

  const acceptedGDs = invitedGDs.filter(gd => {
    const status = invitationStatuses[gd._id]?.status || 'pending';
    return status === 'accepted';
  });

  const handleConnect = (gdId: string) => {
    console.log('Connected to GD:', gdId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Group Discussions</h2>
        <p className="text-zinc-400">Manage your GD invitations and access your sessions</p>
      </div>

      {/* Accepted GDs Section */}
      {acceptedGDs.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-emerald-400 mb-1">✓ Accepted Sessions ({acceptedGDs.length})</h3>
            <p className="text-sm text-zinc-400">Your scheduled group discussions with payment details</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {acceptedGDs.map(gd => (
              <AcceptedGDCard
                key={gd._id}
                gd={gd}
                paymentVerified={paymentVerified[gd._id] || false}
                onConnect={handleConnect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Invitations Section */}
      {pendingGDs.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-blue-400 mb-1">📬 Pending Invitations ({pendingGDs.length})</h3>
            <p className="text-sm text-zinc-400">Accept or decline your group discussion invitations</p>
          </div>
          <div className="space-y-4">
            {pendingGDs.map(gd => (
              <div
                key={gd._id}
                className="border border-zinc-800 rounded-lg p-6 bg-zinc-900 hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{gd.title}</h3>
                    <p className="text-sm text-zinc-400">{gd.topic}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Invited by: {gd.createdBy.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                    Pending
                  </span>
                </div>

                {/* GD Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Calendar size={14} className="text-blue-400" />
                    {new Date(gd.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock size={14} className="text-purple-400" />
                    {new Date(gd.scheduledDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Users size={14} className="text-pink-400" />
                    {gd.participants.length}/{gd.maxParticipants}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock size={14} className="text-emerald-400" />
                    {gd.duration} min
                  </div>
                </div>

                {/* Payment Required Message */}
                <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
                  <Lock size={14} className="text-blue-300 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    {paymentAmounts[gd._id] > 0 ? (
                      <>Payment of <span className="font-semibold">₹{paymentAmounts[gd._id]}</span> required to join</>
                    ) : (
                      <>This is a <span className="font-semibold">free</span> session</>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(gd._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                  >
                    <Check size={16} />
                    Accept & Pay
                  </button>
                  <button
                    onClick={() => handleDecline(gd._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-medium transition"
                  >
                    <X size={16} />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingGDs.length === 0 && acceptedGDs.length === 0 && (
        <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <p className="text-zinc-400">No group discussion invitations yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
