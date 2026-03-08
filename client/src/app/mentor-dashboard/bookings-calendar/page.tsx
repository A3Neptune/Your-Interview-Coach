'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function MeetingsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
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
      const formattedMeetings = bookings.map((booking: any) => ({
        id: booking._id,
        title: `${booking.sessionType} - ${booking.studentName}`,
        time: new Date(booking.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        duration: `${booking.duration || 60} min`,
        student: booking.studentName,
        status: booking.status,
        date: new Date(booking.scheduledDate).toISOString().split('T')[0],
      }));

      setMeetings(formattedMeetings);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      toast.error('Failed to load meetings');
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = renderCalendar();
  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Meetings Calendar</h1>
          <p className="text-zinc-400 mt-2">View and manage your scheduled sessions</p>
        </div>
        <div className="flex gap-2">
          {['month', 'week', 'list'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as 'month' | 'week' | 'list')}
              className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                view === v
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Month View */}
      {view === 'month' && (
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 rounded-lg hover:bg-zinc-700 transition"
            >
              <ChevronLeft size={24} className="text-zinc-400 hover:text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 rounded-lg hover:bg-zinc-700 transition"
            >
              <ChevronRight size={24} className="text-zinc-400 hover:text-white" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-zinc-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-2 rounded-lg border transition ${
                  day === null
                    ? 'bg-transparent border-transparent'
                    : isToday(day)
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <p className={`text-sm font-semibold ${isToday(day) ? 'text-white' : 'text-zinc-300'}`}>
                      {day}
                    </p>
                    <div className="flex-1 flex items-end">
                      {meetings
                        .filter(m => m.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
                        .slice(0, 2)
                        .map((m, i) => (
                          <div key={i} className="w-full h-1 bg-emerald-500 rounded-full mt-1"></div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">No meetings scheduled</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.id} className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{meeting.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        {meeting.time} • {meeting.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-purple-400" />
                        {meeting.student}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      meeting.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {meeting.status}
                    </span>
                    <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition opacity-0 group-hover:opacity-100">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Upcoming Meetings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Confirmed</p>
          <p className="text-3xl font-bold text-emerald-400">{meetings.filter(m => m.status === 'confirmed').length}</p>
          <p className="text-xs text-zinc-400 mt-2">meetings this week</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">{meetings.filter(m => m.status === 'pending').length}</p>
          <p className="text-xs text-zinc-400 mt-2">awaiting confirmation</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Total Duration</p>
          <p className="text-3xl font-bold text-blue-400">{(meetings.length * 60 / 60).toFixed(1)} hrs</p>
          <p className="text-xs text-zinc-400 mt-2">this week</p>
        </div>
      </div>
    </div>
  );
}
