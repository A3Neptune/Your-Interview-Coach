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
  Info,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

type DayStatus =
  | "past"
  | "future-limit"
  | "unavailable"
  | "selected"
  | "today"
  | "available"
  | "full";

// Module-level constants — never recreated on render
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const LEGEND_ITEMS: { label: string; className: string; textClass: string; fullBadge?: boolean }[] = [
  { label: "Today",        className: "bg-blue-50 ring-2 ring-blue-300",     textClass: "text-slate-500" },
  { label: "Available",    className: "bg-white border border-slate-200",    textClass: "text-slate-500" },
  { label: "Fully booked", className: "bg-slate-50 border border-slate-200", textClass: "text-slate-500", fullBadge: true },
];

const CELL_STYLES: Record<DayStatus, string> = {
  past:           "text-slate-200 cursor-default",
  "future-limit": "text-slate-200 cursor-default",
  unavailable:    "cursor-not-allowed bg-rose-50",
  full:           "cursor-not-allowed bg-slate-50",
  selected:       "bg-blue-600 text-white font-bold shadow-md shadow-blue-200 cursor-pointer",
  today:          "bg-blue-50 text-blue-600 font-bold ring-2 ring-blue-300 hover:bg-blue-100 cursor-pointer",
  available:      "text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium cursor-pointer",
};

const CONTAINER_VARIANTS = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const ITEM_VARIANTS = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function fmtDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function SelectSlotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [service, setService] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [daysOff, setDaysOff] = useState<number[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<Set<string>>(new Set());
  const [calendarReady, setCalendarReady] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    if (selectedDate && timeSelectionRef.current) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
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
        const slots = res.data.slots || [];
        setAvailableSlots(slots);
        if (res.data.slotDuration) setSlotDuration(res.data.slotDuration);
        if (slots.length === 0) {
          setFullyBookedDates((prev) => new Set(prev).add(date));
          // Auto-deselect so the calendar shows "Full" and the time panel closes
          setSelectedDate("");
          setSelectedTime("");
          toast.info("That date is fully booked — please pick another.");
        }
      }
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const prefetchMonthSlots = async (month: Date, offs: number[], blocked: string[]) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const today = new Date();
    const todayLocal = fmtDate(today);
    const maxD = new Date(today);
    maxD.setDate(maxD.getDate() + 30);
    const maxLocal = fmtDate(maxD);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

    const datesToCheck: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const dateStr = fmtDate(date);
      if (dateStr < todayLocal || dateStr > maxLocal) continue;
      if (offs.includes(date.getDay()) || blocked.includes(dateStr)) continue;
      datesToCheck.push(dateStr);
    }

    const results = await Promise.allSettled(
      datesToCheck.map((dateStr) =>
        axios.get(`${API_URL}/bookings/public/slots?date=${dateStr}`).then((r) => ({
          dateStr,
          slots: r.data.success ? (r.data.slots || []) : [],
        }))
      )
    );

    const newFull = new Set<string>();
    results.forEach((r) => {
      if (r.status === "fulfilled" && r.value.slots.length === 0) {
        newFull.add(r.value.dateStr);
      }
    });
    if (newFull.size > 0) {
      setFullyBookedDates((prev) => new Set([...prev, ...newFull]));
    }
    setCalendarReady(true);
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

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const [pricingRes, mentorRes] = await Promise.allSettled([
        axios.get(`${API_URL}/pricing-section/public`),
        axios.get(`${API_URL}/bookings/mentors`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
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
        if (mentorData) {
          setMentor(mentorData);
          if (mentorData?.availabilitySettings?.daysOff)
            setDaysOff(mentorData.availabilitySettings.daysOff);
          if (mentorData?.availabilitySettings?.slotDuration)
            setSlotDuration(mentorData.availabilitySettings.slotDuration);
          if (mentorData?.availabilitySettings?.blockedDates)
            setBlockedDates(mentorData.availabilitySettings.blockedDates);
        }
      }

      setIsLoading(false);

      // Pre-fetch slot counts for the current month so fully-booked dates show
      // their status without requiring the user to click first.
      const resolvedDaysOff =
        mentorRes.status === "fulfilled"
          ? mentorRes.value.data.mentors[0]?.availabilitySettings?.daysOff ?? []
          : [];
      const resolvedBlocked =
        mentorRes.status === "fulfilled"
          ? mentorRes.value.data.mentors[0]?.availabilitySettings?.blockedDates ?? []
          : [];
      prefetchMonthSlots(new Date(), resolvedDaysOff, resolvedBlocked);
    } catch {
      toast.error("Failed to load availability");
      setIsLoading(false);
    }
  };

  // Memoized — only recalculate when service changes
  const discountedPrice = useMemo(() => {
    if (!service) return 0;
    if (!service.discount?.isActive || service.discount.type === "none") return service.price;
    const discount =
      service.discount.type === "percentage"
        ? (service.price * service.discount.value) / 100
        : service.discount.value;
    return Math.max(0, service.price - discount);
  }, [service]);

  const discountAmount = useMemo(() => {
    if (!service?.discount?.isActive || service.discount.type === "none") return 0;
    if (service.discount.type === "percentage")
      return Math.round((service.price * service.discount.value) / 100);
    return service.discount.value;
  }, [service]);

  const formatDateDisplay = (dateStr: string) =>
    new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  // Memoized — recalculate once per day (component unmounts/remounts daily)
  const { todayStr, maxDateStr, maxDateDisplay } = useMemo(() => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    return {
      todayStr:       fmtDate(today),
      maxDateStr:     fmtDate(maxDate),
      maxDateDisplay: maxDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  }, []);

  // Memoized — only recalculate when currentMonth changes
  const { daysInMonth, firstDayOfMonth } = useMemo(() => ({
    daysInMonth:    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
    firstDayOfMonth: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
  }), [currentMonth]);

  const getDayStatus = (day: number): DayStatus => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = fmtDate(date);
    if (dateStr < todayStr) return "past";
    if (dateStr > maxDateStr) return "future-limit";
    if (daysOff.includes(date.getDay()) || blockedDates.includes(dateStr)) return "unavailable";
    if (fullyBookedDates.has(dateStr)) return "full";
    if (dateStr === selectedDate) return "selected";
    if (dateStr === todayStr) return "today";
    return "available";
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    const now = new Date();
    if (
      newDate.getFullYear() > now.getFullYear() ||
      (newDate.getFullYear() === now.getFullYear() && newDate.getMonth() >= now.getMonth())
    ) {
      setCalendarReady(false);
      setCurrentMonth(newDate);
      prefetchMonthSlots(newDate, daysOff, blockedDates);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    const navLimit = new Date();
    navLimit.setMonth(navLimit.getMonth() + 3);
    if (newDate <= navLimit) {
      setCalendarReady(false);
      setCurrentMonth(newDate);
      prefetchMonthSlots(newDate, daysOff, blockedDates);
    }
  };

  // Memoized — only recalculate when availableSlots changes
  const timeSlots = useMemo(() => {
    const fmt = (h: number, m: number) => {
      const p = h >= 12 ? "PM" : "AM";
      const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return m === 0 ? `${dh} ${p}` : `${dh}:${String(m).padStart(2, "0")} ${p}`;
    };
    return availableSlots.map((s) => {
      const [sh, sm] = s.start.split(":").map(Number);
      const [eh, em] = s.end.split(":").map(Number);
      return { start: s.start, end: s.end, display: `${fmt(sh, sm)} – ${fmt(eh, em)}` };
    });
  }, [availableSlots]);

  const getSlotDisplay = (startTime: string) => {
    const slot = timeSlots.find((s) => s.start === startTime);
    return slot?.display || startTime;
  };

  const allTimes = useMemo(() => timeSlots.map((s) => s.start), [timeSlots]);

  const formattedDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    return { date: formatDateDisplay(selectedDate), time: getSlotDisplay(selectedTime) };
  }, [selectedDate, selectedTime, timeSlots]);

  const groupTimesByPeriod = (times: string[]) => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    times.forEach((t) => {
      const h = parseInt(t.split(":")[0]);
      if (h < 12) morning.push(t);
      else if (h < 17) afternoon.push(t);
      else evening.push(t);
    });
    return [
      { label: "Morning", icon: Sunrise, times: morning },
      { label: "Afternoon", icon: Sun, times: afternoon },
      { label: "Evening", icon: Sunset, times: evening },
    ].filter((g) => g.times.length > 0);
  };

  const timeGroups = useMemo(() => groupTimesByPeriod(allTimes), [allTimes]);


  const getNoSlotsMessage = () => {
    if (!selectedDate) return null;
    const isToday = selectedDate === todayStr;
    if (isToday) {
      return {
        icon: "🌙",
        title: "All slots for today have passed",
        sub: "The mentor's available hours for today are over. Try booking for tomorrow or a later date.",
        cta: "Pick Tomorrow",
      };
    }
    return {
      icon: "📅",
      title: `No slots available on ${formatDateDisplay(selectedDate)}`,
      sub: "All time slots for this date are fully booked. Please choose a different date to continue.",
      cta: null,
    };
  };

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return fmtDate(d);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading booking details…</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h1>
          <p className="text-slate-500 mb-6 text-sm">
            We couldn't find the service you were looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const noSlotsMsg = getNoSlotsMessage();

  // ── Day cell renderer ──────────────────────────────────────────────────────
  const renderDayCell = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = fmtDate(date);
    const status = getDayStatus(day);
    const isClickable =
      status === "available" || status === "today" || status === "selected";

    return (
      <motion.button
        key={day}
        onClick={() => {
          if (!isClickable) return;
          if (selectedDate === dateStr) {
            setSelectedDate("");
            setSelectedTime("");
          } else {
            setSelectedDate(dateStr);
            setSelectedTime("");
          }
        }}
        disabled={!isClickable}
        className={`relative aspect-square rounded-xl text-sm transition-all flex items-center justify-center select-none ${CELL_STYLES[status]}`}
        whileHover={isClickable && status !== "selected" ? { scale: 1.08 } : {}}
        whileTap={isClickable ? { scale: 0.92 } : {}}
      >
        {/* Unavailable: strikethrough number */}
        {status === "unavailable" && (
          <span className="relative flex items-center justify-center w-full h-full">
            <span className="text-rose-300 text-sm font-medium">{day}</span>
            {/* diagonal line */}
            <span
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden
            >
              <svg width="100%" height="100%" viewBox="0 0 32 32" className="absolute inset-0">
                <line
                  x1="6"
                  y1="26"
                  x2="26"
                  y2="6"
                  stroke="#fca5a5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        )}

        {/* Fully booked: number + "Full" badge */}
        {status === "full" && (
          <span className="flex flex-col items-center justify-center leading-none gap-0.5 w-full h-full">
            <span className="text-slate-400 text-sm font-medium">{day}</span>
            <span className="text-[8px] font-bold text-red-400 uppercase tracking-wide leading-none">
              Full
            </span>
          </span>
        )}

        {/* Today: number + dot */}
        {status === "today" && (
          <span className="flex flex-col items-center leading-none gap-0.5">
            <span>{day}</span>
            <span className="w-1 h-1 rounded-full bg-blue-500" />
          </span>
        )}

        {/* Default: just the number */}
        {status !== "unavailable" &&
          status !== "full" &&
          status !== "today" && <span>{day}</span>}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white py-8 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap");
      `}</style>
      <div className="max-w-5xl mx-auto">
        {/* ── Back + Header ─────────────────────────────────────────────────── */}
        <motion.div className="mb-8" variants={CONTAINER_VARIANTS} initial="hidden" animate="visible">
          <motion.button
            onClick={() => router.push("/dashboard")}
            className="text-slate-500 hover:text-blue-600 transition mb-5 flex items-center gap-1.5 text-sm font-medium group"
            variants={ITEM_VARIANTS}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft size={17} className="group-hover:text-blue-600 transition" />
            Back to dashboard
          </motion.button>

          <motion.div
            className="flex items-start justify-between flex-wrap gap-4 mb-6"
            variants={ITEM_VARIANTS}
          >
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar size={22} className="text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Book Your Session</h1>
              </div>
              <p className="text-slate-500 text-sm ml-[52px]">
                {!selectedDate
                  ? "Step 1 of 2 — Pick a date that works for you"
                  : !selectedTime
                    ? "Step 2 of 2 — Now choose a time slot"
                    : "✅ All set! Review your selection and proceed to payment"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium self-start mt-1">
              <Info size={13} className="shrink-0" />
              <span>
                Book up to <strong>30 days</strong> ahead · until {maxDateDisplay}
              </span>
            </div>
          </motion.div>

          {/* ── Progress Steps ─────────────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-3 mb-6 px-4 py-3 bg-white rounded-2xl border border-blue-100 shadow-sm"
            variants={ITEM_VARIANTS}
          >
            <div
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl flex-1 transition-all ${selectedDate ? "bg-green-50" : "bg-blue-50"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selectedDate ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
              >
                {selectedDate ? <Check size={13} strokeWidth={3} /> : "1"}
              </div>
              <div>
                <p
                  className={`text-xs font-bold leading-none mb-0.5 ${selectedDate ? "text-green-700" : "text-blue-700"}`}
                >
                  {selectedDate ? "Date Selected" : "Select Date"}
                </p>
                {selectedDate && (
                  <p className="text-[11px] text-green-600 leading-none">
                    {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            <ChevronRight size={15} className="text-slate-300 shrink-0" />

            <div
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl flex-1 transition-all ${selectedTime ? "bg-green-50" : selectedDate ? "bg-blue-50" : "bg-slate-50"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selectedTime ? "bg-green-500 text-white" : selectedDate ? "bg-blue-500 text-white" : "bg-slate-300 text-white"}`}
              >
                {selectedTime ? <Check size={13} strokeWidth={3} /> : "2"}
              </div>
              <div>
                <p
                  className={`text-xs font-bold leading-none mb-0.5 ${selectedTime ? "text-green-700" : selectedDate ? "text-blue-700" : "text-slate-400"}`}
                >
                  {selectedTime ? "Time Selected" : "Select Time"}
                </p>
                {selectedTime && (
                  <p className="text-[11px] text-green-600 leading-none">
                    {getSlotDisplay(selectedTime)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* ── Main Grid ─────────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left Sidebar ──────────────────────────────────────────────── */}
          <motion.div variants={ITEM_VARIANTS}>
            <div className="sticky top-6 space-y-4">
              {/* Service Card */}
              <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold mb-3">
                  Booking for
                </p>
                <h2 className="text-base font-bold text-slate-900 mb-0.5">{service.name}</h2>
                <p className="text-slate-500 text-xs mb-4">{service.title}</p>

                <div className="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock size={12} />
                      Duration
                    </span>
                    <span className="font-semibold text-slate-800">{service.duration}</span>
                  </div>

                  {service.discount?.isActive && service.discount.type !== "none" ? (
                    <div className="flex items-baseline justify-between">
                      <span className="text-slate-400 line-through text-xs">₹{service.price}</span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-blue-600" style={{ fontFamily: "'Fraunces', serif" }}>
                          ₹{Math.round(discountedPrice)}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1">/session</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <span className="text-slate-500 text-xs">Price</span>
                      <div>
                        <span className="text-xl font-black text-slate-900">₹{service.price}</span>
                        <span className="text-slate-400 text-[11px] ml-1">/session</span>
                      </div>
                    </div>
                  )}

                  {service.discount?.isActive && service.discount.type !== "none" && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
                      <p className="text-blue-600 font-semibold text-[11px]">
                        🎉 Save ₹{discountAmount}
                        {service.discount.type === "percentage"
                          ? ` (${service.discount.value}% OFF)`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>

                {service.points?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold mb-2">
                      What's included
                    </p>
                    <div className="space-y-1.5">
                      {service.points.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={13} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-slate-600">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mentor Card */}
              {mentor && (
                <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold mb-3">
                    Your Mentor
                  </p>
                  <div className="flex items-center gap-3">
                    {mentor.profileImage ? (
                      <img
                        src={mentor.profileImage}
                        alt={mentor.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-blue-100"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {mentor.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "M"}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{mentor.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {mentor.designation || "Expert Mentor"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              <AnimatePresence>
                {formattedDateTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
                        Your Selection
                      </p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Session</span>
                        <span className="font-semibold text-slate-800 text-right max-w-[130px] truncate">
                          {service.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-500 shrink-0">Date</span>
                        <span className="font-semibold text-slate-800 text-right">
                          {formattedDateTime.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time</span>
                        <span className="font-semibold text-blue-600">{formattedDateTime.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-semibold text-slate-800">{slotDuration} min</span>
                      </div>
                      <div className="pt-2 mt-1 border-t border-green-200 flex justify-between">
                        <span className="font-semibold text-slate-700">Total (incl. GST)</span>
                        <span className="font-black text-blue-600 text-sm">
                          ₹{Math.round(discountedPrice * 1.18)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Right: Calendar + Slots ────────────────────────────────────── */}
          <div className="space-y-6">
            {/* ── Calendar Card ─────────────────────────────────────────────── */}
            <motion.div
              className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden"
              variants={ITEM_VARIANTS}
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Select a Date
                </h3>
                {selectedDate && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="text-[11px] text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
                  >
                    Clear <span className="text-slate-300">×</span>
                  </motion.button>
                )}
              </div>

              <div className="p-5">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-5">
                  <motion.button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft size={18} />
                  </motion.button>
                  <motion.p
                    key={currentMonth.toISOString()}
                    className="text-sm font-bold text-slate-900"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                  </motion.p>
                  <motion.button
                    onClick={handleNextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[11px] font-semibold text-slate-400 py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="relative">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`e-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) =>
                      renderDayCell(i + 1),
                    )}
                  </div>

                  {/* Skeleton overlay while prefetch runs */}
                  {!calendarReady && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      <p className="text-xs text-slate-400 font-medium">Checking availability…</p>
                    </div>
                  )}
                </div>

                {/* ── Legend ──────────────────────────────────────────── */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {LEGEND_ITEMS.map(({ label, className, textClass, fullBadge }) => (
                      <span
                        key={label}
                        className={`flex items-center gap-1.5 text-[11px] ${textClass}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md inline-flex items-center justify-center shrink-0 relative ${className}`}
                        >
                          {fullBadge && (
                            <span className="text-[5px] font-black text-red-400 uppercase tracking-wide leading-none">
                              Full
                            </span>
                          )}
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Time Slot Card ─────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  ref={timeSelectionRef}
                  key="time-section"
                  className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      Available Times
                      <span className="text-slate-400 font-normal">·</span>
                      <span className="text-slate-500 font-normal text-xs">
                        {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </h3>
                  </div>

                  <div className="p-5">
                    {slotsLoading ? (
                      <div className="flex flex-col items-center justify-center py-14 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                        <p className="text-sm text-slate-500 font-medium">
                          Finding available slots for{" "}
                          {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                          …
                        </p>
                      </div>
                    ) : timeGroups.length === 0 ? (
                      <motion.div
                        className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-3xl">
                          {noSlotsMsg?.icon}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800 mb-1">
                            {noSlotsMsg?.title}
                          </p>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {noSlotsMsg?.sub}
                          </p>
                        </div>
                        {noSlotsMsg?.cta && (
                          <motion.button
                            onClick={() => {
                              setSelectedDate(getTomorrowDate());
                              setSelectedTime("");
                            }}
                            className="mt-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {noSlotsMsg.cta}
                          </motion.button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedDate("");
                            setSelectedTime("");
                          }}
                          className="text-sm text-slate-400 hover:text-blue-600 font-medium transition"
                        >
                          ← Choose a different date
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-7">
                        {timeGroups.map((group, groupIdx) => {
                          const IconComponent = group.icon;
                          const totalInGroup = group.times.length;

                          return (
                            <motion.div
                              key={group.label}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: groupIdx * 0.08 }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                  <IconComponent size={14} className="text-blue-500" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                  {group.label}
                                </span>
                                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold border border-green-100">
                                  {totalInGroup} slot{totalInGroup !== 1 ? "s" : ""}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {group.times.map((time, idx) => {
                                  const isSelected = selectedTime === time;
                                  return (
                                    <motion.button
                                      key={time}
                                      onClick={() =>
                                        setSelectedTime((prev) => (prev === time ? "" : time))
                                      }
                                      className={`relative rounded-xl py-3 px-2 text-xs font-semibold transition-all min-h-[52px] flex flex-col items-center justify-center gap-0.5 ${
                                        isSelected
                                          ? "bg-blue-600 text-white shadow-md shadow-blue-200 border-2 border-blue-600"
                                          : "bg-slate-50 text-slate-700 border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                      }`}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: groupIdx * 0.06 + idx * 0.025 }}
                                      whileHover={{ scale: 1.03, y: -1 }}
                                      whileTap={{ scale: 0.96 }}
                                    >
                                      <span className="leading-tight text-center">
                                        {getSlotDisplay(time)}
                                      </span>
                                      {isSelected ? (
                                        <motion.span
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="text-[10px] text-blue-200 font-normal"
                                        >
                                          Selected ✓
                                        </motion.span>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          {slotDuration} min
                                        </span>
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })}

                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                          <AlertCircle size={12} className="text-blue-400" />
                          <span>
                            {allTimes.length} slot{allTimes.length !== 1 ? "s" : ""} available —
                            slots are first-come, first-served and may fill up quickly.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Action Bar ────────────────────────────────────────────────── */}
            <motion.div
              className="sticky bottom-4 flex gap-3 p-3.5 bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => router.push("/dashboard")}
                className="px-5 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold rounded-xl transition text-sm flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft size={16} />
                Back
              </motion.button>

              <AnimatePresence mode="wait">
                {selectedDate && selectedTime ? (
                  <motion.button
                    key="proceed"
                    onClick={() => {
                      const slotData = encodeURIComponent(
                        JSON.stringify({
                          date: selectedDate,
                          time: selectedTime,
                          duration: slotDuration,
                        }),
                      );
                      router.push(`/checkout?serviceId=${serviceId}&slot=${slotData}`);
                    }}
                    className="flex-1 px-5 py-3 font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200 transition-all flex items-center justify-between gap-3 text-sm"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex flex-col items-start leading-tight">
                      <span>Proceed to Payment</span>
                      <span className="text-xs font-normal text-blue-200">
                        ₹{Math.round(discountedPrice * 1.18)} incl. 18% GST
                      </span>
                    </span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  </motion.button>
                ) : (
                  <motion.div
                    key="hint"
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {!selectedDate ? "Select a date to continue" : "Select a time slot to continue"}
                  </motion.div>
                )}
              </AnimatePresence>
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading booking details…</p>
        </div>
      }
    >
      <SelectSlotContent />
    </Suspense>
  );
}