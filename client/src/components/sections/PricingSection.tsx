"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Check } from "lucide-react";

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
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch pricing data");
  return res.json();
};

export default function PricingSection() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const router = useRouter();

  const handleBook = (serviceId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const target = `/select-slot?serviceId=${serviceId}`;
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
    } else {
      router.push(target);
    }
  };

  const { data: pricingData } = useSWR(
    `${API_URL}/pricing-section/public`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      revalidateIfStale: true,
      refreshInterval: 0,
    },
  );

  if (!pricingData) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        .prc-book-btn { transition: opacity 0.15s ease; }
        .prc-book-btn:hover { opacity: 0.88; }
      `}</style>

      <section
        id="pricing"
        className="relative py-6 lg:py-8 px-4 sm:px-6"
        style={{
          background: "#f8f6f1",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* ── Header ── */}
          <div className="text-center mb-10 lg:mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border"
              style={{
                background: "rgba(29,78,216,0.05)",
                borderColor: "rgba(29,78,216,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1d40b0",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                {pricingData.header.badge}
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "#0f172a",
                marginBottom: 12,
              }}
            >
              {pricingData.header.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span
                style={{
                  fontWeight: 600,
                  color: "#1d4ed8",
                  fontStyle: "italic",
                }}
              >
                {pricingData.header.title.split(" ").slice(-1)}
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#64748b",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {pricingData.header.subtitle}
            </p>
          </div>

          {/* ── Service cards grid ── */}
          <div
            className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6"
            style={{ marginBottom: 48 }}
          >
            {pricingData.services.map((svc: Service, idx: number) => {
              const s = svc as any;
              const hasDsc =
                s?.discount?.isActive && s?.discount?.type !== "none";
              const dAmt = hasDsc
                ? s.discount.type === "percentage"
                  ? (svc.price * s.discount.value) / 100
                  : s.discount.value
                : 0;
              const basePrice = Math.round(
                hasDsc ? svc.price - dAmt : svc.price,
              );
              const gst = Math.round(basePrice * 0.18);

              // Richer, more vibrant accent colours — all within site's blue/indigo/teal/green family
              const accents = [
                {
                  bar: "#2563eb",
                  grad: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  light: "rgba(37,99,235,0.07)",
                  lightStrong: "rgba(37,99,235,0.13)",
                  border: "rgba(37,99,235,0.18)",
                },
                {
                  bar: "#0e7490",
                  grad: "linear-gradient(135deg,#0891b2,#0e7490)",
                  light: "rgba(14,116,144,0.07)",
                  lightStrong: "rgba(14,116,144,0.13)",
                  border: "rgba(14,116,144,0.18)",
                },
                {
                  bar: "#6d28d9",
                  grad: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  light: "rgba(109,40,217,0.07)",
                  lightStrong: "rgba(109,40,217,0.13)",
                  border: "rgba(109,40,217,0.18)",
                },
                {
                  bar: "#047857",
                  grad: "linear-gradient(135deg,#059669,#047857)",
                  light: "rgba(4,120,87,0.07)",
                  lightStrong: "rgba(4,120,87,0.13)",
                  border: "rgba(4,120,87,0.18)",
                },
              ];
              const ac = accents[idx % accents.length];
              const cardKey = `${svc.id || "service"}-${idx}`;

              return (
                <div
                  key={cardKey}
                  className="rounded-[20px] overflow-hidden flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    border: `1.5px solid ${ac.border}`,
                    boxShadow: `0 4px 20px ${ac.light}`,
                  }}
                >
                  {/* Accent top bar */}
                  <div
                    style={{
                      height: 4,
                      background: `linear-gradient(90deg,${ac.bar},${ac.bar}55,transparent)`,
                    }}
                  />

                  <div
                    style={{
                      padding: "24px 22px 22px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: `linear-gradient(135deg,${ac.bar}cc,${ac.bar})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 4px 12px ${ac.light}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {(svc.duration?.replace(/[^\d]/g, "") || "60") +
                            " min"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 5,
                        }}
                      >
                        {svc.level && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.09em",
                              color: ac.bar,
                              background: `${ac.bar}12`,
                              border: `1px solid ${ac.bar}28`,
                              padding: "3px 9px",
                              borderRadius: 100,
                            }}
                          >
                            {svc.level}
                          </span>
                        )}
                        {hasDsc && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: "#c2410c",
                              background: "#fff7ed",
                              border: "1px solid #fde8cc",
                              padding: "3px 9px",
                              borderRadius: 100,
                            }}
                          >
                            {s.discount.type === "percentage"
                              ? `${s.discount.value}% OFF`
                              : `Save ₹${s.discount.value}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title + desc */}
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.3,
                        marginBottom: 8,
                      }}
                    >
                      {svc.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.7,
                        marginBottom: 16,
                        flex: 1,
                      }}
                    >
                      {svc.value}
                    </p>

                    {/* Features */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 18,
                      }}
                    >
                      {svc.points.map((point: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 5,
                              background: ac.light,
                              border: `1px solid ${ac.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Check
                              style={{ width: 10, height: 10, color: ac.bar }}
                              strokeWidth={3}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background: `linear-gradient(90deg,${ac.border},transparent)`,
                        marginBottom: 18,
                      }}
                    />

                    {/* Price block — prominent */}
                    <div
                      style={{
                        background: ac.light,
                        borderRadius: 12,
                        padding: "14px 16px",
                        marginBottom: 14,
                      }}
                    >
                      {hasDsc && (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#94a3b8",
                            textDecoration: "line-through",
                            lineHeight: 1,
                            marginBottom: 4,
                          }}
                        >
                          ₹{svc.price}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 800,
                          color: ac.bar,
                          lineHeight: 1,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        ₹{basePrice}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: 500,
                          marginTop: 5,
                        }}
                      >
                        excl. GST · +₹{gst} (18%)
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className="prc-book-btn w-full"
                      onClick={() => handleBook(svc.id)}
                      style={{
                        padding: "12px",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        background: `linear-gradient(135deg,${ac.bar}dd,${ac.bar})`,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: `0 4px 14px ${ac.light}`,
                      }}
                    >
                      {pricingData.ctaButtonText || "Book Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Stats strip ── */}
          {pricingData.showStats && (
            <div
              className="pt-8"
              style={{ borderTop: "1px solid rgba(29,78,216,0.08)" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                  gap: 10,
                }}
              >
                {pricingData.stats.map(
                  (item: { stat: string; desc: string }, i: number) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border p-4 text-center"
                      style={{ borderColor: "rgba(29,78,216,0.10)" }}
                    >
                      <p
                        style={{
                          fontSize: "clamp(22px,2.8vw,30px)",
                          fontWeight: 700,
                          color: "#1d4ed8",
                          lineHeight: 1,
                          marginBottom: 4,
                        }}
                      >
                        {item.stat}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.10em",
                          color: "#94a3b8",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
