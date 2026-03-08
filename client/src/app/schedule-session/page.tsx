'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Booking {
  _id: string;
  scheduledDate: string;
  duration: number;
}

interface BookedSlot {
  start: string;
  end: string;
}

function ScheduleSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [bookedDates, setBookedDates] = useState<BookedSlot[]>([]);

  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      toast.error('No booking ID provided');
      router.push('/');
      return;
    }
    fetchBookingAndAvailability();
  }, [bookingId]);

  const fetchBookingAndAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Get booking details
      const bookingRes = await axios.get(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setBooking(bookingRes.data.booking);

      // Get mentor's booked slots
      const mentorId = bookingRes.data.booking.mentorId._id;
      const availabilityRes = await axios.get(
        `${API_URL}/bookings/mentors/${mentorId}/availability`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setBookedDates(availabilityRes.data.bookedSlots || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      setIsLoading(false);
    }
  };

  const isSlotAvailable = (date: string, time: string) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const endTime = new Date(selectedDateTime.getTime() + (booking?.duration || 60) * 60000);

    return !bookedDates.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return selectedDateTime < slotEnd && endTime > slotStart;
    });
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        if (selectedDate && isSlotAvailable(selectedDate, time)) {
          times.push(time);
        }
      }
    }
    return times;
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);

      await axios.put(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          status: 'pending',
          scheduledDate: scheduledDateTime.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success('Session scheduled successfully!');
      router.push(`/user-dashboard/bookings`);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Failed to schedule session');
    } finally {
      setIsSaving(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Booking Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const availableTimes = getAvailableTimes();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Payment Completed</p>
            </div>
          </div>
          <div className="flex-1 h-1 bg-zinc-800 mx-4"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-white font-semibold">Select Schedule</p>
            </div>
          </div>
        </div>

        {/* Booking Info Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{booking.title}</h2>
          <p className="text-zinc-400 mb-6">{booking.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-400" />
              <div>
                <p className="text-xs text-zinc-500">Duration</p>
                <p className="text-white font-semibold">{booking.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-purple-400" />
              <div>
                <p className="text-xs text-zinc-500">Mentor</p>
                <p className="text-white font-semibold">
                  {booking.mentorId.fullName || booking.mentorId.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Select Session Date</h3>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-3">
              Choose a Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-zinc-500 mt-2">Available: Next 30 days</p>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Choose a Time
              </label>
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <p className="text-zinc-400">No available slots on this date</p>
                  <p className="text-xs text-zinc-500 mt-2">Try selecting another date</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition"
          >
            Back
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime || isSaving}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            {isSaving ? 'Scheduling...' : (
              <>
                Schedule Session
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 The mentor will review and confirm your booking shortly. You'll receive an email notification once confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleSessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
      <ScheduleSessionContent />
    </Suspense>
  );
}
