'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, User, DollarSign, CreditCard } from 'lucide-react';

interface Slot {
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

interface AvailabilityDay {
  day: number;
  slots: Slot[];
}

interface MentorRate {
  rates: {
    oneMentorship: number;
    webinars: number;
    resumeAnalysis: number;
    gdGroupDiscussions: number;
  };
  availability: AvailabilityDay[];
  timezone: string;
}

interface Booking {
  _id: string;
  studentId: string;
  mentorId: {
    _id: string;
    name: string;
    email: string;
    skills?: string[];
  };
  sessionType: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: string;
  amount?: number;
  paymentStatus?: string;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [mentorRates, setMentorRates] = useState<MentorRate | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.booking);

      // Fetch mentor rates
      if (response.data.booking?.mentorId) {
        const mentorId = typeof response.data.booking.mentorId === 'object'
          ? response.data.booking.mentorId._id
          : response.data.booking.mentorId;
        const ratesResponse = await api.get(`/mentor-rates/${mentorId}`);
        setMentorRates(ratesResponse.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load booking details');
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');

    if (mentorRates && date) {
      const selectedDateObj = new Date(date);
      const dayOfWeek = selectedDateObj.getDay();

      const dayAvailability = mentorRates.availability.find(a => a.day === dayOfWeek);
      if (dayAvailability) {
        setAvailableSlots(dayAvailability.slots);
      } else {
        setAvailableSlots([]);
        toast.info('No slots available on this day');
      }
    }
  };

  const getSessionRate = () => {
    if (!mentorRates || !booking) return 0;
    const rates = mentorRates.rates;
    const sessionType = booking.sessionType;

    switch (sessionType) {
      case 'oneMentorship':
        return rates.oneMentorship || 0;
      case 'resumeAnalysis':
        return rates.resumeAnalysis || 0;
      case 'gdGroupDiscussions':
        return rates.gdGroupDiscussions || 0;
      case 'webinars':
        return rates.webinars || 0;
      default:
        return booking.amount || 0;
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select a date and time slot');
      return;
    }

    setUpdating(true);
    try {
      const [startTime, endTime] = selectedSlot.split(' - ');
      const slotDate = new Date(selectedDate);
      const [startHour, startMin] = startTime.split(':');
      slotDate.setHours(parseInt(startHour), parseInt(startMin), 0);

      await api.put(`/api/bookings/bookings/${bookingId}`, {
        scheduledDate: slotDate.toISOString(),
        status: 'pending',
      });

      toast.success('Booking rescheduled successfully!');
      fetchBookingDetails();
      setSelectedDate('');
      setSelectedSlot('');
    } catch (error) {
      toast.error('Failed to reschedule booking');
    } finally {
      setUpdating(false);
    }
  };

  const handleProceedToPayment = () => {
    router.push(`/dashboard/bookings/${bookingId}/payment`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link href="/dashboard/bookings" className="text-blue-400 hover:underline">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const bookedDate = new Date(booking.scheduledDate);
  const sessionRate = getSessionRate();
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Link href="/dashboard/bookings" className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6">
        <ChevronLeft size={20} />
        Back to Bookings
      </Link>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Booking Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h1 className="text-3xl font-bold mb-4">{booking.title}</h1>
            <p className="text-gray-400 mb-6">{booking.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Mentor</p>
                  <p className="font-semibold">{booking.mentorId?.name || 'TBD'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Current Date & Time</p>
                  <p className="font-semibold">{bookedDate.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="font-semibold">{booking.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="font-semibold">₹{sessionRate}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-700">
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  booking.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                  booking.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                  booking.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

                {booking.paymentStatus !== 'completed' && booking.status !== 'cancelled' && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-900 text-orange-300">
                    Payment {booking.paymentStatus || 'Pending'}
                  </span>
                )}
              </div>

              {/* Payment Button */}
              {booking.paymentStatus !== 'completed' && booking.status !== 'cancelled' && sessionRate > 0 && (
                <button
                  onClick={handleProceedToPayment}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Proceed to Payment (₹{sessionRate})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reschedule Section */}
        <div className="md:col-span-3 lg:col-span-1">
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {selectedDate && availableSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Available Time Slots
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(`${slot.startTime} - ${slot.endTime}`)}
                          className={`w-full p-2 rounded-lg border text-left transition ${
                            selectedSlot === `${slot.startTime} - ${slot.endTime}`
                              ? 'bg-blue-600 border-blue-500'
                              : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                          }`}
                        >
                          <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && availableSlots.length === 0 && (
                  <p className="text-yellow-400 text-sm">No slots available on this day</p>
                )}

                <button
                  onClick={handleReschedule}
                  disabled={!selectedDate || !selectedSlot || updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition"
                >
                  {updating ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
