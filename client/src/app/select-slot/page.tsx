'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, ChevronRight, Check, Loader2, Sunrise, Sun, Sunset, ChevronLeft, CheckCircle2, CalendarCheck } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Booking {
  scheduledDate: string;
  duration: number;
}

function SelectSlotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [service, setService] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [hoveredTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  const serviceId = searchParams.get('serviceId');

  // Auto-scroll to time selection when date is selected
  useEffect(() => {
    if (selectedDate && timeSelectionRef.current) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!serviceId) {
      toast.error('No service selected');
      router.push('/');
      return;
    }
    fetchServiceAndAvailability();
  }, [serviceId]);

  const fetchServiceAndAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push(`/login?redirect=/select-slot?serviceId=${serviceId}`);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Fetch service
      const pricingRes = await axios.get(`${API_URL}/pricing-section/public`);
      const selectedService = pricingRes.data.services.find((s: any) => s.id === serviceId);

      if (!selectedService) {
        toast.error('Service not found');
        router.push('/');
        return;
      }

      setService(selectedService);

      // Fetch mentor info
      try {
        const mentorRes = await axios.get(`${API_URL}/bookings/mentors`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const mentorData = mentorRes.data.mentors[0];
        if (mentorData) {
          setMentor(mentorData);
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
      }

      // Get booked slots (all services share the same mentor's calendar)
      try {
        const availabilityRes = await axios.get(`${API_URL}/bookings/public/availability`);
        const fetchedBookedSlots = availabilityRes.data.bookedSlots.map((slot: any) => ({
          scheduledDate: slot.start,
          duration: Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000),
        }));
        console.log('Fetched booked slots:', fetchedBookedSlots);
        setBookedSlots(fetchedBookedSlots);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load availability');
      setIsLoading(false);
    }
  };

  const getDiscountedPrice = () => {
    if (!service) return 0;

    if (!service.discount?.isActive || service.discount.type === 'none') {
      return service.price;
    }

    let discount = 0;
    if (service.discount.type === 'percentage') {
      discount = (service.price * service.discount.value) / 100;
    } else {
      discount = service.discount.value;
    }

    return Math.max(0, service.price - discount);
  };

  const getDiscountAmount = () => {
    if (!service?.discount?.isActive || service.discount.type === 'none') {
      return 0;
    }

    if (service.discount.type === 'percentage') {
      return Math.round((service.price * service.discount.value) / 100);
    }
    return service.discount.value;
  };

  // Helper to format date as YYYY-MM-DD without timezone issues
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDayStatus = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDateLocal(date);
    const today = formatDateLocal(new Date());
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = formatDateLocal(maxDate);

    // Check if date is past
    if (dateStr < today) return 'past';

    // Check if date is beyond 30-day window
    if (dateStr > maxDateStr) return 'past';

    // If selected date, show as selected
    if (dateStr === selectedDate) return 'selected';

    // If today, show as today
    if (dateStr === today) return 'today';

    // By default, all future dates within 30 days are available
    // (A few bookings don't make entire day unavailable - multiple slots per day)
    return 'available';
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate >= new Date()) setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (newDate <= maxDate) setCurrentMonth(newDate);
  };

  const isSlotAvailable = (date: string, time: string) => {
    // Create slot start and end times in local timezone
    const slotStart = new Date(`${date}T${time}:00`);
    const slotDuration = 60; // Fixed 1-hour slots
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

    // Check if this slot overlaps with any booked slot
    const hasConflict = bookedSlots.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

      // Two time ranges overlap if: start1 < end2 AND end1 > start2
      const overlaps = slotStart < bookingEnd && slotEnd > bookingStart;

      // Debug logging (remove in production)
      if (overlaps) {
        console.log(`Slot ${time} blocked by booking:`, {
          slotStart: slotStart.toISOString(),
          slotEnd: slotEnd.toISOString(),
          bookingStart: bookingStart.toISOString(),
          bookingEnd: bookingEnd.toISOString(),
        });
      }

      return overlaps;
    });

    return !hasConflict;
  };

  const isSlotBooked = (date: string, time: string) => {
    // Create slot start and end times in local timezone
    const slotStart = new Date(`${date}T${time}:00`);
    const slotDuration = 60; // Fixed 1-hour slots
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

    return bookedSlots.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  };

  // Generate 1-hour time slots (fixed duration)
  const getTimeSlots = () => {
    const slots: { start: string; end: string; display: string }[] = [];
    if (!selectedDate) return slots;

    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

      // Format display: "9 AM - 10 AM"
      const formatHour = (hr: number) => {
        const period = hr >= 12 ? 'PM' : 'AM';
        const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
        return `${displayHr} ${period}`;
      };

      const display = `${formatHour(hour)} - ${formatHour(hour + 1)}`;
      slots.push({ start: startTime, end: endTime, display });
    }

    return slots;
  };

  const getAvailableTimes = () => {
    const times: string[] = [];
    if (!selectedDate) return times;

    const slots = getTimeSlots();
    for (const slot of slots) {
      if (isSlotAvailable(selectedDate, slot.start)) {
        times.push(slot.start);
      }
    }
    return times;
  };

  const getAllTimes = () => {
    const times: string[] = [];
    if (!selectedDate) return times;

    const slots = getTimeSlots();
    for (const slot of slots) {
      times.push(slot.start);
    }
    return times;
  };

  // Get slot display text for a given start time
  const getSlotDisplay = (startTime: string) => {
    const slots = getTimeSlots();
    const slot = slots.find(s => s.start === startTime);
    return slot?.display || startTime;
  };

  const getTimeStatus = (date: string, time: string) => {
    const available = isSlotAvailable(date, time);
    const booked = isSlotBooked(date, time);

    if (booked) return 'booked';
    if (available) return 'available';
    return 'unavailable';
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    const slotData = encodeURIComponent(JSON.stringify({
      date: selectedDate,
      time: selectedTime,
      duration: 60, // Fixed 1-hour slots
    }));

    router.push(`/checkout?serviceId=${serviceId}&slot=${slotData}`);
  };

  const availableTimes = getAvailableTimes();
  const allTimes = getAllTimes();

  // Format selected date/time with slot range
  const getFormattedDateTime = () => {
    if (!selectedDate || !selectedTime) return '';

    // Use noon to avoid timezone date-shift issues
    const date = new Date(`${selectedDate}T12:00:00`);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const slotDisplay = getSlotDisplay(selectedTime);
    return `${dateStr}, ${slotDisplay}`;
  };

  const formattedDateTime = getFormattedDateTime();

  // Helper to group times by period (show all times with status)
  const groupTimesByPeriod = (times: string[]) => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    times.forEach(time => {
      const hour = parseInt(time.split(':')[0]);
      if (hour < 12) {
        morning.push(time);
      } else if (hour < 17) {
        afternoon.push(time);
      } else {
        evening.push(time);
      }
    });

    return [
      { label: 'Morning', icon: Sunrise, times: morning, color: 'from-amber-500/20 to-orange-500/20' },
      { label: 'Afternoon', icon: Sun, times: afternoon, color: 'from-yellow-500/20 to-amber-500/20' },
      { label: 'Evening', icon: Sunset, times: evening, color: 'from-orange-500/20 to-red-500/20' },
    ].filter(group => group.times.length > 0);
  };

  const timeGroups = groupTimesByPeriod(allTimes);

  // Get total available slots for selected date
  const getTotalAvailableSlots = () => {
    if (!selectedDate) return 0;
    return availableTimes.length;
  };

  const totalAvailableSlots = getTotalAvailableSlots();

  // Quick date helpers - show next 5 available days
  const getQuickDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateLocal(date);

      let label = '';
      if (i === 1) {
        label = 'Tomorrow';
      } else {
        label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      }

      dates.push({ label, date: dateStr });
    }

    return dates;
  };

  const quickDates = getQuickDates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const slotVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-blue-600 transition mb-4 flex items-center gap-2 text-sm font-medium group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} className="group-hover:text-blue-600 transition" />
            <span>Back to services</span>
          </motion.button>

          <motion.div className="mb-6" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <motion.h1
                className="text-3xl md:text-4xl font-black text-slate-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Book Your Session
              </motion.h1>
            </div>
            <motion.p
              className="text-slate-500 text-base md:text-lg ml-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Pick a date and time that works best for you
            </motion.p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div className="flex items-center gap-2 mb-6 p-3 bg-white rounded-2xl border-2 border-blue-100 shadow-sm" variants={itemVariants}>
            {/* Step 1 */}
            <motion.div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${selectedDate ? 'bg-green-50' : 'bg-blue-50'}`}
              animate={selectedDate ? { scale: [1, 1.02, 1] } : {}}
            >
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedDate ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
                animate={selectedDate ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedDate ? <Check size={14} strokeWidth={3} /> : '1'}
              </motion.div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${selectedDate ? 'text-green-700' : 'text-blue-700'}`}>
                  {selectedDate ? 'Date Selected' : 'Select Date'}
                </span>
                {selectedDate && (
                  <span className="text-[10px] text-green-600">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </div>
            </motion.div>

            {/* Connector */}
            <div className="flex-1 flex items-center px-2">
              <motion.div
                className={`h-1 rounded-full transition-all ${selectedDate ? 'bg-green-400' : 'bg-slate-200'}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, delay: selectedDate ? 0.2 : 0 }}
              />
            </div>

            {/* Step 2 */}
            <motion.div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${selectedTime ? 'bg-green-50' : selectedDate ? 'bg-blue-50' : 'bg-slate-50'}`}
              animate={selectedTime ? { scale: [1, 1.02, 1] } : {}}
            >
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedTime ? 'bg-green-500 text-white' : selectedDate ? 'bg-blue-500 text-white' : 'bg-slate-300 text-white'}`}
                animate={selectedTime ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedTime ? <Check size={14} strokeWidth={3} /> : '2'}
              </motion.div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${selectedTime ? 'text-green-700' : selectedDate ? 'text-blue-700' : 'text-slate-400'}`}>
                  {selectedTime ? 'Time Selected' : 'Select Time'}
                </span>
                {selectedTime && (
                  <span className="text-[10px] text-green-600">{getSlotDisplay(selectedTime)}</span>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Date Selection */}
          <motion.div className="mt-4" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-slate-700">Quick pick a date:</span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickDates.map((qd, idx) => (
                <motion.button
                  key={qd.date}
                  onClick={() => { setSelectedDate(qd.date); setSelectedTime(''); }}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${selectedDate === qd.date
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-white border-2 border-blue-200 text-slate-700 hover:border-blue-400 hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {qd.label}
                  {selectedDate === qd.date && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check size={10} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Service & Mentor Info */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <motion.div
              className="sticky top-8 bg-white border-2 border-blue-200 rounded-3xl p-6 space-y-6"
              whileHover={{ borderColor: 'rgba(59, 130, 246, 0.6)' }}
            >
              {/* Service Info Card */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 border-2 border-blue-200"
                whileHover={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}
              >
                <motion.h2 className="text-lg font-bold text-slate-900 mb-1" variants={itemVariants}>
                  {service.name}
                </motion.h2>
                <motion.p className="text-slate-600 text-xs mb-3" variants={itemVariants}>
                  {service.title}
                </motion.p>

                <div className="space-y-3 bg-white rounded-lg p-3 border-2 border-blue-200">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600">Duration:</span>
                    <span className="text-slate-900 font-medium">{service.duration}</span>
                  </div>

                  {/* Price with Discount Display */}
                  {service.discount?.isActive && service.discount.type !== 'none' ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 line-through text-sm">₹{service.price}</span>
                        <span className="text-2xl font-bold text-blue-600">₹{Math.round(getDiscountedPrice())}</span>
                        <span className="text-slate-600 text-xs">/session</span>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded px-2 py-1">
                        <p className="text-blue-600 font-semibold text-xs">
                          {service.discount.type === 'percentage'
                            ? `Save ₹${getDiscountAmount()} (${service.discount.value}% OFF)`
                            : `Save ₹${getDiscountAmount()}`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">₹{service.price}</span>
                      <span className="text-slate-600 text-xs">/session</span>
                    </div>
                  )}
                </div>

                {/* What's Included */}
                {service.points && service.points.length > 0 && (
                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-xs text-slate-600 font-semibold mb-2">What's Included:</p>
                    <div className="space-y-1.5">
                      {service.points.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Mentor Info */}
              {mentor && (
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">Your Mentor</p>
                  <div className="flex items-center gap-3">
                    {mentor.profileImage ? (
                      <img
                        src={mentor.profileImage}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-blue-200">
                        <span className="text-xs font-bold text-white">
                          {mentor.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'M'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{mentor.name}</p>
                      <p className="text-xs text-slate-600 truncate">{mentor.designation || 'Expert Mentor'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Time Display */}
              {formattedDateTime && (
                <motion.div
                  className="pt-4 border-t border-blue-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xs text-slate-600 uppercase tracking-wide mb-2 font-medium">Selected Time</p>
                  <p className="text-sm font-semibold text-slate-900">{formattedDateTime}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Calendar & Time Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date Selection */}
            <motion.div
              className="bg-white border-2 border-blue-200 rounded-3xl p-6"
              variants={itemVariants}
              whileHover={{ borderColor: 'rgba(59, 130, 246, 0.6)' }}
            >
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Select Date
              </h3>

              {/* Custom Calendar */}
              <motion.div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-4" variants={itemVariants}>
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <motion.button onClick={handlePrevMonth} className="p-1 hover:bg-blue-50 rounded" whileHover={{ scale: 1.1 }}>
                    <ChevronLeft size={20} className="text-slate-600" />
                  </motion.button>
                  <div className="text-center flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <motion.button onClick={handleNextMonth} className="p-1 hover:bg-blue-50 rounded" whileHover={{ scale: 1.1 }}>
                    <ChevronRight size={20} className="text-slate-600" />
                  </motion.button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const dateStr = formatDateLocal(date);
                    const status = getDayStatus(day);

                    return (
                      <motion.button
                        key={day}
                        onClick={() => { if (status === 'available' || status === 'today' || status === 'selected') { setSelectedDate(dateStr); setSelectedTime(''); } }}
                        disabled={status === 'past'}
                        className={`h-10 rounded-lg font-medium text-sm transition-all ${status === 'past' ? 'bg-slate-50 text-slate-400 opacity-40 cursor-not-allowed border border-slate-200' :
                            status === 'today' ? 'bg-blue-50 text-blue-600 border-2 border-blue-400 hover:border-blue-500' :
                              status === 'selected' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold border-2 border-blue-700' :
                                status === 'available' ? 'bg-white text-slate-900 border-2 border-blue-200 hover:border-blue-400 cursor-pointer' :
                                  'bg-white text-slate-900 border-2 border-blue-200'
                          }`}
                        whileHover={status === 'available' || status === 'today' ? { scale: 1.05, y: -1 } : {}}
                        whileTap={status === 'available' || status === 'today' ? { scale: 0.95 } : {}}
                      >
                        {day}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Availability Summary */}
            {selectedDate && (
              <motion.div
                ref={timeSelectionRef}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
                      <CalendarCheck size={22} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">Selected date for your session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black ${totalAvailableSlots > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {totalAvailableSlots}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">of 9 slots free</p>
                  </div>
                </div>
                {/* Availability Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${totalAvailableSlots >= 7 ? 'bg-green-500' : totalAvailableSlots >= 4 ? 'bg-yellow-500' : totalAvailableSlots > 0 ? 'bg-orange-500' : 'bg-red-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalAvailableSlots / 9) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                  <span>{9 - totalAvailableSlots} booked</span>
                  <span>{totalAvailableSlots} available</span>
                </div>
              </motion.div>
            )}

            {/* Time Selection */}
            {selectedDate && (
              <motion.div
                className="bg-white border-2 border-blue-200 rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                variants={itemVariants}
                whileHover={{ borderColor: 'rgba(59, 130, 246, 0.6)' }}
              >
                <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Select Time
                </h3>

                {selectedDate ? (
                  <motion.div className="space-y-6">
                    {timeGroups.map((group, groupIdx) => {
                      const IconComponent = group.icon;
                      const groupTimes = group.times;
                      const availableInGroup = groupTimes.filter(t => getTimeStatus(selectedDate, t) === 'available').length;

                      return (
                        <motion.div
                          key={group.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: groupIdx * 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-blue-50 border-2 border-blue-200">
                              <IconComponent size={16} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{group.label}</span>
                            <span className={`text-xs ml-auto px-2 py-1 rounded-full ${availableInGroup > 0 ? 'bg-green-100 text-green-700 font-semibold' : 'bg-slate-100 text-slate-500'}`}>
                              {availableInGroup > 0 ? `${availableInGroup} slot${availableInGroup > 1 ? 's' : ''} available` : 'No slots'}
                            </span>
                          </div>
                          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {groupTimes.map((time, idx) => {
                              const status = getTimeStatus(selectedDate, time);
                              const isSelected = selectedTime === time;
                              const isHovered = hoveredTime === time;

                              return (
                                <motion.button
                                  key={time}
                                  onClick={() => {
                                    if (status === 'available') {
                                      setSelectedTime(time);
                                    } else if (status === 'booked') {
                                      toast.error('This slot is already booked');
                                    }
                                  }}
                                  disabled={status !== 'available'}
                                  className={`relative px-2 py-3 rounded-lg font-medium text-xs transition-all duration-200 min-h-[48px] flex items-center justify-center cursor-pointer ${isSelected
                                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-700'
                                      : status === 'available'
                                        ? isHovered
                                          ? 'bg-blue-50 text-blue-600 border-2 border-blue-400'
                                          : 'bg-white text-slate-900 border-2 border-blue-200 hover:border-blue-400'
                                        : status === 'booked'
                                          ? 'bg-slate-50 text-slate-500 border-2 border-slate-200 opacity-60 cursor-not-allowed'
                                          : 'bg-slate-50 text-slate-400 border-2 border-slate-200 opacity-40 cursor-not-allowed'
                                    }`}
                                  variants={slotVariants}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ delay: groupIdx * 0.1 + idx * 0.03 }}
                                  whileHover={status === 'available' ? { y: -1 } : {}}
                                  whileTap={status === 'available' ? { scale: 0.97 } : {}}
                                >
                                  <span className="text-center leading-tight">{getSlotDisplay(time)}</span>
                                  {status === 'booked' && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-500 bg-slate-50/90 rounded-lg"
                                    >
                                      BOOKED
                                    </motion.div>
                                  )}
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    >
                                      <Check size={14} className="absolute top-1 right-1" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-12 text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm">Select a date to see available times</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="sticky bottom-4 flex gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-100 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={() => router.back()}
                className="px-6 py-3.5 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft size={18} />
                Back
              </motion.button>
              <motion.button
                onClick={handleProceed}
                disabled={!selectedDate || !selectedTime}
                className={`flex-1 px-6 py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-200 hover:shadow-lg'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                whileHover={selectedDate && selectedTime ? { scale: 1.02, y: -2 } : {}}
                whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
              >
                {selectedDate && selectedTime ? (
                  <>
                    Proceed to Payment
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Select Date & Time
                    <ChevronRight size={20} className="opacity-50" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SelectSlotPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50"><Loader2 className="w-8 h-8 text-slate-400 animate-spin" /></div>}>
      <SelectSlotContent />
    </Suspense>
  );
}




// 'use client';
//
// import { useEffect, useState, Suspense, useRef } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import {
//   Calendar, Clock, ChevronRight, Check, Loader2,
//   Sunrise, Sun, Sunset, ChevronLeft, CheckCircle2,
//   CalendarCheck, Sparkles, ArrowRight, Star
// } from 'lucide-react';
// import { motion, Variants, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import axios from 'axios';
//
// interface Booking {
//   scheduledDate: string;
//   duration: number;
// }
//
// function SelectSlotContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [service, setService] = useState<any>(null);
//   const [mentor, setMentor] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string>('');
//   const [selectedTime, setSelectedTime] = useState<string>('');
//   const [hoveredTime] = useState<string>('');
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
//   const timeSelectionRef = useRef<HTMLDivElement>(null);
//
//   const serviceId = searchParams.get('serviceId');
//
//   useEffect(() => {
//     if (selectedDate && timeSelectionRef.current) {
//       setTimeout(() => {
//         timeSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }, 300);
//     }
//   }, [selectedDate]);
//
//   useEffect(() => {
//     if (!serviceId) {
//       toast.error('No service selected');
//       router.push('/');
//       return;
//     }
//     fetchServiceAndAvailability();
//   }, [serviceId]);
//
//   const fetchServiceAndAvailability = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         router.push(`/login?redirect=/select-slot?serviceId=${serviceId}`);
//         return;
//       }
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const pricingRes = await axios.get(`${API_URL}/pricing-section/public`);
//       const selectedService = pricingRes.data.services.find((s: any) => s.id === serviceId);
//       if (!selectedService) { toast.error('Service not found'); router.push('/'); return; }
//       setService(selectedService);
//       try {
//         const mentorRes = await axios.get(`${API_URL}/bookings/mentors`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
//         const mentorData = mentorRes.data.mentors[0];
//         if (mentorData) setMentor(mentorData);
//       } catch (error) { console.error('Error fetching mentor:', error); }
//       try {
//         const availabilityRes = await axios.get(`${API_URL}/bookings/public/availability`);
//         const fetchedBookedSlots = availabilityRes.data.bookedSlots.map((slot: any) => ({
//           scheduledDate: slot.start,
//           duration: Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000),
//         }));
//         setBookedSlots(fetchedBookedSlots);
//       } catch (error) { setBookedSlots([]); }
//       setIsLoading(false);
//     } catch (error) {
//       toast.error('Failed to load availability');
//       setIsLoading(false);
//     }
//   };
//
//   const getDiscountedPrice = () => {
//     if (!service) return 0;
//     if (!service.discount?.isActive || service.discount.type === 'none') return service.price;
//     let discount = service.discount.type === 'percentage' ? (service.price * service.discount.value) / 100 : service.discount.value;
//     return Math.max(0, service.price - discount);
//   };
//
//   const getDiscountAmount = () => {
//     if (!service?.discount?.isActive || service.discount.type === 'none') return 0;
//     return service.discount.type === 'percentage' ? Math.round((service.price * service.discount.value) / 100) : service.discount.value;
//   };
//
//   const formatDateLocal = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };
//
//   const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//
//   const getDayStatus = (day: number) => {
//     const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//     const dateStr = formatDateLocal(date);
//     const today = formatDateLocal(new Date());
//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + 30);
//     const maxDateStr = formatDateLocal(maxDate);
//     if (dateStr < today) return 'past';
//     if (dateStr > maxDateStr) return 'past';
//     if (dateStr === selectedDate) return 'selected';
//     if (dateStr === today) return 'today';
//     return 'available';
//   };
//
//   const handlePrevMonth = () => {
//     const newDate = new Date(currentMonth);
//     newDate.setMonth(newDate.getMonth() - 1);
//     if (newDate >= new Date()) setCurrentMonth(newDate);
//   };
//
//   const handleNextMonth = () => {
//     const newDate = new Date(currentMonth);
//     newDate.setMonth(newDate.getMonth() + 1);
//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + 30);
//     if (newDate <= maxDate) setCurrentMonth(newDate);
//   };
//
//   const isSlotAvailable = (date: string, time: string) => {
//     const slotStart = new Date(`${date}T${time}:00`);
//     const slotEnd = new Date(slotStart.getTime() + 60 * 60000);
//     return !bookedSlots.some(booking => {
//       const bookingStart = new Date(booking.scheduledDate);
//       const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
//       return slotStart < bookingEnd && slotEnd > bookingStart;
//     });
//   };
//
//   const isSlotBooked = (date: string, time: string) => {
//     const slotStart = new Date(`${date}T${time}:00`);
//     const slotEnd = new Date(slotStart.getTime() + 60 * 60000);
//     return bookedSlots.some(booking => {
//       const bookingStart = new Date(booking.scheduledDate);
//       const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
//       return slotStart < bookingEnd && slotEnd > bookingStart;
//     });
//   };
//
//   const getTimeSlots = () => {
//     if (!selectedDate) return [];
//     const slots: { start: string; end: string; display: string }[] = [];
//     for (let hour = 9; hour < 18; hour++) {
//       const startTime = `${String(hour).padStart(2, '0')}:00`;
//       const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
//       const formatHour = (hr: number) => {
//         const period = hr >= 12 ? 'PM' : 'AM';
//         const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
//         return `${displayHr} ${period}`;
//       };
//       slots.push({ start: startTime, end: endTime, display: `${formatHour(hour)} – ${formatHour(hour + 1)}` });
//     }
//     return slots;
//   };
//
//   const getAvailableTimes = () => {
//     if (!selectedDate) return [];
//     return getTimeSlots().filter(slot => isSlotAvailable(selectedDate, slot.start)).map(s => s.start);
//   };
//
//   const getAllTimes = () => {
//     if (!selectedDate) return [];
//     return getTimeSlots().map(s => s.start);
//   };
//
//   const getSlotDisplay = (startTime: string) => {
//     const slot = getTimeSlots().find(s => s.start === startTime);
//     return slot?.display || startTime;
//   };
//
//   const getTimeStatus = (date: string, time: string) => {
//     if (isSlotBooked(date, time)) return 'booked';
//     if (isSlotAvailable(date, time)) return 'available';
//     return 'unavailable';
//   };
//
//   const handleProceed = () => {
//     if (!selectedDate || !selectedTime) { toast.error('Please select both date and time'); return; }
//     const slotData = encodeURIComponent(JSON.stringify({ date: selectedDate, time: selectedTime, duration: 60 }));
//     router.push(`/checkout?serviceId=${serviceId}&slot=${slotData}`);
//   };
//
//   const availableTimes = getAvailableTimes();
//   const allTimes = getAllTimes();
//
//   const getFormattedDateTime = () => {
//     if (!selectedDate || !selectedTime) return '';
//     const date = new Date(`${selectedDate}T12:00:00`);
//     const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
//     return `${dateStr}, ${getSlotDisplay(selectedTime)}`;
//   };
//
//   const formattedDateTime = getFormattedDateTime();
//
//   const groupTimesByPeriod = (times: string[]) => {
//     const morning: string[] = [], afternoon: string[] = [], evening: string[] = [];
//     times.forEach(time => {
//       const hour = parseInt(time.split(':')[0]);
//       if (hour < 12) morning.push(time);
//       else if (hour < 17) afternoon.push(time);
//       else evening.push(time);
//     });
//     return [
//       { label: 'Morning', icon: Sunrise, times: morning, gradient: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
//       { label: 'Afternoon', icon: Sun, times: afternoon, gradient: 'from-yellow-400 to-amber-400', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
//       { label: 'Evening', icon: Sunset, times: evening, gradient: 'from-orange-400 to-red-400', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
//     ].filter(g => g.times.length > 0);
//   };
//
//   const timeGroups = groupTimesByPeriod(allTimes);
//   const totalAvailableSlots = availableTimes.length;
//
//   const getQuickDates = () => {
//     const today = new Date();
//     return Array.from({ length: 5 }, (_, i) => {
//       const date = new Date(today);
//       date.setDate(date.getDate() + i + 1);
//       return {
//         label: i === 0 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
//         date: formatDateLocal(date),
//         dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
//         dayNum: date.getDate(),
//       };
//     });
//   };
//
//   const quickDates = getQuickDates();
//
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//         <div className="text-center">
//           <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
//             <Loader2 className="w-8 h-8 text-white animate-spin" />
//           </div>
//           <p className="text-slate-500 text-sm font-medium">Loading your session...</p>
//         </div>
//       </div>
//     );
//   }
//
//   if (!service) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h1>
//           <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">Go Home</button>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen bg-[#f0f4ff]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
//       {/* Top decorative bar */}
//       <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600" />
//
//       <div className="max-w-6xl mx-auto px-4 py-8">
//
//         {/* ── HEADER ── */}
//         <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
//           <motion.button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium group"
//             whileHover={{ x: -3 }}
//           >
//             <span className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
//               <ChevronLeft size={14} />
//             </span>
//             Back to services
//           </motion.button>
//
//           <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
//                   <Sparkles size={11} /> Book a Session
//                 </span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
//                 Choose Your <span className="text-blue-600">Date & Time</span>
//               </h1>
//               <p className="text-slate-500 mt-1 text-base">Pick a slot that fits perfectly into your schedule</p>
//             </div>
//
//             {/* Progress pills */}
//             <div className="flex items-center gap-2 shrink-0">
//               <motion.div
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedDate ? 'bg-green-500 border-green-500 text-white' : 'bg-blue-600 border-blue-600 text-white'}`}
//                 animate={selectedDate ? { scale: [1, 1.05, 1] } : {}}
//               >
//                 {selectedDate ? <Check size={12} strokeWidth={3} /> : <span className="w-4 h-4 rounded-full border-2 border-white/60 flex items-center justify-center text-[10px]">1</span>}
//                 Date
//               </motion.div>
//               <div className={`w-8 h-0.5 rounded-full transition-all ${selectedDate ? 'bg-green-400' : 'bg-slate-300'}`} />
//               <motion.div
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedTime ? 'bg-green-500 border-green-500 text-white' : selectedDate ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
//                 animate={selectedTime ? { scale: [1, 1.05, 1] } : {}}
//               >
//                 {selectedTime ? <Check size={12} strokeWidth={3} /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">2</span>}
//                 Time
//               </motion.div>
//               <div className={`w-8 h-0.5 rounded-full transition-all ${selectedTime ? 'bg-green-400' : 'bg-slate-300'}`} />
//               <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedDate && selectedTime ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
//                 <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">3</span>
//                 Pay
//               </div>
//             </div>
//           </div>
//         </motion.div>
//
//         {/* ── MAIN GRID ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
//
//           {/* ── LEFT SIDEBAR ── */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="space-y-4"
//           >
//             {/* Service card */}
//             <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-blue-100">
//               {/* Card header band */}
//               <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h2 className="text-lg font-black text-slate-900 leading-tight">{service.name}</h2>
//                     <p className="text-slate-500 text-sm mt-0.5">{service.title}</p>
//                   </div>
//                   <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
//                     <Star size={16} className="text-white fill-white" />
//                   </div>
//                 </div>
//
//                 {/* Duration chip */}
//                 <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 mb-4">
//                   <Clock size={12} /> {service.duration}
//                 </div>
//
//                 {/* Price */}
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
//                   {service.discount?.isActive && service.discount.type !== 'none' ? (
//                     <div>
//                       <div className="flex items-baseline gap-2 mb-1">
//                         <span className="text-3xl font-black text-blue-600">₹{Math.round(getDiscountedPrice())}</span>
//                         <span className="text-slate-400 line-through text-sm">₹{service.price}</span>
//                       </div>
//                       <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
//                         {service.discount.type === 'percentage' ? `${service.discount.value}% OFF` : `₹${getDiscountAmount()} OFF`}
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="flex items-baseline gap-1">
//                       <span className="text-3xl font-black text-slate-900">₹{service.price}</span>
//                       <span className="text-slate-400 text-sm">/session</span>
//                     </div>
//                   )}
//                 </div>
//
//                 {/* Includes */}
//                 {service.points?.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-slate-100">
//                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">What's Included</p>
//                     <ul className="space-y-2">
//                       {service.points.map((point: string, idx: number) => (
//                         <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
//                           <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
//                             <Check size={11} className="text-blue-600" strokeWidth={3} />
//                           </div>
//                           {point}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//
//             {/* Mentor card */}
//             {mentor && (
//               <div className="bg-white rounded-3xl p-5 shadow-sm border border-blue-100">
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Mentor</p>
//                 <div className="flex items-center gap-3">
//                   {mentor.profileImage ? (
//                     <img src={mentor.profileImage} alt={mentor.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-100 shadow-sm" />
//                   ) : (
//                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-blue-100 shadow-sm shrink-0">
//                       <span className="text-sm font-black text-white">{mentor.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'M'}</span>
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-bold text-slate-900">{mentor.name}</p>
//                     <p className="text-xs text-slate-500">{mentor.designation || 'Expert Mentor'}</p>
//                     <div className="flex items-center gap-0.5 mt-1">
//                       {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//
//             {/* Selected slot summary */}
//             <AnimatePresence>
//               {formattedDateTime && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200"
//                 >
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//                       <CalendarCheck size={16} />
//                     </div>
//                     <span className="text-xs font-bold uppercase tracking-widest opacity-80">Your Selection</span>
//                   </div>
//                   <p className="font-black text-base leading-snug">{formattedDateTime}</p>
//                   <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
//                     <CheckCircle2 size={14} className="opacity-80" />
//                     <span className="text-xs opacity-80">1 hour session confirmed</span>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//
//           {/* ── RIGHT COLUMN ── */}
//           <div className="space-y-5">
//
//             {/* Quick date chips */}
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: 0.15 }}
//               className="bg-white rounded-3xl p-5 shadow-sm border border-blue-100"
//             >
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
//                   <Sparkles size={13} className="text-white" />
//                 </div>
//                 <span className="font-bold text-slate-900 text-sm">Quick Select</span>
//                 <span className="text-xs text-slate-400 ml-auto">Next 5 days</span>
//               </div>
//               <div className="grid grid-cols-5 gap-2">
//                 {quickDates.map((qd, idx) => (
//                   <motion.button
//                     key={qd.date}
//                     onClick={() => { setSelectedDate(qd.date); setSelectedTime(''); }}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.04 }}
//                     whileHover={{ y: -2 }}
//                     whileTap={{ scale: 0.96 }}
//                     className={`relative flex flex-col items-center py-3 px-2 rounded-2xl border-2 font-semibold text-xs transition-all ${
//                       selectedDate === qd.date
//                         ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
//                         : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
//                     }`}
//                   >
//                     <span className={`text-[10px] font-bold uppercase mb-1 ${selectedDate === qd.date ? 'opacity-80' : 'text-slate-400'}`}>{qd.dayName}</span>
//                     <span className="text-lg font-black">{qd.dayNum}</span>
//                     {selectedDate === qd.date && (
//                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
//                         <Check size={10} className="text-white" strokeWidth={3} />
//                       </motion.div>
//                     )}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//
//             {/* Calendar */}
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: 0.2 }}
//               className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden"
//             >
//               {/* Calendar header */}
//               <div className="p-5 pb-0">
//                 <div className="flex items-center justify-between mb-5">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//                       <Calendar size={15} className="text-white" />
//                     </div>
//                     <span className="font-bold text-slate-900">
//                       {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <motion.button onClick={handlePrevMonth} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
//                       <ChevronLeft size={16} />
//                     </motion.button>
//                     <motion.button onClick={handleNextMonth} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
//                       <ChevronRight size={16} />
//                     </motion.button>
//                   </div>
//                 </div>
//
//                 {/* Weekday headers */}
//                 <div className="grid grid-cols-7 gap-1 mb-2">
//                   {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
//                     <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
//                   ))}
//                 </div>
//               </div>
//
//               {/* Days grid */}
//               <div className="px-5 pb-5">
//                 <div className="grid grid-cols-7 gap-1">
//                   {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => <div key={`e-${i}`} />)}
//                   {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
//                     const day = i + 1;
//                     const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//                     const dateStr = formatDateLocal(date);
//                     const status = getDayStatus(day);
//                     const isWeekend = date.getDay() === 0 || date.getDay() === 6;
//
//                     return (
//                       <motion.button
//                         key={day}
//                         onClick={() => { if (status !== 'past') { setSelectedDate(dateStr); setSelectedTime(''); } }}
//                         disabled={status === 'past'}
//                         whileHover={status !== 'past' ? { scale: 1.1 } : {}}
//                         whileTap={status !== 'past' ? { scale: 0.95 } : {}}
//                         className={`relative h-10 w-full rounded-xl font-semibold text-sm transition-all duration-200 ${
//                           status === 'past'
//                             ? 'text-slate-300 cursor-not-allowed'
//                             : status === 'selected'
//                             ? 'bg-blue-600 text-white shadow-md shadow-blue-200 font-black'
//                             : status === 'today'
//                             ? 'bg-blue-50 text-blue-600 border-2 border-blue-400 font-bold'
//                             : isWeekend
//                             ? 'text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
//                             : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
//                         }`}
//                       >
//                         {day}
//                         {status === 'today' && status !== 'selected' && (
//                           <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
//                         )}
//                       </motion.button>
//                     );
//                   })}
//                 </div>
//
//                 {/* Legend */}
//                 <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
//                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
//                     <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Selected
//                   </div>
//                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
//                     <span className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-50 inline-block" /> Today
//                   </div>
//                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
//                     <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Unavailable
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//
//             {/* Availability summary */}
//             <AnimatePresence>
//               {selectedDate && (
//                 <motion.div
//                   ref={timeSelectionRef}
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-white rounded-3xl p-5 shadow-sm border border-blue-100"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200">
//                         <CalendarCheck size={18} className="text-white" />
//                       </div>
//                       <div>
//                         <p className="font-bold text-slate-900">
//                           {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//                         </p>
//                         <p className="text-xs text-slate-500">Availability overview</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className={`text-4xl font-black tabular-nums ${totalAvailableSlots > 0 ? 'text-green-500' : 'text-red-400'}`}>{totalAvailableSlots}</p>
//                       <p className="text-xs text-slate-400 font-medium">of 9 free</p>
//                     </div>
//                   </div>
//                   {/* Progress bar */}
//                   <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
//                     <motion.div
//                       className={`h-full rounded-full ${totalAvailableSlots >= 7 ? 'bg-green-500' : totalAvailableSlots >= 4 ? 'bg-yellow-500' : totalAvailableSlots > 0 ? 'bg-orange-400' : 'bg-red-400'}`}
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(totalAvailableSlots / 9) * 100}%` }}
//                       transition={{ duration: 0.6, ease: 'easeOut' }}
//                     />
//                   </div>
//                   <div className="flex justify-between mt-1.5 text-[11px] font-medium text-slate-400">
//                     <span>{9 - totalAvailableSlots} booked</span>
//                     <span>{totalAvailableSlots} available</span>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//
//             {/* Time slots */}
//             <AnimatePresence>
//               {selectedDate && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 16 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden"
//                 >
//                   <div className="p-5 pb-4 border-b border-slate-100">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//                         <Clock size={15} className="text-white" />
//                       </div>
//                       <span className="font-bold text-slate-900">Select a Time Slot</span>
//                       <span className="text-xs text-slate-400 ml-auto">All times in your local timezone</span>
//                     </div>
//                   </div>
//
//                   <div className="p-5 space-y-6">
//                     {timeGroups.map((group, groupIdx) => {
//                       const IconComponent = group.icon;
//                       const availableInGroup = group.times.filter(t => getTimeStatus(selectedDate, t) === 'available').length;
//                       return (
//                         <motion.div
//                           key={group.label}
//                           initial={{ opacity: 0, y: 8 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: groupIdx * 0.08 }}
//                         >
//                           {/* Group header */}
//                           <div className="flex items-center gap-2.5 mb-3">
//                             <div className={`w-8 h-8 rounded-xl ${group.bg} border ${group.border} flex items-center justify-center`}>
//                               <IconComponent size={15} className={group.text} />
//                             </div>
//                             <span className="text-sm font-bold text-slate-700">{group.label}</span>
//                             <div className={`ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold ${availableInGroup > 0 ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-400'}`}>
//                               {availableInGroup > 0 ? `${availableInGroup} open` : 'Full'}
//                             </div>
//                           </div>
//
//                           {/* Slot buttons */}
//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                             {group.times.map((time, idx) => {
//                               const status = getTimeStatus(selectedDate, time);
//                               const isSelected = selectedTime === time;
//                               const isAvailable = status === 'available';
//                               const isBooked = status === 'booked';
//
//                               return (
//                                 <motion.button
//                                   key={time}
//                                   onClick={() => {
//                                     if (isAvailable) setSelectedTime(time);
//                                     else if (isBooked) toast.error('This slot is already booked');
//                                   }}
//                                   disabled={!isAvailable}
//                                   initial={{ opacity: 0, scale: 0.92 }}
//                                   animate={{ opacity: 1, scale: 1 }}
//                                   transition={{ delay: groupIdx * 0.08 + idx * 0.03 }}
//                                   whileHover={isAvailable ? { y: -2, scale: 1.02 } : {}}
//                                   whileTap={isAvailable ? { scale: 0.97 } : {}}
//                                   className={`relative px-3 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 border-2 text-center ${
//                                     isSelected
//                                       ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
//                                       : isAvailable
//                                       ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
//                                       : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
//                                   }`}
//                                 >
//                                   {getSlotDisplay(time)}
//                                   {isBooked && (
//                                     <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-50/90">
//                                       <span className="text-[10px] font-black text-slate-400 tracking-widest">BOOKED</span>
//                                     </div>
//                                   )}
//                                   {isSelected && (
//                                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
//                                       <Check size={10} className="text-white" strokeWidth={3} />
//                                     </motion.div>
//                                   )}
//                                 </motion.button>
//                               );
//                             })}
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//
//             {/* ── ACTION BAR ── */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="sticky bottom-4 z-10"
//             >
//               <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/50 p-3 flex items-center gap-3">
//                 <motion.button
//                   onClick={() => router.back()}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="px-5 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
//                 >
//                   <ChevronLeft size={16} /> Back
//                 </motion.button>
//
//                 <motion.button
//                   onClick={handleProceed}
//                   disabled={!selectedDate || !selectedTime}
//                   whileHover={selectedDate && selectedTime ? { scale: 1.02, y: -1 } : {}}
//                   whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
//                   className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 ${
//                     selectedDate && selectedTime
//                       ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-300 hover:shadow-xl hover:shadow-blue-300/60'
//                       : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   {selectedDate && selectedTime ? (
//                     <>
//                       Proceed to Payment
//                       <motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
//                         <ArrowRight size={18} />
//                       </motion.div>
//                     </>
//                   ) : (
//                     <>Select a Date & Time <ArrowRight size={18} className="opacity-40" /></>
//                   )}
//                 </motion.button>
//               </div>
//
//               {/* Helper hint */}
//               <AnimatePresence>
//                 {selectedDate && !selectedTime && (
//                   <motion.p
//                     initial={{ opacity: 0, y: 4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="text-center text-xs text-slate-400 mt-2 font-medium"
//                   >
//                     ↑ Now pick a time slot above to continue
//                   </motion.p>
//                 )}
//                 {!selectedDate && (
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-center text-xs text-slate-400 mt-2 font-medium"
//                   >
//                     Select a date to see available time slots
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// export default function SelectSlotPage() {
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//         <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//           <Loader2 className="w-7 h-7 text-white animate-spin" />
//         </div>
//       </div>
//     }>
//       <SelectSlotContent />
//     </Suspense>
//   );
// }