"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

type Member = {
  name: string;
  whatsapp: string;
};

type GdPlan = {
  id: string;
  memberCount: number;
  pricePerMember: number;
  totalAmount: number;
  basePrice: number;
  name: string;
  title: string;
  value: string;
  duration: string;
  points: string[];
};

type GdBookingContext = {
  serviceId: string;
  members: Member[];
  createdAt: number;
};

function getEmptyMembers(count: number): Member[] {
  return Array.from({ length: count }, () => ({ name: "", whatsapp: "" }));
}

function normalizePhone(value: string) {
  return value.replace(/[\s\-+]/g, "");
}

function GdBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [plan, setPlan] = useState<GdPlan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch plan details from API
  useEffect(() => {
    if (!serviceId) {
      toast.error("Please choose a valid GD plan first.");
      router.replace("/services");
      return;
    }

    const token = localStorage.getItem("authToken");
    const target = `/gd-booking?serviceId=${serviceId}`;
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/gd-bookings/plans`);
        const plans: GdPlan[] = res.data.plans || [];
        const found = plans.find((p) => p.id === serviceId);
        if (!found) {
          toast.error("GD plan not found. Please choose a valid plan.");
          router.replace("/services");
          return;
        }
        setPlan(found);

        // Try to restore saved context
        try {
          const savedContext = JSON.parse(
            localStorage.getItem("gd_booking_context") || "null",
          ) as GdBookingContext | null;
          if (
            savedContext?.serviceId === serviceId &&
            Array.isArray(savedContext.members) &&
            savedContext.members.length === found.memberCount
          ) {
            setMembers(
              savedContext.members.map((member: Partial<Member>) => ({
                name: member.name || "",
                whatsapp: member.whatsapp || "",
              })),
            );
            setIsLoading(false);
            return;
          }
        } catch {}

        setMembers(getEmptyMembers(found.memberCount));
      } catch {
        toast.error("Failed to load GD plans.");
        router.replace("/services");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [serviceId, router, API_URL]);

  const completedCount = useMemo(
    () =>
      members.filter(
        (member) =>
          member.name.trim() && normalizePhone(member.whatsapp).length === 10,
      ).length,
    [members],
  );

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((current) =>
      current.map((member, i) =>
        i === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  const handleContinue = () => {
    if (!plan || !serviceId) return;

    for (let index = 0; index < members.length; index += 1) {
      const member = members[index];
      if (!member.name.trim()) {
        toast.error(`Member ${index + 1}: name is required.`);
        return;
      }

      const phone = normalizePhone(member.whatsapp);
      if (!/^[6-9]\d{9}$/.test(phone)) {
        toast.error(
          `Member ${index + 1}: enter a valid 10-digit WhatsApp number.`,
        );
        return;
      }
    }

    const cleanMembers = members.map((member) => ({
      name: member.name.trim(),
      whatsapp: normalizePhone(member.whatsapp),
    }));

    localStorage.setItem("gd_members", JSON.stringify(cleanMembers));
    localStorage.setItem(
      "gd_booking_context",
      JSON.stringify({
        serviceId,
        members: cleanMembers,
        createdAt: Date.now(),
      }),
    );
    router.push(`/select-slot?serviceId=${serviceId}`);
  };

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/services")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              Team details first
            </p>
            <h1 className="mb-3 text-2xl font-black leading-tight text-slate-950">
              {plan.name}
            </h1>
            <p className="mb-6 text-sm leading-6 text-slate-500">
              {plan.value}
            </p>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Team size</span>
                <span className="font-black text-slate-950">
                  {plan.memberCount} members
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Per member</span>
                <span className="font-black text-slate-950">
                  Rs {plan.pricePerMember}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Plan price
                </span>
                <span className="text-xl font-black text-blue-600">
                  Rs {plan.totalAmount}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-xs font-medium leading-5 text-emerald-800">
                This is a private team booking. You must bring your own
                teammates; we do not add individual candidates to this group.
              </p>
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Enter team member details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add name and WhatsApp number for all {plan.memberCount}{" "}
                  teammates.
                </p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {completedCount}/{plan.memberCount} complete
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-black text-slate-800">
                      Member {index + 1}
                    </p>
                    {member.name.trim() &&
                      normalizePhone(member.whatsapp).length === 10 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                  </div>
                  <label className="mb-3 block">
                    <span className="mb-1.5 block text-xs font-bold text-slate-500">
                      Full name
                    </span>
                    <input
                      value={member.name}
                      onChange={(event) =>
                        updateMember(index, "name", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      placeholder="Enter member name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-slate-500">
                      WhatsApp number
                    </span>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={member.whatsapp}
                        onChange={(event) =>
                          updateMember(index, "whatsapp", event.target.value)
                        }
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium leading-6 text-blue-900">
                After this, choose your GD date and time slot, then complete
                payment.
              </p>
              <button
                onClick={handleContinue}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Select Slot
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function GdBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <GdBookingContent />
    </Suspense>
  );
}
