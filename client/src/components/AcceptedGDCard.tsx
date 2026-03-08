'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Lock, Unlock, ExternalLink, Video } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AcceptedGDCardProps {
  gd: {
    _id: string;
    title: string;
    topic: string;
    description?: string;
    scheduledDate: string;
    duration: number;
    maxParticipants: number;
    participants: any[];
    meetingLink?: string;
    price: number;
    createdBy: {
      name: string;
      email: string;
    };
  };
  paymentVerified: boolean;
  onConnect: (gdId: string) => void;
}

export default function AcceptedGDCard({ gd, paymentVerified: initialPaymentVerified, onConnect }: AcceptedGDCardProps) {
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(initialPaymentVerified);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePaymentComplete = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate payment processing (1 second delay)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark payment as verified
      setPaymentVerified(true);
      setShowPaymentGate(false);
      toast.success('✅ Payment verified! Zoom link unlocked.');
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleConnectClick = async () => {
    if (!paymentVerified) {
      setShowPaymentGate(true);
      return;
    }

    // User is connected - send notification to both user and admin
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Call connect endpoint to notify both user and admin
      const res = await axios.post(
        `${API_URL}/group-discussions/${gd._id}/connect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('✅ Connected! Notifications sent to admin.');
      onConnect(gd._id);

      // Open Zoom link in new window
      if (res.data.meetingLink) {
        setTimeout(() => {
          window.open(res.data.meetingLink, '_blank');
          toast.success('🎥 Zoom link opened in new window');
        }, 500);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to connect');
    } finally {
      setIsConnecting(false);
    }
  };

  const isScheduled = new Date(gd.scheduledDate) > new Date();

  return (
    <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg p-6 overflow-hidden group">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{gd.title}</h3>
            <p className="text-sm text-zinc-400">{gd.topic}</p>
            <p className="text-xs text-zinc-500 mt-1">by {gd.createdBy.name}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            paymentVerified
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            {paymentVerified ? (
              <>
                <Unlock size={14} />
                Unlocked
              </>
            ) : (
              <>
                <Lock size={14} />
                Locked
              </>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-zinc-300">
            <Calendar size={14} className="text-blue-400" />
            <span>{new Date(gd.scheduledDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock size={14} className="text-purple-400" />
            <span>{new Date(gd.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Users size={14} className="text-pink-400" />
            <span>{gd.participants.length}/{gd.maxParticipants}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock size={14} className="text-emerald-400" />
            <span>{gd.duration} min</span>
          </div>
        </div>

        {/* Status - Scheduled or Completed */}
        {isScheduled ? (
          <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-300">📅 This session is scheduled for the future</p>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-300">⏰ This session has already started or ended</p>
          </div>
        )}

        {/* Locked State - Payment Gate */}
        {!paymentVerified && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Lock size={18} className="text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-300 mb-1">Payment Required to Unlock</p>
                <p className="text-xs text-yellow-200 mb-3">
                  Make payment of <span className="font-bold">₹{gd.price}</span> to access the Zoom link and connect to this session.
                </p>
                <button
                  onClick={() => setShowPaymentGate(true)}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-yellow-600 hover:bg-yellow-700 text-white transition"
                >
                  Pay Now
                </button>
              </div>
            </div>

            {/* Payment Gate Modal */}
            {showPaymentGate && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-sm w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Complete Payment</h3>
                    <button
                      onClick={() => setShowPaymentGate(false)}
                      className="text-zinc-400 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-zinc-300 mb-2">{gd.title}</p>
                    <p className="text-2xl font-bold text-white">₹{gd.price}</p>
                    <p className="text-xs text-zinc-400 mt-2">Valid for this session only</p>
                  </div>

                  <p className="text-xs text-zinc-400 mb-4">
                    After payment, you'll be able to view the Zoom link and connect to this session.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPaymentGate(false)}
                      disabled={isProcessingPayment}
                      className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePaymentComplete}
                      disabled={isProcessingPayment}
                      className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingPayment ? 'Processing...' : `Pay ₹${gd.price}`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unlocked State - Show Zoom Link */}
        {paymentVerified && gd.meetingLink && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-emerald-300">✓ Zoom Link Available</p>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/30 text-emerald-200">Unlocked</span>
            </div>
            <p className="text-xs text-emerald-100 mb-3 break-all font-mono text-[10px]">{gd.meetingLink}</p>
            <a
              href={gd.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition"
            >
              <ExternalLink size={14} />
              Open Zoom
            </a>
          </div>
        )}

        {/* Connect Button - Only if payment verified and session is scheduled */}
        {paymentVerified && isScheduled && (
          <button
            onClick={handleConnectClick}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video size={16} />
            {isConnecting ? 'Connecting...' : 'Connect to Session'}
          </button>
        )}

        {/* Session Status Message */}
        {!isScheduled && (
          <div className="w-full px-4 py-3 rounded-lg bg-zinc-700/50 text-center text-sm text-zinc-300">
            This session is no longer available
          </div>
        )}
      </div>
    </div>
  );
}
