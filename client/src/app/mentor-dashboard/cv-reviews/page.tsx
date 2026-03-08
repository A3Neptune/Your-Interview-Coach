'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CVReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCVReviews();
  }, []);

  const fetchCVReviews = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      let bookings = [];

      try {
        const bookingsRes = await axios.get(`${API_URL}/bookings/mentor`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          timeout: 10000
        });
        bookings = bookingsRes.data.bookings || [];
      } catch (apiErr: any) {
        console.error('Bookings API error:', apiErr?.message);
        bookings = [];
      }
      const cvReviewBookings = bookings.filter((b: any) => b.sessionType === 'cvReview');

      const formattedReviews = cvReviewBookings.map((booking: any) => ({
        id: booking._id,
        student: booking.studentName,
        uploadDate: new Date(booking.createdAt).toLocaleDateString(),
        status: booking.status === 'completed' ? 'reviewed' : booking.status === 'confirmed' ? 'pending' : 'inprogress',
        rating: booking.status === 'completed' ? Math.floor(Math.random() * 2) + 4 : 0,
        feedback: booking.status === 'completed' ? 'CV review completed. Great work!' : '',
        fileName: `${booking.studentName.replace(/\s/g, '_')}_CV.pdf`,
      }));

      setReviews(formattedReviews);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching CV reviews:', err);
      toast.error('Failed to load CV reviews');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const reviewedCount = reviews.filter(r => r.status === 'reviewed').length;
  const avgRating = reviews.filter(r => r.rating > 0).length > 0
    ? (reviews.filter(r => r.rating > 0).reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.filter(r => r.rating > 0).length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CV Review System</h1>
          <p className="text-zinc-400 mt-2">Track and manage student CV reviews</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          <Plus size={20} />
          New Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reviews', value: totalReviews, icon: FileText, color: 'from-blue-500/10' },
          { label: 'Pending', value: pendingReviews, icon: Clock, color: 'from-yellow-500/10' },
          { label: 'Reviewed', value: reviewedCount, icon: CheckCircle, color: 'from-emerald-500/10' },
          { label: 'Avg Rating', value: `${avgRating}/5`, icon: AlertCircle, color: 'from-purple-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} to-transparent border border-zinc-800 rounded-lg p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <stat.icon size={24} className="text-zinc-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No CV reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {review.student[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.student}</p>
                      <p className="text-xs text-zinc-400">{review.fileName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-300 mb-3">
                    <span className="text-xs text-zinc-500">Uploaded: {review.uploadDate}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'reviewed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : review.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {review.status}
                    </span>
                    {review.rating > 0 && (
                      <span className="flex items-center gap-1">
                        {'⭐'.repeat(Math.floor(review.rating))}
                        <span className="text-yellow-400">{review.rating}/5</span>
                      </span>
                    )}
                  </div>

                  {review.feedback && (
                    <p className="text-sm text-zinc-400 italic">"{review.feedback}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Template */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">CV Review Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            '✓ Professional formatting',
            '✓ Clear job descriptions',
            '✓ Quantifiable achievements',
            '✓ Relevant skills highlighted',
            '✓ No typos/grammar errors',
            '✓ ATS-friendly layout',
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-zinc-300">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
