"use client";

import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronRight,
  Check,
  Loader2,
  Sunrise,
  Sun,
  Sunset,
  ChevronLeft,
  CheckCircle2,

} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { toast } from 'sonner';
import axios from "axios";

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
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [daysOff, setDaysOff] = useState<number[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [hoveredTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  const serviceId = searchParams.get("serviceId");

  // Auto-scroll to time selection when date is selected
  useEffect(() => {
    if (selectedDate && timeSelectionRef.current) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
    if (selectedDate) {
      setAvailableSlots([]);
      setSlotsLoading(true);
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlotsForDate = async (date: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${API_URL}/bookings/public/slots?date=${date}`);
      if (res.data.success) {
        setAvailableSlots(res.data.slots || []);
        if (res.data.slotDuration) setSlotDuration(res.data.slotDuration);
      }
    } catch {
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (!serviceId) {
      toast.error("No service selected");
      router.push("/");
      return;
    }
    fetchServiceAndAvailability();
  }, [serviceId]);

  const fetchServiceAndAvailability = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push(`/login?redirect=/select-slot?serviceId=${serviceId}`);
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Fetch all three in parallel — cuts load time from ~450ms to ~150ms
      const [pricingRes, mentorRes, availabilityRes] = await Promise.allSettled([
        axios.get(`${API_URL}/pricing-section/public`),
        axios.get(`${API_URL}/bookings/mentors`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${API_URL}/bookings/public/availability`),
      ]);

      if (pricingRes.status === "fulfilled") {
        const selectedService = pricingRes.value.data.services.find(
          (s: any) => s.id === serviceId,
        );
        if (!selectedService) {
          toast.error("Service not found");
          router.push("/");
          return;
        }
        setService(selectedService);
      } else {
        toast.error("Failed to load availability");
        setIsLoading(false);
        return;
      }

      if (mentorRes.status === "fulfilled") {
        const mentorData = mentorRes.value.data.mentors[0];
        if (mentorData) setMentor(mentorData);
      }

      if (availabilityRes.status === "fulfilled") {
        const fetchedBookedSlots = availabilityRes.value.data.bookedSlots.map(
          (slot: any) => ({
            scheduledDate: slot.start,
            duration: Math.round(
              (new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000,
            ),
          }),
        );
        setBookedSlots(fetchedBookedSlots);
      } else {
        setBookedSlots([]);
      }

      // Fetch mentor availability settings for daysOff info
      try {
        const settingsRes = await axios.get(`${API_URL}/bookings/public/availability`);
        // daysOff is stored on the mentor; fetch it via the mentor endpoint
        if (mentorRes.status === "fulfilled") {
          const mentorData = mentorRes.value.data.mentors[0];
          if (mentorData?.availabilitySettings?.daysOff) setDaysOff(mentorData.availabilitySettings.daysOff);
          if (mentorData?.availabilitySettings?.slotDuration) setSlotDuration(mentorData.availabilitySettings.slotDuration);
          if (mentorData?.availabilitySettings?.blockedDates) setBlockedDates(mentorData.availabilitySettings.blockedDates);
        }
      } catch { /* non-critical */ }

      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load availability");
      setIsLoading(false);
    }
  };

  const getDiscountedPrice = () => {
    if (!service) return 0;

    if (!service.discount?.isActive || service.discount.type === "none") {
      return service.price;
    }

    let discount = 0;
    if (service.discount.type === "percentage") {
      discount = (service.price * service.discount.value) / 100;
    } else {
      discount = service.discount.value;
    }

    return Math.max(0, service.price - discount);
  };

  const getDiscountAmount = () => {
    if (!service?.discount?.isActive || service.discount.type === "none") {
      return 0;
    }

    if (service.discount.type === "percentage") {
      return Math.round((service.price * service.discount.value) / 100);
    }
    return service.discount.value;
  };

  // Helper to format date as YYYY-MM-DD without timezone issues
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDayStatus = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const dateStr = formatDateLocal(date);
    const today = formatDateLocal(new Date());
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = formatDateLocal(maxDate);

    // Check if date is past
    if (dateStr < today) return "past";

    // Check if date is beyond 30-day window
    if (dateStr > maxDateStr) return "past";

    // Check if day is marked as off by mentor
    if (daysOff.includes(date.getDay())) return "past";

    // Check if this specific date is blocked
    if (blockedDates.includes(dateStr)) return "past";

    // If selected date, show as selected
    if (dateStr === selectedDate) return "selected";

    // If today, show as today
    if (dateStr === today) return "today";

    // By default, all future dates within 30 days are available
    // (A few bookings don't make entire day unavailable - multiple slots per day)
    return "available";
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

  const isSlotAvailable = (_date: string, time: string) => {
    return availableSlots.some(s => s.start === time);
  };

  const isSlotBooked = (_date: string, time: string) => {
    // A slot not in availableSlots but in the original booked range
    const slotStart = new Date(`${_date}T${time}:00`);
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
    return bookedSlots.some((booking) => {
      const bStart = new Date(booking.scheduledDate);
      const bEnd = new Date(bStart.getTime() + booking.duration * 60000);
      return slotStart < bEnd && slotEnd > bStart;
    });
  };

  const getTimeSlots = () => {
    return availableSlots.map(s => {
      const [sh, sm] = s.start.split(':').map(Number);
      const [eh, em] = s.end.split(':').map(Number);
      const fmt = (h: number, m: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return m === 0 ? `${dh} ${period}` : `${dh}:${String(m).padStart(2,'0')} ${period}`;
      };
      return { start: s.start, end: s.end, display: `${fmt(sh, sm)} - ${fmt(eh, em)}` };
    });
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
    const slot = slots.find((s) => s.start === startTime);
    return slot?.display || startTime;
  };

  const getTimeStatus = (date: string, time: string) => {
    const available = isSlotAvailable(date, time);
    const booked = isSlotBooked(date, time);

    if (booked) return "booked";
    if (available) return "available";
    return "unavailable";
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    const slotData = encodeURIComponent(
      JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        duration: slotDuration,
      }),
    );

    router.push(`/checkout?serviceId=${serviceId}&slot=${slotData}`);
  };

  const allTimes = useMemo(() => getAllTimes(), [selectedDate, availableSlots]);

  // Format selected date/time with slot range
  const formattedDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const date = new Date(`${selectedDate}T12:00:00`);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    return { date: dateStr, time: getSlotDisplay(selectedTime) };
  }, [selectedDate, selectedTime]);

  // Helper to group times by period (show all times with status)
  const groupTimesByPeriod = (times: string[]) => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    times.forEach((time) => {
      const hour = parseInt(time.split(":")[0]);
      if (hour < 12) {
        morning.push(time);
      } else if (hour < 17) {
        afternoon.push(time);
      } else {
        evening.push(time);
      }
    });

    return [
      {
        label: "Morning",
        icon: Sunrise,
        times: morning,
        color: "from-amber-500/20 to-orange-500/20",
      },
      {
        label: "Afternoon",
        icon: Sun,
        times: afternoon,
        color: "from-yellow-500/20 to-amber-500/20",
      },
      {
        label: "Evening",
        icon: Sunset,
        times: evening,
        color: "from-orange-500/20 to-red-500/20",
      },
    ].filter((group) => group.times.length > 0);
  };

  const timeGroups = useMemo(() => groupTimesByPeriod(allTimes), [allTimes, availableSlots]);


  // Quick date helpers - show next 5 available days
  const getQuickDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateLocal(date);

      let label = "";
      if (i === 1) {
        label = "Tomorrow";
      } else {
        label = date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        });
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
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Service Not Found
          </h1>
          <button
            onClick={() => router.push("/")}
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
        ease: "easeOut",
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
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="text-slate-500 hover:text-blue-600 transition mb-4 flex items-center gap-2 text-sm font-medium group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft
              size={18}
              className="group-hover:text-blue-600 transition"
            />
            <span>Back to dashboard</span>
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
              key={!selectedDate ? "step1" : !selectedTime ? "step2" : "done"}
            >
              {!selectedDate
                ? "Step 1 of 2 — Pick a date that works for you"
                : !selectedTime
                  ? "Step 2 of 2 — Now choose a time slot"
                  : "All set! Review your booking and proceed"}
            </motion.p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="flex items-center gap-2 mb-6 p-3 bg-white rounded-2xl border-2 border-blue-100 shadow-sm"
            variants={itemVariants}
          >
            {/* Step 1 */}
            <motion.div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${selectedDate ? "bg-green-50" : "bg-blue-50"}`}
              animate={selectedDate ? { scale: [1, 1.02, 1] } : {}}
            >
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedDate ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
                animate={selectedDate ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedDate ? <Check size={14} strokeWidth={3} /> : "1"}
              </motion.div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-bold ${selectedDate ? "text-green-700" : "text-blue-700"}`}
                >
                  {selectedDate ? "Date Selected" : "Select Date"}
                </span>
                {selectedDate && (
                  <span className="text-[10px] text-green-600">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Connector */}
            <div className="flex-1 flex items-center px-2">
              <motion.div
                className={`h-1 rounded-full transition-all ${selectedDate ? "bg-green-400" : "bg-slate-200"}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: selectedDate ? 0.2 : 0 }}
              />
            </div>

            {/* Step 2 */}
            <motion.div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${selectedTime ? "bg-green-50" : selectedDate ? "bg-blue-50" : "bg-slate-50"}`}
              animate={selectedTime ? { scale: [1, 1.02, 1] } : {}}
            >
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${selectedTime ? "bg-green-500 text-white" : selectedDate ? "bg-blue-500 text-white" : "bg-slate-300 text-white"}`}
                animate={selectedTime ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedTime ? <Check size={14} strokeWidth={3} /> : "2"}
              </motion.div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-bold ${selectedTime ? "text-green-700" : selectedDate ? "text-blue-700" : "text-slate-400"}`}
                >
                  {selectedTime ? "Time Selected" : "Select Time"}
                </span>
                {selectedTime && (
                  <span className="text-[10px] text-green-600">
                    {getSlotDisplay(selectedTime)}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Date Selection */}
          <motion.div className="mt-4" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Quick pick a date:
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickDates.map((qd, idx) => (
                <motion.button
                  key={qd.date}
                  onClick={() => {
                    if (selectedDate === qd.date) {
                      setSelectedDate("");
                      setSelectedTime("");
                    } else {
                      setSelectedDate(qd.date);
                      setSelectedTime("");
                    }
                  }}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    selectedDate === qd.date
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md ring-2 ring-blue-300"
                      : "bg-white border-2 border-blue-200 text-slate-700 hover:border-blue-400 hover:shadow-md"
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
              whileHover={{ borderColor: "rgba(59, 130, 246, 0.6)" }}
            >
              {/* Service Info Card */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 border-2 border-blue-200"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
              >
                <motion.h2
                  className="text-lg font-bold text-slate-900 mb-1"
                  variants={itemVariants}
                >
                  {service.name}
                </motion.h2>
                <motion.p
                  className="text-slate-600 text-xs mb-3"
                  variants={itemVariants}
                >
                  {service.title}
                </motion.p>

                <div className="space-y-3 bg-white rounded-lg p-3 border-2 border-blue-200">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600">Duration:</span>
                    <span className="text-slate-900 font-medium">
                      {service.duration}
                    </span>
                  </div>

                  {/* Price with Discount Display */}
                  {service.discount?.isActive &&
                  service.discount.type !== "none" ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 line-through text-sm">
                          ₹{service.price}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{Math.round(getDiscountedPrice())}
                        </span>
                        <span className="text-slate-600 text-xs">/session</span>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded px-2 py-1">
                        <p className="text-blue-600 font-semibold text-xs">
                          {service.discount.type === "percentage"
                            ? `Save ₹${getDiscountAmount()} (${service.discount.value}% OFF)`
                            : `Save ₹${getDiscountAmount()}`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{service.price}
                      </span>
                      <span className="text-slate-600 text-xs">/session</span>
                    </div>
                  )}
                </div>

                {/* What's Included */}
                {service.points && service.points.length > 0 && (
                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-xs text-slate-600 font-semibold mb-2">
                      What's Included:
                    </p>
                    <div className="space-y-1.5">
                      {service.points.map((point: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-blue-600 flex-shrink-0 mt-0.5"
                          />
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
                  <p className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">
                    Your Mentor
                  </p>
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
                          {mentor.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "M"}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {mentor.name}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {mentor.designation || "Expert Mentor"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking summary — appears only when both date + time chosen */}
              {formattedDateTime && (
                <motion.div
                  className="pt-4 border-t border-blue-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={15} className="text-green-600" strokeWidth={3} />
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Booking Summary</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Session</span>
                        <span className="font-semibold text-right max-w-[120px] truncate">{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date & Time</span>
                        <span className="font-semibold text-right flex flex-col items-end">
                          <span>{formattedDateTime!.date}</span>
                          <span className="whitespace-nowrap text-blue-600">{formattedDateTime!.time}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-semibold">{slotDuration} min</span>
                      </div>
                      <div className="pt-2 mt-1 border-t border-green-200 flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Total</span>
                        <span className="font-bold text-blue-600">
                          ₹{Math.round(getDiscountedPrice() * 1.18)}
                          <span className="text-[10px] font-normal text-slate-500 ml-1">(incl. GST)</span>
                        </span>
                      </div>
                    </div>
                  </div>
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
              whileHover={{ borderColor: "rgba(59, 130, 246, 0.6)" }}
            >
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Select Date
              </h3>

              {/* Custom Calendar */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-4"
                variants={itemVariants}
              >
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-blue-50 rounded"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronLeft size={20} className="text-slate-600" />
                  </motion.button>
                  <div className="text-center flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <motion.button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-blue-50 rounded"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronRight size={20} className="text-slate-600" />
                  </motion.button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-slate-600 py-1"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} />
                    ),
                  )}
                  {Array.from({ length: getDaysInMonth(currentMonth) }).map(
                    (_, i) => {
                      const day = i + 1;
                      const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day,
                      );
                      const dateStr = formatDateLocal(date);
                      const status = getDayStatus(day);

                      return (
                        <motion.button
                          key={day}
                          onClick={() => {
                            if (
                              status === "available" ||
                              status === "today" ||
                              status === "selected"
                            ) {
                              if (selectedDate === dateStr) {
                                setSelectedDate("");
                                setSelectedTime("");
                              } else {
                                setSelectedDate(dateStr);
                                setSelectedTime("");
                              }
                            }
                          }}
                          disabled={status === "past"}
                          className={`h-10 rounded-lg font-medium text-sm transition-all ${
                            status === "past"
                              ? "bg-slate-50 text-slate-400 opacity-40 cursor-not-allowed border border-slate-200"
                              : status === "today"
                                ? "bg-blue-50 text-blue-600 border-2 border-blue-400 hover:border-blue-500"
                                : status === "selected"
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold border-2 border-blue-700"
                                  : status === "available"
                                    ? "bg-white text-slate-900 border-2 border-blue-200 hover:border-blue-400 cursor-pointer"
                                    : "bg-white text-slate-900 border-2 border-blue-200"
                          }`}
                          whileHover={
                            status === "available" || status === "today"
                              ? { scale: 1.05, y: -1 }
                              : {}
                          }
                          whileTap={
                            status === "available" || status === "today"
                              ? { scale: 0.95 }
                              : {}
                          }
                        >
                          {day}
                        </motion.button>
                      );
                    },
                  )}
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
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.6)" }}
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
                      const availableInGroup = groupTimes.filter(
                        (t) => getTimeStatus(selectedDate, t) === "available",
                      ).length;

                      return (
                        <motion.div
                          key={group.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: groupIdx * 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-blue-50 border-2 border-blue-200">
                              <IconComponent
                                size={16}
                                className="text-blue-600"
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {group.label}
                            </span>
                            <span
                              className={`text-xs ml-auto px-2 py-1 rounded-full ${availableInGroup > 0 ? "bg-green-100 text-green-700 font-semibold" : "bg-slate-100 text-slate-500"}`}
                            >
                              {availableInGroup > 0
                                ? `${availableInGroup} slot${availableInGroup > 1 ? "s" : ""} available`
                                : "No slots"}
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
                                    if (status === "available") {
                                      setSelectedTime(prev => prev === time ? "" : time);
                                    } else if (status === "booked") {
                                      toast.error(
                                        "This slot is already booked",
                                      );
                                    }
                                  }}
                                  disabled={status !== "available"}
                                  className={`relative px-2 py-3 rounded-lg font-medium text-xs transition-all duration-200 min-h-[48px] flex items-center justify-center cursor-pointer ${
                                    isSelected
                                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-700"
                                      : status === "available"
                                        ? isHovered
                                          ? "bg-blue-50 text-blue-600 border-2 border-blue-400"
                                          : "bg-white text-slate-900 border-2 border-blue-200 hover:border-blue-400"
                                        : status === "booked"
                                          ? "bg-slate-50 text-slate-500 border-2 border-slate-200 opacity-60 cursor-not-allowed"
                                          : "bg-slate-50 text-slate-400 border-2 border-slate-200 opacity-40 cursor-not-allowed"
                                  }`}
                                  variants={slotVariants}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{
                                    delay: groupIdx * 0.1 + idx * 0.03,
                                  }}
                                  whileHover={
                                    status === "available" ? { y: -1 } : {}
                                  }
                                  whileTap={
                                    status === "available"
                                      ? { scale: 0.97 }
                                      : {}
                                  }
                                >
                                  <span className="text-center leading-tight">
                                    {getSlotDisplay(time)}
                                  </span>
                                  {status === "booked" && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-500 bg-slate-50/90 rounded-lg"
                                    >
                                      BOOKED
                                    </motion.div>
                                  )}
                                  {isSelected && (
                                    <>
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                      >
                                        <Check size={14} className="absolute top-1 right-1" />
                                      </motion.div>
                                      <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-blue-200 leading-none">tap to deselect</span>
                                    </>
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
                    <p className="text-sm">
                      Select a date to see available times
                    </p>
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
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3.5 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft size={18} />
                Back
              </motion.button>

              {selectedDate && selectedTime ? (
                <motion.button
                  onClick={handleProceed}
                  className="flex-1 px-6 py-3.5 font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex flex-col items-start leading-tight">
                    <span>Proceed to Payment</span>
                    <span className="text-xs font-normal text-blue-200">₹{Math.round(getDiscountedPrice() * 1.18)} incl. GST</span>
                  </span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </motion.button>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SelectSlotPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      }
    >
      <SelectSlotContent />
    </Suspense>
  );
}
