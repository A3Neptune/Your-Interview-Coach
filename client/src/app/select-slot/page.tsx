'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, ChevronRight, Check, Loader2, Sunrise, Sun, Sunset, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
  const [hoveredTime, setHoveredTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const serviceId = searchParams.get('serviceId');

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

      // Get booked slots
      try {
        const availabilityRes = await axios.get(`${API_URL}/bookings/public/availability`);
        const bookedSlots = availabilityRes.data.bookedSlots.map((slot: any) => ({
          scheduledDate: slot.start,
          duration: Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000),
        }));
        setBookedSlots(bookedSlots);
      } catch (error) {
        setBookedSlots([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load availability');
      setIsLoading(false);
    }
  };

  const getDurationInMinutes = () => {
    if (!service?.duration) return 60;
    // Handle both "60 mins" and just "60" formats
    const match = service.duration.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 60;
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

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDayStatus = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

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
    const selectedDateTime = new Date(`${date}T${time}`);
    const durationMinutes = getDurationInMinutes();
    const endTime = new Date(selectedDateTime.getTime() + durationMinutes * 60000);

    return !bookedSlots.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
      return selectedDateTime < bookingEnd && endTime > bookingStart;
    });
  };

  const isSlotBooked = (date: string, time: string) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const durationMinutes = getDurationInMinutes();
    const endTime = new Date(selectedDateTime.getTime() + durationMinutes * 60000);

    return bookedSlots.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
      return selectedDateTime < bookingEnd && endTime > bookingStart;
    });
  };

  const getAvailableTimes = () => {
    const times: string[] = [];
    if (!selectedDate) return times;

    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        if (isSlotAvailable(selectedDate, time)) {
          times.push(time);
        }
      }
    }
    return times;
  };

  const getAllTimes = () => {
    const times: string[] = [];
    if (!selectedDate) return times;

    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
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
      duration: getDurationInMinutes(),
    }));

    router.push(`/checkout?serviceId=${serviceId}&slot=${slotData}`);
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

  const availableTimes = getAvailableTimes();
  const allTimes = getAllTimes();
  const formattedDateTime = selectedDate && selectedTime
    ? new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';

  // Helper to get current month/year for calendar
  const getCurrentMonth = () => {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
    };
  };

  // Helper to get calendar days
  const getCalendarDays = () => {
    const { year, month } = getCurrentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

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
            className="text-slate-600 hover:text-blue-600 transition mb-6 flex items-center gap-1"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
          <motion.h1 className="text-4xl font-bold text-slate-900 mb-2" variants={itemVariants}>
            Select Your Slot
          </motion.h1>
          <motion.p className="text-slate-600 text-lg" variants={itemVariants}>
            Choose your preferred date and time for this session
          </motion.p>
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
                    const dateStr = date.toISOString().split('T')[0];
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
                            <span className="text-xs text-slate-600 ml-auto">{availableInGroup} available</span>
                          </div>
                          <motion.div className="grid grid-cols-4 md:grid-cols-5 gap-2">
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
                                  className={`relative px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-h-[44px] flex items-center justify-center cursor-pointer ${isSelected
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
                                  <span>{time}</span>
                                  {status === 'booked' && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-500"
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
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-white border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-slate-900 font-semibold rounded-xl transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                onClick={handleProceed}
                disabled={!selectedDate || !selectedTime}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition flex items-center justify-center gap-2 ${selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                whileHover={selectedDate && selectedTime ? { scale: 1.02 } : {}}
                whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
              >
                Proceed to Payment
                <ChevronRight size={20} />
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
