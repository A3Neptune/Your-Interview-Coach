'use client';

import { X } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  service: {
    id: string;
    name: string;
    description: string;
    icon: string;
    price: number;
  } | null;
  onClose: () => void;
}

export default function ServiceModal({ isOpen, service, onClose }: ServiceModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-zinc-900 via-black to-black border border-white/20 rounded-3xl p-8 md:p-12 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition border border-white/20 z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-6">
            <div className="text-7xl">{service.icon}</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">{service.name}</h2>
              <p className="text-lg text-zinc-300">{service.description}</p>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-zinc-400 mb-2">Per Session Price</p>
              <p className="text-3xl font-bold text-white">₹{service.price}</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-zinc-400 mb-2">Session Duration</p>
              <p className="text-3xl font-bold text-zinc-200">
                {service.id === 'oneMentorship' && '60 mins'}
                {service.id === 'webinars' && '90 mins'}
                {service.id === 'resumeAnalysis' && '45 mins'}
                {service.id === 'gdGroupDiscussions' && '60 mins'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">What's Included</h3>
            <ul className="space-y-3">
              {service.id === 'oneMentorship' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">One-on-one guidance with industry expert</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Personalized career strategy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Real-time Q&A and feedback</span>
                  </li>
                </>
              )}
              {service.id === 'webinars' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Live interactive training session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Q&A with industry professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Recording available after session</span>
                  </li>
                </>
              )}
              {service.id === 'resumeAnalysis' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Comprehensive resume review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Industry-specific optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Actionable feedback & tips</span>
                  </li>
                </>
              )}
              {service.id === 'gdGroupDiscussions' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Group discussion practice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Expert evaluation & feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="text-zinc-300">Peer learning environment</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button className="flex-1 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-100 transition transform hover:scale-105">
              Book Now
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition border border-white/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
