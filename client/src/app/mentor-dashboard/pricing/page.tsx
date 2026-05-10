"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Save,
  Edit2,
  X,
  Plus,
  Trash2,
  Globe,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { pricingAPI } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  title: string;
  value: string;
  points: string[];
  level: string;
  support: string;
  access: string;
  memberCount?: number | null;
  pricePerMember?: number | null;
  discount?: {
    type: "percentage" | "fixed" | "none";
    value: number;
    isActive: boolean;
  };
}

export default function MentorPricingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [discountMode, setDiscountMode] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [savingDiscountId, setSavingDiscountId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGlobalDiscount, setShowGlobalDiscount] = useState(false);
  const [showGlobalConfirmModal, setShowGlobalConfirmModal] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState({
    type: "percentage" as "percentage" | "fixed" | "none",
    value: 0,
    isActive: false,
  });
  const [servicesWithDiscounts, setServicesWithDiscounts] = useState<Service[]>(
    [],
  );
  const [applyMode, setApplyMode] = useState<"replace" | "skip">("replace");
  const [showLastApplied, setShowLastApplied] = useState(false);
  const [lastAppliedDiscount, setLastAppliedDiscount] = useState<{
    type: "percentage" | "fixed" | "none";
    value: number;
    appliedAt: string;
    servicesCount: number;
  } | null>(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [removedDiscounts, setRemovedDiscounts] = useState<
    {
      serviceId: string;
      discount: {
        type: "percentage" | "fixed" | "none";
        value: number;
        isActive: boolean;
      };
    }[]
  >([]);
  const [isGdPlan, setIsGdPlan] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    price: 0,
    duration: "",
    title: "",
    value: "",
    points: [""],
    level: "",
    support: "",
    access: "",
    memberCount: null,
    pricePerMember: null,
  });

  useEffect(() => {
    fetchMentorPricing();
  }, []);

  const fetchMentorPricing = async () => {
    try {
      const res = await pricingAPI.getServices();
      const servicesData = res.data.services || res.data || [];
      setServices(
        Array.isArray(servicesData)
          ? servicesData
          : servicesData.services || [],
      );
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load pricing");
      setIsLoading(false);
    }
  };

  const handleFieldChange = (serviceId: string, field: string, value: any) => {
    setServices(
      services.map((s) => {
        if (s.id !== serviceId) return s;
        let updated = field === "points"
          ? { ...s, points: value }
          : { ...s, [field]: value };
        
        if (s.id?.startsWith("gd-")) {
          const mCount = field === "memberCount" ? value : s.memberCount;
          const pPerMem = field === "pricePerMember" ? value : s.pricePerMember;
          if (mCount && pPerMem) {
            updated.price = mCount * pPerMem;
          }
        }
        return updated;
      }),
    );
  };

  const handleSave = async (serviceId: string) => {
    try {
      setIsSaving(true);
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      if (
        !service.name ||
        !service.price ||
        !service.duration ||
        !service.title
      ) {
        toast.error("Name, price, duration and title are required");
        setIsSaving(false);
        return;
      }

      // Never send discount in service update — discount has its own endpoint
      const { discount: _omit, ...serviceFields } = service;
      await pricingAPI.updateService(serviceId, serviceFields);

      toast.success("Service updated successfully!");
      setEditingServiceId(null);
      await fetchMentorPricing();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDiscount = async (serviceId: string) => {
    try {
      setSavingDiscountId(serviceId);
      const service = services.find((s) => s.id === serviceId);

      if (!service || !service.discount) return;

      // Validate discount
      if (
        service.discount.type === "percentage" &&
        service.discount.value > 100
      ) {
        toast.error("Percentage discount cannot exceed 100%");
        setSavingDiscountId(null);
        return;
      }

      if (service.discount.value < 0) {
        toast.error("Discount value cannot be negative");
        setSavingDiscountId(null);
        return;
      }

      // Validate fixed discount doesn't exceed service price
      if (
        service.discount.type === "fixed" &&
        service.discount.value >= service.price
      ) {
        toast.error(
          `Fixed discount (₹${service.discount.value}) cannot be equal to or greater than service price (₹${service.price})`,
        );
        setSavingDiscountId(null);
        return;
      }

      await pricingAPI.updateDiscount(serviceId, {
        type: service.discount.type,
        value: service.discount.value,
        isActive: service.discount.isActive,
      });

      toast.success("Discount updated successfully!");
      setDiscountMode({ ...discountMode, [serviceId]: false });
      setSavingDiscountId(null);
      await fetchMentorPricing(); // re-sync with DB
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save discount");
      setSavingDiscountId(null);
    }
  };

  const handleDiscountChange = (
    serviceId: string,
    field: string,
    value: any,
  ) => {
    setServices(
      services.map((s) => {
        if (s.id !== serviceId) return s;
        const updated = { ...s.discount, [field]: value } as any;
        // auto-deactivate when type is set to none, auto-reset value
        if (field === "type" && value === "none") {
          updated.isActive = false;
          updated.value = 0;
        }
        return { ...s, discount: updated };
      }),
    );
  };

  const handleCreateService = useCallback(async () => {
    try {
      // Validate required fields
      if (
        !newService.name ||
        !newService.price ||
        !newService.duration ||
        !newService.title
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSaving(true);

      // Create unique ID from name, prefixing with 'gd-' if it's a GD plan
      const cleanSlug = newService.name.toLowerCase().replace(/\s+/g, "-");
      const serviceId = isGdPlan ? (cleanSlug.startsWith("gd-") ? cleanSlug : `gd-${cleanSlug}`) : cleanSlug;

      const serviceData = {
        ...newService,
        id: serviceId,
        points: newService.points?.filter((p) => p.trim() !== "") || [],
      };

      await pricingAPI.createService(serviceData);

      toast.success("Service created successfully!");
      setShowCreateModal(false);
      setIsGdPlan(false);
      setNewService({
        name: "",
        price: 0,
        duration: "",
        title: "",
        value: "",
        points: [""],
        level: "",
        support: "",
        access: "",
        memberCount: null,
        pricePerMember: null,
      });

      // Refresh services
      await fetchMentorPricing();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create service");
    } finally {
      setIsSaving(false);
    }
  }, [newService, isGdPlan]);

  const handleDeleteService = useCallback(async (serviceId: string) => {
    try {
      await pricingAPI.deleteService(serviceId);
      toast.success("Service deleted successfully!");
      setDeleteTarget(null);
      await fetchMentorPricing();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete service");
    }
  }, []);

  const handleApplyGlobalDiscount = useCallback(
    async (mode: "replace" | "skip") => {
      try {
        setIsSaving(true);

        let appliedCount = 0;
        let skippedCount = 0;

        for (const service of services) {
          // Skip services with existing discounts if mode is 'skip'
          if (
            mode === "skip" &&
            service.discount?.isActive &&
            service.discount?.type !== "none"
          ) {
            skippedCount++;
            continue;
          }

          // Check if global discount is valid for this service
          if (
            globalDiscount.type === "fixed" &&
            globalDiscount.value >= service.price
          ) {
            skippedCount++;
            continue;
          }

          await pricingAPI.updateDiscount(service.id, {
            type: globalDiscount.type,
            value: globalDiscount.value,
            isActive: true,
          });
          appliedCount++;
        }

        setShowGlobalConfirmModal(false);

        if (appliedCount > 0) {
          // Save last applied discount info
          setLastAppliedDiscount({
            type: globalDiscount.type,
            value: globalDiscount.value,
            appliedAt: new Date().toLocaleString(),
            servicesCount: appliedCount,
          });

          toast.success(
            `Global discount applied to ${appliedCount} service${appliedCount > 1 ? "s" : ""}!${skippedCount > 0 ? ` (${skippedCount} skipped)` : ""}`,
          );
        } else {
          toast.error("No services were updated. All services were skipped.");
        }

        await fetchMentorPricing();
      } catch (error: any) {
        toast.error(
          error.response?.data?.error || "Failed to apply global discount",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [services, globalDiscount],
  );

  const handleRemoveAllDiscounts = useCallback(async () => {
    try {
      setIsSaving(true);
      setShowRemoveConfirmModal(false);

      // Store current discounts for undo
      const currentDiscounts = services
        .filter((s) => s.discount?.isActive && s.discount?.type !== "none")
        .map((s) => ({
          serviceId: s.id,
          discount: { ...s.discount! },
        }));

      setRemovedDiscounts(currentDiscounts);

      let removedCount = 0;
      for (const service of services) {
        if (service.discount?.isActive && service.discount?.type !== "none") {
          await pricingAPI.updateDiscount(service.id, {
            type: "none",
            value: 0,
            isActive: false,
          });
          removedCount++;
        }
      }

      if (removedCount > 0) {
        // Show success toast with undo option
        toast.success(
          `Removed discounts from ${removedCount} service${removedCount > 1 ? "s" : ""}!`,
          {
            duration: 6000,
            action: {
              label: "Undo",
              onClick: () => handleUndoRemoveDiscounts(),
            },
          },
        );

        setLastAppliedDiscount(null);
      } else {
        toast("No active discounts to remove", { icon: "ℹ️" });
      }

      await fetchMentorPricing();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove discounts");
    } finally {
      setIsSaving(false);
    }
  }, [services]);

  const handleUndoRemoveDiscounts = useCallback(async () => {
    try {
      setIsSaving(true);

      for (const { serviceId, discount } of removedDiscounts) {
        await pricingAPI.updateDiscount(serviceId, discount);
      }

      toast.success("Discounts restored successfully!");
      setRemovedDiscounts([]);
      await fetchMentorPricing();
    } catch (error: any) {
      toast.error("Failed to restore discounts");
    } finally {
      setIsSaving(false);
    }
  }, [removedDiscounts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Services & Pricing
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Manage your service offerings and discount strategies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGlobalDiscount(true)}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-50 text-black font-medium transition-all flex items-center gap-2 border border-zinc-200 hover:border-zinc-300"
          >
            <Globe size={18} />
            Global Discount
            {lastAppliedDiscount && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLastApplied(!showLastApplied);
                }}
                className="ml-1 cursor-pointer hover:text-zinc-600 transition"
                title="View last applied discount"
              >
                <Clock size={14} />
              </span>
            )}
          </button>
          <button
            onClick={() => setShowRemoveConfirmModal(true)}
            className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all flex items-center gap-2 border border-zinc-700 hover:border-zinc-600"
            title="Remove all active discounts"
          >
            <TrendingDown size={18} />
            Remove All
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-50 text-black font-medium transition-all flex items-center gap-2 border border-zinc-200 hover:border-zinc-300"
          >
            <Plus size={18} />
            New Service
          </button>
        </div>
      </div>

      {/* Last Applied Discount Popup */}
      {showLastApplied && lastAppliedDiscount && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 min-w-[280px]">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-white text-sm">
              Last Applied Discount
            </h4>
            <button
              onClick={() => setShowLastApplied(false)}
              className="text-zinc-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Type:</span>
              <span className="text-white font-medium">
                {lastAppliedDiscount.type === "percentage"
                  ? "Percentage"
                  : "Fixed Amount"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Value:</span>
              <span className="text-white font-medium">
                {lastAppliedDiscount.type === "percentage"
                  ? `${lastAppliedDiscount.value}%`
                  : `₹${lastAppliedDiscount.value}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Applied to:</span>
              <span className="text-white font-medium">
                {lastAppliedDiscount.servicesCount} services
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">When:</span>
              <span className="text-white font-medium text-xs">
                {lastAppliedDiscount.appliedAt}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Discount Modal */}
      {showGlobalDiscount && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full shadow-2xl">
            {/* Header */}
            <div className="bg-black border-b border-zinc-700 p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>🌐</span> Global Discount
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Apply the same discount to all services at once
                </p>
              </div>
              <button
                onClick={() => setShowGlobalDiscount(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-black/50 rounded-lg border border-zinc-800 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-300 mb-2 font-semibold">
                      Discount Type
                    </label>
                    <select
                      value={globalDiscount.type}
                      onChange={(e) =>
                        setGlobalDiscount({
                          ...globalDiscount,
                          type: e.target.value as any,
                          value: 0,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none text-sm"
                    >
                      <option value="none">No Discount</option>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {globalDiscount.type !== "none" && (
                    <div>
                      <label className="block text-sm text-zinc-300 mb-2 font-semibold">
                        {globalDiscount.type === "percentage"
                          ? "Discount %"
                          : "Discount Amount (₹)"}
                      </label>
                      <input
                        type="number"
                        value={globalDiscount.value}
                        onChange={(e) =>
                          setGlobalDiscount({
                            ...globalDiscount,
                            value: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max={
                          globalDiscount.type === "percentage" ? 100 : undefined
                        }
                        placeholder={
                          globalDiscount.type === "percentage"
                            ? "e.g., 20"
                            : "e.g., 500"
                        }
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none text-sm"
                      />
                    </div>
                  )}

                  {globalDiscount.type !== "none" && (
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (
                            !globalDiscount.value ||
                            globalDiscount.value <= 0
                          ) {
                            toast.error("Please enter a valid discount value");
                            return;
                          }
                          if (globalDiscount.type === "fixed") {
                            const minPrice = Math.min(
                              ...services.map((s) => s.price),
                            );
                            if (globalDiscount.value >= minPrice) {
                              toast.error(
                                `Fixed discount ₹${globalDiscount.value} exceeds lowest service price ₹${minPrice}`,
                              );
                              return;
                            }
                          }
                          const existing = services.filter(
                            (s) =>
                              s.discount?.isActive &&
                              s.discount?.type !== "none",
                          );
                          if (existing.length > 0) {
                            setServicesWithDiscounts(existing);
                            setShowGlobalConfirmModal(true);
                          } else {
                            handleApplyGlobalDiscount("replace");
                          }
                        }}
                        disabled={isSaving}
                        className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition disabled:opacity-50 text-sm"
                      >
                        Apply to All
                      </button>
                    </div>
                  )}
                </div>

                {globalDiscount.type !== "none" && globalDiscount.value > 0 && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded text-sm">
                    <p className="text-purple-300 font-semibold mb-2">
                      Preview (student pays, incl. 18% GST):
                    </p>
                    <div className="space-y-1">
                      {services.map((service, idx) => {
                        const discountAmt =
                          globalDiscount.type === "percentage"
                            ? (service.price * globalDiscount.value) / 100
                            : globalDiscount.value;
                        const afterDiscount = Math.max(
                          0,
                          service.price - discountAmt,
                        );
                        const withGst = Math.round(afterDiscount * 1.18);
                        const origWithGst = Math.round(service.price * 1.18);
                        const isValid =
                          globalDiscount.type === "percentage"
                            ? globalDiscount.value <= 100
                            : globalDiscount.value < service.price;
                        return (
                          <div
                            key={`${service.id}-${idx}`}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="text-zinc-400">
                              {service.name}:
                            </span>
                            <span
                              className={
                                isValid ? "text-purple-300" : "text-red-400"
                              }
                            >
                              {isValid
                                ? `₹${origWithGst} → ₹${withGst} (save ₹${origWithGst - withGst})`
                                : "⚠️ Discount ≥ price — will be skipped"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove All Discounts Confirmation Modal */}
      {showRemoveConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-red-500/50 max-w-md w-full">
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-b border-red-500/30 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">🗑️</span>
                Remove All Discounts?
              </h2>
              <p className="text-zinc-300 mt-2 text-sm">
                This will remove all active discounts from your services
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-300 text-sm">
                  You can undo this action within 6 seconds after confirmation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveAllDiscounts}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {isSaving ? "Removing..." : "Yes, Remove All"}
                </button>
                <button
                  onClick={() => setShowRemoveConfirmModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-red-500/40 max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border-b border-red-500/20 p-6 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Delete Service?
                </h2>
              </div>
              <p className="text-zinc-400 text-sm mt-2 ml-[52px]">
                This will permanently remove{" "}
                <span className="text-white font-semibold">
                  "{deleteTarget.name}"
                </span>{" "}
                from your pricing. This cannot be undone.
              </p>
            </div>
            <div className="p-6 flex gap-3">
              <button
                onClick={() => handleDeleteService(deleteTarget.id)}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                {isSaving ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Discount Confirmation Modal */}
      {showGlobalConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-amber-500/50 max-w-2xl w-full">
            <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border-b border-amber-500/30 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">⚠️</span>
                Existing Discounts Detected
              </h2>
              <p className="text-zinc-300 mt-2">
                {servicesWithDiscounts.length} service
                {servicesWithDiscounts.length > 1 ? "s" : ""} already{" "}
                {servicesWithDiscounts.length > 1 ? "have" : "has"} active
                discounts
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-300 text-sm mb-3 font-semibold">
                  Services with existing discounts:
                </p>
                <div className="space-y-2">
                  {servicesWithDiscounts.map((service, idx) => (
                    <div
                      key={`${service.id}-${idx}`}
                      className="flex justify-between items-center text-sm bg-zinc-900/50 p-2 rounded"
                    >
                      <span className="text-white">{service.name}</span>
                      <span className="text-amber-400">
                        {service.discount?.type === "percentage"
                          ? `${service.discount.value}% OFF`
                          : `₹${service.discount?.value} OFF`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-200 font-semibold">
                  What would you like to do?
                </p>

                <button
                  onClick={() => {
                    setApplyMode("replace");
                    handleApplyGlobalDiscount("replace");
                  }}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold transition disabled:opacity-50 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <div className="font-bold">
                        Replace All Existing Discounts
                      </div>
                      <div className="text-sm text-red-100 mt-1">
                        Apply the new global discount to ALL services, replacing
                        any existing discounts
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setApplyMode("skip");
                    handleApplyGlobalDiscount("skip");
                  }}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition disabled:opacity-50 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⏭️</span>
                    <div>
                      <div className="font-bold">Keep Existing Discounts</div>
                      <div className="text-sm text-blue-100 mt-1">
                        Only apply global discount to services without existing
                        discounts
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowGlobalConfirmModal(false)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition text-sm"
                >
                  Cancel
                </button>
              </div>

              {isSaving && (
                <div className="flex items-center justify-center gap-2 text-zinc-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span className="text-sm">Applying global discount...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Create New Service
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    placeholder="e.g., Career Coaching"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newService.price === 0 ? "" : newService.price}
                    min={0}
                    step={1}
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price:
                          e.target.value === ""
                            ? 0
                            : Math.abs(parseInt(e.target.value)) || 0,
                      })
                    }
                    placeholder="2000"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({ ...newService, duration: e.target.value })
                    }
                    placeholder="60 mins"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newService.title}
                    onChange={(e) =>
                      setNewService({ ...newService, title: e.target.value })
                    }
                    placeholder="One-on-one session"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={newService.value}
                  onChange={(e) =>
                    setNewService({ ...newService, value: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe your service..."
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Feature Points (one per line)
                </label>
                <textarea
                  value={newService.points?.join("\n") || ""}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      points: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Level
                </label>
                <input
                  type="text"
                  value={newService.level}
                  onChange={(e) =>
                    setNewService({ ...newService, level: e.target.value })
                  }
                  placeholder="Premium"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* GD Plan Toggle */}
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGdPlan}
                    onChange={(e) => {
                      setIsGdPlan(e.target.checked);
                      if (!e.target.checked) {
                        setNewService({
                          ...newService,
                          memberCount: null,
                          pricePerMember: null,
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-purple-500/30 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-purple-300">
                    Is this a Group Discussion (GD) Plan?
                  </span>
                </label>

                {isGdPlan && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-purple-400 mb-2">
                        Team Size (Members)
                      </label>
                      <input
                        type="number"
                        value={newService.memberCount || ""}
                        min={2}
                        max={20}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          const mCount = e.target.value === "" ? null : Math.abs(parseInt(e.target.value)) || null;
                          const pPerMem = newService.pricePerMember;
                          const computedPrice = mCount && pPerMem ? mCount * pPerMem : newService.price;
                          setNewService({
                            ...newService,
                            memberCount: mCount,
                            price: computedPrice,
                          });
                        }}
                        placeholder="e.g., 4"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-purple-500/30 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-400 mb-2">
                        Price Per Member (₹)
                      </label>
                      <input
                        type="number"
                        value={newService.pricePerMember || ""}
                        min={0}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          const pPerMem = e.target.value === "" ? null : Math.abs(parseInt(e.target.value)) || null;
                          const mCount = newService.memberCount;
                          const computedPrice = mCount && pPerMem ? mCount * pPerMem : newService.price;
                          setNewService({
                            ...newService,
                            pricePerMember: pPerMem,
                            price: computedPrice,
                          });
                        }}
                        placeholder="e.g., 199"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-purple-500/30 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none text-sm"
                      />
                    </div>
                    {newService.memberCount && newService.pricePerMember && (
                      <p className="col-span-2 text-xs text-purple-400">
                        Total Price is automatically calculated as: {newService.memberCount} × ₹{newService.pricePerMember} = ₹{newService.memberCount * newService.pricePerMember}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateService}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? "Creating..." : "Create Service"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {services.map((service, idx) => (
          <div
            key={`${service.id}-${idx}`}
            className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8"
          >
            {editingServiceId === service.id ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    {service.name}
                  </h3>
                  <button
                    onClick={() => setEditingServiceId(null)}
                    className="p-2 hover:bg-zinc-700 rounded-lg text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) =>
                        handleFieldChange(service.id, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={service.price === 0 ? "" : service.price}
                      min={0}
                      step={1}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-", "."].includes(e.key) &&
                        e.preventDefault()
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          service.id,
                          "price",
                          e.target.value === ""
                            ? 0
                            : Math.abs(parseInt(e.target.value)) || 0,
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={service.duration}
                      onChange={(e) =>
                        handleFieldChange(
                          service.id,
                          "duration",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) =>
                        handleFieldChange(service.id, "title", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* GD-specific fields */}
                {service.id?.startsWith("gd-") && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Team Size (Members)
                      </label>
                      <input
                        type="number"
                        value={(service as any).memberCount || ""}
                        min={2}
                        max={20}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            service.id,
                            "memberCount",
                            e.target.value === ""
                              ? null
                              : Math.abs(parseInt(e.target.value)) || null,
                          )
                        }
                        placeholder="e.g., 4"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-purple-500/30 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Price Per Member (₹)
                      </label>
                      <input
                        type="number"
                        value={(service as any).pricePerMember || ""}
                        min={0}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            service.id,
                            "pricePerMember",
                            e.target.value === ""
                              ? null
                              : Math.abs(parseInt(e.target.value)) || null,
                          )
                        }
                        placeholder="e.g., 199"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-purple-500/30 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <p className="col-span-2 text-xs text-purple-400">
                      Total plan price = Members × Per-member price. Update the Price (₹) field above accordingly.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={service.value}
                    onChange={(e) =>
                      handleFieldChange(service.id, "value", e.target.value)
                    }
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Feature Points (one per line)
                  </label>
                  <textarea
                    value={service.points.join("\n")}
                    onChange={(e) =>
                      handleFieldChange(
                        service.id,
                        "points",
                        e.target.value.split("\n"),
                      )
                    }
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Level
                  </label>
                  <input
                    type="text"
                    value={service.level}
                    onChange={(e) =>
                      handleFieldChange(service.id, "level", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleSave(service.id)}
                  disabled={isSaving}
                  className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Service"}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {service.name}
                    </h3>
                    <p className="text-zinc-400">{service.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingServiceId(service.id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({ id: service.id, name: service.name })
                      }
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-red-600 border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-white transition flex items-center gap-1.5"
                      title="Delete service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-zinc-400">Price</p>
                    <p className="text-white font-bold">₹{service.price}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Duration</p>
                    <p className="text-white font-bold">{service.duration}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Level</p>
                    <p className="text-white font-bold">{service.level}</p>
                  </div>
                </div>

                {/* GD-specific info in view mode */}
                {service.id?.startsWith("gd-") && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      GD Plan
                    </span>
                    {(service as any).memberCount ? (
                      <span className="text-sm text-zinc-300">
                        {(service as any).memberCount} members × ₹{(service as any).pricePerMember}/member
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ⚠️ Incomplete config: Edit to set Team Size & Per-member Price!
                      </span>
                    )}
                  </div>
                )}

                <p className="text-zinc-300 text-sm mt-3">{service.value}</p>

                <div className="mt-3">
                  <p className="text-zinc-400 text-sm">Features:</p>
                  <ul className="list-disc list-inside text-zinc-300 text-sm">
                    {service.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Discount Section */}
                <div className="mt-6 pt-6 border-t border-zinc-700">
                  {!discountMode[service.id] ? (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm mb-2">
                          Discount Status:
                        </p>
                        {service.discount?.isActive ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
                                {service.discount.type === "percentage"
                                  ? `${service.discount.value}% OFF`
                                  : `₹${service.discount.value} OFF`}
                              </div>
                              <span className="text-zinc-400 text-sm">
                                (Final: ₹
                                {Math.round(
                                  service.price -
                                    (service.discount.type === "percentage"
                                      ? (service.price *
                                          service.discount.value) /
                                        100
                                      : service.discount.value),
                                )}
                                )
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500">
                                Applied:
                              </span>
                              {lastAppliedDiscount &&
                              lastAppliedDiscount.type ===
                                service.discount.type &&
                              lastAppliedDiscount.value ===
                                service.discount.value ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                                  <svg
                                    className="w-3 h-3 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-xs font-medium text-purple-400">
                                    Globally
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                                  <svg
                                    className="w-3 h-3 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    />
                                  </svg>
                                  <span className="text-xs font-medium text-blue-400">
                                    Service-specific
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-sm">
                            No discount applied
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setDiscountMode({
                            ...discountMode,
                            [service.id]: true,
                          })
                        }
                        className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition text-sm"
                      >
                        Set Discount
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-3">
                        Configure Discount
                      </h4>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Discount Type
                          </label>
                          <select
                            value={service.discount?.type || "none"}
                            onChange={(e) =>
                              handleDiscountChange(
                                service.id,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none text-sm"
                          >
                            <option value="none">No Discount</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                          </select>
                        </div>

                        {service.discount?.type !== "none" && (
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              {service.discount?.type === "percentage"
                                ? "Discount %"
                                : `Discount Amount (₹) - Max: ₹${service.price - 1}`}
                            </label>
                            <input
                              type="number"
                              value={service.discount?.value || 0}
                              onChange={(e) =>
                                handleDiscountChange(
                                  service.id,
                                  "value",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              min="0"
                              max={
                                service.discount?.type === "percentage"
                                  ? 100
                                  : service.price - 1
                              }
                              className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 focus:outline-none text-sm"
                            />
                            {service.discount?.type === "fixed" && (
                              <p className="text-xs text-amber-400 mt-1">
                                Must be less than ₹{service.price}
                              </p>
                            )}
                          </div>
                        )}

                        {service.discount?.type !== "none" && (
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={service.discount?.isActive || false}
                                disabled={
                                  (service.discount?.type === "percentage" &&
                                    service.discount?.value > 100) ||
                                  (service.discount?.type === "fixed" &&
                                    service.discount?.value >= service.price)
                                }
                                onChange={(e) => {
                                  // Check if discount is valid before allowing activation
                                  if (e.target.checked) {
                                    if (
                                      service.discount?.type === "percentage" &&
                                      service.discount?.value > 100
                                    ) {
                                      toast.error(
                                        "Cannot activate: Percentage discount exceeds 100%",
                                      );
                                      return;
                                    }
                                    if (
                                      service.discount?.type === "fixed" &&
                                      service.discount?.value >= service.price
                                    ) {
                                      toast.error(
                                        `Cannot activate: Discount (₹${service.discount?.value}) exceeds service price (₹${service.price})`,
                                      );
                                      return;
                                    }
                                  }
                                  handleDiscountChange(
                                    service.id,
                                    "isActive",
                                    e.target.checked,
                                  );
                                }}
                                className="w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <span
                                className={`text-sm ${
                                  (service.discount?.type === "percentage" &&
                                    service.discount?.value > 100) ||
                                  (service.discount?.type === "fixed" &&
                                    service.discount?.value >= service.price)
                                    ? "text-red-400"
                                    : "text-zinc-400"
                                }`}
                              >
                                Activate
                                {((service.discount?.type === "percentage" &&
                                  service.discount?.value > 100) ||
                                  (service.discount?.type === "fixed" &&
                                    service.discount?.value >=
                                      service.price)) && (
                                  <span className="ml-1 text-xs">
                                    (Invalid discount)
                                  </span>
                                )}
                              </span>
                            </label>
                          </div>
                        )}
                      </div>

                      {service.discount?.type !== "none" &&
                        service.discount?.value &&
                        service.discount?.isActive && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm">
                            <p className="text-emerald-400 font-semibold">
                              Final Price: ₹
                              {Math.round(
                                service.price -
                                  (service.discount.type === "percentage"
                                    ? (service.price * service.discount.value) /
                                      100
                                    : service.discount.value),
                              )}
                            </p>
                            <p className="text-emerald-300 text-xs mt-1">
                              Savings: ₹
                              {Math.round(
                                service.discount.type === "percentage"
                                  ? (service.price * service.discount.value) /
                                      100
                                  : service.discount.value,
                              )}
                            </p>
                          </div>
                        )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveDiscount(service.id)}
                          disabled={savingDiscountId === service.id}
                          className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 text-sm"
                        >
                          {savingDiscountId === service.id
                            ? "Saving..."
                            : "Save Discount"}
                        </button>
                        <button
                          onClick={() =>
                            setDiscountMode({
                              ...discountMode,
                              [service.id]: false,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
