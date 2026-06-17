// "use client";
//
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award,
//   Search, ChevronDown, X, Play, CheckCircle, Tag,
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import StandardFooter from "@/components/StandardFooter";
// import { useAuth } from "@/context/AuthContext";
// import { getAuthToken } from "@/lib/api";
//
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//
// const BRAND      = "#2563eb";
// const BRAND_DEEP = "#1d4ed8";
// const PAPER      = "#F8F6F1";
// const INK        = "#0f172a";
// const MUTED      = "#64748b";
//
// interface Course {
//   _id: string;
//   title: string;
//   shortDescription?: string;
//   contentType: "free" | "paid" | "exclusive";
//   category: string;
//   difficulty?: string;
//   price?: number;
//   discountPrice?: number | null;
//   discount?: { type: string; value: number; isActive: boolean };
//   thumbnail?: string;
//   totalDuration?: number;
//   certificateEnabled?: boolean;
//   analytics?: { enrollments: number; averageRating: number };
//   mentorId: { name: string; designation: string; company?: string };
//   enrollment?: { progress: number };
//   totalLectures?: number;
//   modules?: { title: string }[];
// }
//
// const CAT_LABEL: Record<string, string> = {
//   "mock-interview":  "Mock Interview",
//   "resume-building": "Resume Building",
//   "gd-practice":     "Group Discussion",
//   "placement-prep":  "Placement Prep",
//   "skills":          "Skills",
//   "career-growth":   "Career Growth",
//   "coding":          "Coding",
//   "system-design":   "System Design",
//   "behavioral":      "Behavioral",
//   "other":           "Other",
// };
//
// const CATEGORIES = [
//   { value: "", label: "All" },
//   { value: "mock-interview",  label: "Mock Interview" },
//   { value: "resume-building", label: "Resume" },
//   { value: "gd-practice",     label: "Group Discussion" },
//   { value: "placement-prep",  label: "Placement Prep" },
//   { value: "coding",          label: "Coding" },
//   { value: "behavioral",      label: "Behavioral" },
//   { value: "career-growth",   label: "Career Growth" },
// ];
//
// const DIFF_DOT: Record<string, string> = {
//   beginner:     "#10b981",
//   intermediate: "#2563eb",
//   advanced:     "#f97316",
//   expert:       "#ef4444",
// };
//
// /* ─── Course Card ─── */
// function CourseCard({ course, delay = 0, isLoggedIn = false }: { course: Course; delay?: number; isLoggedIn?: boolean }) {
//   const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
//   const isEnrolled = !!course.enrollment;
//   const pct        = course.enrollment?.progress ?? 0;
//   const inits      = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//
//   const hasDiscount = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
//   const effectivePrice = hasDiscount && course.discountPrice != null ? course.discountPrice : (course.price ?? 0);
//   const discountLabel = hasDiscount
//     ? course.discount!.type === "percentage"
//       ? `${course.discount!.value}% OFF`
//       : `₹${course.discount!.value} OFF`
//     : null;
//
//   const green     = "#059669";
//   const accentClr = isEnrolled ? green : BRAND;
//   const borderClr = isEnrolled ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.18)";
//   const accentBar = isEnrolled
//     ? "linear-gradient(90deg,#10b981,#05966955,transparent)"
//     : `linear-gradient(90deg,${BRAND},${BRAND_DEEP}55,transparent)`;
//   const previewHref = `/courses/${course._id}`;
//   const enrollHref  = isEnrolled
//     ? `/dashboard/content/${course._id}`
//     : isLoggedIn
//       ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
//       : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;
//
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
//       style={{
//         display: "flex", flexDirection: "column", height: "100%",
//         borderRadius: 20, overflow: "hidden",
//         background: "#fff",
//         border: `1.5px solid ${borderClr}`,
//         boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
//         willChange: "transform",
//       }}
//       whileHover={{ translateY: -4, boxShadow: "0 14px 40px rgba(37,99,235,0.13)" }}
//     >
//       {/* Accent bar */}
//       <div style={{ height: 3, background: accentBar, flexShrink: 0 }} />
//
//       {/* Thumbnail */}
//       <div style={{ height: 172, flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", position: "relative" }}>
//         {course.thumbnail
//           ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//           : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <BookOpen style={{ width: 44, height: 44, color: "rgba(255,255,255,0.18)" }} />
//             </div>
//         }
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.18),transparent 55%)" }} />
//       </div>
//
//       {/* Body */}
//       <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 18px 18px", gap: 9 }}>
//
//         {/* Chips — category + type + difficulty + cert inline */}
//         <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
//           <span style={{
//             fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
//             padding: "2px 8px", borderRadius: 99,
//             background: "rgba(37,99,235,0.08)", color: BRAND, border: "1px solid rgba(37,99,235,0.15)",
//           }}>
//             {CAT_LABEL[course.category] ?? course.category}
//           </span>
//           {isEnrolled
//             ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 7px", borderRadius: 99 }}>
//                 <CheckCircle style={{ width: 8, height: 8 }} /> Enrolled
//               </span>
//             : isPaid
//               ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#eff6ff", color: BRAND, border: "1px solid rgba(37,99,235,0.2)" }}>Paid</span>
//               : <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#f0fdf4", color: green, border: "1px solid #bbf7d0" }}>Free</span>
//           }
//           {course.difficulty && (
//             <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, color: MUTED }}>
//               <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
//               {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
//             </span>
//           )}
//           {course.certificateEnabled && (
//             <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: 99 }}>
//               <Award style={{ width: 8, height: 8 }} /> Cert
//             </span>
//           )}
//         </div>
//
//         {/* Title */}
//         <h3 style={{
//           fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0, color: INK,
//           display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
//         }}>
//           {course.title}
//         </h3>
//
//         {/* Description */}
//         {course.shortDescription && (
//           <p style={{
//             fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0, flex: 1,
//             display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
//           }}>
//             {course.shortDescription}
//           </p>
//         )}
//
//         {/* Instructor + stats */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(37,99,235,0.07)", marginTop: "auto" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
//             <div style={{
//               width: 26, height: 26, borderRadius: 7, flexShrink: 0,
//               background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               color: "#fff", fontSize: 9, fontWeight: 700,
//             }}>
//               {inits}
//             </div>
//             <span style={{ fontSize: 11.5, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//               {course.mentorId.name}
//             </span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//             {(course.analytics?.averageRating ?? 0) > 0 && (
//               <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: MUTED }}>
//                 <Star style={{ width: 10, height: 10, color: "#f59e0b", fill: "#f59e0b" }} />
//                 {course.analytics!.averageRating.toFixed(1)}
//               </span>
//             )}
//             {(course.modules?.length ?? 0) > 0 && (
//               <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED }}>
//                 <BookOpen style={{ width: 10, height: 10 }} />
//                 {course.modules!.length} mod
//               </span>
//             )}
//             {(course.totalDuration ?? 0) > 0 && (
//               <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED }}>
//                 <Clock style={{ width: 10, height: 10 }} />
//                 {course.totalDuration}m
//               </span>
//             )}
//           </div>
//         </div>
//
//         {/* Divider */}
//         <div style={{ height: 1, background: `linear-gradient(90deg,${borderClr},transparent)` }} />
//
//         {/* Price box + CTAs */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {/* Price row */}
//           <div style={{ background: isEnrolled ? "rgba(5,150,105,0.07)" : "rgba(37,99,235,0.06)", borderRadius: 10, padding: "8px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             {isEnrolled ? (
//               <div>
//                 <div style={{ fontSize: 12, fontWeight: 700, color: accentClr, lineHeight: 1 }}>
//                   {pct >= 100 ? "Completed" : pct > 0 ? "In Progress" : "Enrolled"}
//                 </div>
//                 {pct > 0 && pct < 100 && (
//                   <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: "rgba(37,99,235,0.12)", overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
//                   </div>
//                 )}
//               </div>
//             ) : isPaid && (course.price ?? 0) > 0 ? (
//               <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
//                 <span style={{ fontSize: 17, fontWeight: 800, color: BRAND, lineHeight: 1, letterSpacing: "-0.02em" }}>₹{effectivePrice}</span>
//                 {hasDiscount && <span style={{ fontSize: 11, color: MUTED, textDecoration: "line-through" }}>₹{course.price}</span>}
//                 <span style={{ fontSize: 9.5, color: MUTED, fontWeight: 500 }}>excl. GST</span>
//               </div>
//             ) : (
//               <div style={{ fontSize: 15, fontWeight: 800, color: green, lineHeight: 1 }}>Free</div>
//             )}
//             {discountLabel && (
//               <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#f97316,#ea580c)", padding: "2px 7px", borderRadius: 99 }}>
//                 <Tag style={{ width: 7, height: 7 }} />{discountLabel}
//               </span>
//             )}
//           </div>
//
//           {/* CTA buttons */}
//           {isEnrolled ? (
//             <Link
//               href={`/dashboard/content/${course._id}`}
//               style={{
//                 padding: "9px 0", borderRadius: 10, width: "100%",
//                 fontSize: 12, fontWeight: 700, color: "#fff",
//                 background: "linear-gradient(135deg,#10b981,#059669)",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
//                 textDecoration: "none",
//                 boxShadow: "0 3px 10px rgba(5,150,105,0.28)",
//               }}
//             >
//               <Play style={{ width: 11, height: 11, fill: "#fff" }} /> {pct >= 100 ? "Review" : pct > 0 ? "Continue" : "Start"}
//             </Link>
//           ) : (
//             <div style={{ display: "flex", gap: 6 }}>
//               <Link
//                 href={previewHref}
//                 style={{
//                   flex: 1, padding: "9px 0", borderRadius: 10,
//                   fontSize: 11.5, fontWeight: 700, color: BRAND,
//                   background: "rgba(37,99,235,0.08)", border: "1.5px solid rgba(37,99,235,0.22)",
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
//                   textDecoration: "none",
//                 }}
//               >
//                 <Play style={{ width: 10, height: 10, fill: BRAND }} /> Free Preview
//               </Link>
//               <Link
//                 href={enrollHref}
//                 style={{
//                   flex: 1, padding: "9px 0", borderRadius: 10,
//                   fontSize: 11.5, fontWeight: 700, color: "#fff",
//                   background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
//                   textDecoration: "none",
//                   boxShadow: "0 3px 10px rgba(37,99,235,0.24)",
//                 }}
//               >
//                 {isPaid ? <><Lock style={{ width: 10, height: 10 }} /> Enroll</> : <><Play style={{ width: 10, height: 10, fill: "#fff" }} /> Enroll</>}
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
//
// function SkeletonCard() {
//   return (
//     <div style={{
//       height: 400, borderRadius: 20,
//       background: "rgba(255,255,255,0.72)",
//       border: "1px solid rgba(29,78,216,0.08)",
//     }} className="animate-pulse" />
//   );
// }
//
// /* ─── Page ─── */
// export default function CoursesPage() {
//   const { isLoggedIn } = useAuth();
//   const [courses, setCourses]   = useState<Course[]>([]);
//   const [filtered, setFiltered] = useState<Course[]>([]);
//   const [isLoading, setLoading] = useState(true);
//   const [search, setSearch]     = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType]         = useState<"" | "free" | "paid">("");
//
//   useEffect(() => {
//     const token = getAuthToken();
//
//     const publicFetch = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`)
//       .then(r => r.json());
//
//     const enrollFetch = token
//       ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
//           .then(r => r.json()).catch(() => ({ success: false }))
//       : Promise.resolve({ success: false });
//
//     Promise.all([publicFetch, enrollFetch])
//       .then(([pubData, enrollData]) => {
//         let list: Course[] = pubData.success ? pubData.data.courses || [] : [];
//         if (enrollData.success && Array.isArray(enrollData.data)) {
//           const enrollMap = new Map<string, { progress: number }>();
//           enrollData.data.forEach((e: any) => {
//             const id = e.courseId?._id ?? e.courseId;
//             if (id) enrollMap.set(id, { progress: e.progress || 0 });
//           });
//           list = list.map(c => enrollMap.has(c._id) ? { ...c, enrollment: enrollMap.get(c._id) } : c);
//         }
//         setCourses(list);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [isLoggedIn]);
//
//   useEffect(() => {
//     let r = [...courses];
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       r = r.filter(c =>
//         c.title.toLowerCase().includes(q) ||
//         (c.shortDescription ?? "").toLowerCase().includes(q) ||
//         (CAT_LABEL[c.category] ?? c.category).toLowerCase().includes(q)
//       );
//     }
//     if (category) r = r.filter(c => c.category === category);
//     if (type === "free") r = r.filter(c => c.contentType === "free");
//     if (type === "paid") r = r.filter(c => c.contentType !== "free");
//     setFiltered(r);
//   }, [courses, search, category, type]);
//
//   const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
//   const freeCnt = courses.filter(c => c.contentType === "free").length;
//   const hasFilters = search || category || type;
//
//   const STATS = [
//     { val: `${courses.length}+`, label: "Courses" },
//     { val: totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+", label: "Enrolled" },
//     { val: `${freeCnt}`, label: "Free" },
//     { val: "4.9★", label: "Avg rating" },
//   ];
//
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
//         .lc2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .si:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
//         .fs { appearance: none; }
//         .fs:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
//       `}</style>
//
//       <div style={{
//         background: PAPER,
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         minHeight: "100vh",
//         position: "relative",
//       }}>
//         <Navbar />
//
//         {/* ── Hero ── */}
//         <section style={{
//           position: "relative",
//           paddingTop: "calc(var(--yic-header-h, 64px) + 52px)",
//           paddingBottom: 52,
//           overflow: "hidden",
//           background: PAPER,
//         }}>
//           {/* Grid pattern */}
//           <div style={{
//             position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
//             backgroundImage:
//               "linear-gradient(rgba(59,130,246,0.055) 1px, transparent 1px)," +
//               "linear-gradient(90deg, rgba(59,130,246,0.055) 1px, transparent 1px)",
//             backgroundSize: "48px 48px",
//             maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
//             WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
//           }} />
//           <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
//           <div style={{ position: "absolute", bottom: "0%", left: "3%", width: 340, height: 340, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
//
//           <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
//             <motion.div
//               initial={{ opacity: 0, y: 22 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//             >
//               {/* Eyebrow */}
//               <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                 <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
//                 <div style={{
//                   display: "inline-flex", alignItems: "center", gap: 7,
//                   padding: "6px 14px", borderRadius: 99,
//                   background: "#2563eb14", border: "1px solid #2563eb33",
//                 }}>
//                   <Sparkles size={11} style={{ color: BRAND }} />
//                   <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: "0.12em", textTransform: "uppercase" }}>
//                     All Courses
//                   </span>
//                 </div>
//                 <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
//               </div>
//
//               <h1 style={{
//                 margin: "0 0 14px",
//                 fontSize: "clamp(34px, 5vw, 64px)",
//                 lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 700,
//                 color: INK, fontFamily: "'DM Sans', system-ui, sans-serif",
//               }}>
//                 Learn from{" "}
//                 <span style={{ position: "relative", display: "inline-block", color: BRAND }}>
//                   the best.
//                   <motion.span
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
//                     style={{
//                       position: "absolute", left: 0, right: 0, bottom: -3,
//                       height: 3, borderRadius: 2,
//                       background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
//                       transformOrigin: "left", display: "block",
//                     }}
//                   />
//                 </span>
//               </h1>
//
//               <p style={{
//                 fontSize: "clamp(14px,1.25vw,16.5px)",
//                 color: MUTED, lineHeight: 1.7, maxWidth: 520,
//                 marginBottom: 28, fontWeight: 400,
//               }}>
//                 Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
//                 {!isLoggedIn && " Sign in to track progress and earn certificates."}
//               </p>
//
//               {/* Stats pill */}
//               <div style={{
//                 display: "inline-flex", alignItems: "center",
//                 gap: "clamp(12px,3vw,36px)", flexWrap: "wrap",
//                 padding: "13px 22px", borderRadius: 99,
//                 background: "#fff", border: "1px solid #2563eb1a",
//                 boxShadow: "0 8px 28px #2563eb12",
//               }}>
//                 {STATS.map(s => (
//                   <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
//                     <span style={{ fontSize: "clamp(13px,1.4vw,17px)", fontWeight: 800, color: BRAND, letterSpacing: "-0.02em" }}>{s.val}</span>
//                     <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </section>
//
//         {/* ── Sticky Filter Bar ── */}
//         <div style={{
//           background: "rgba(248,246,241,0.92)",
//           backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
//           borderTop: "1px solid rgba(29,78,216,0.08)",
//           borderBottom: "1px solid rgba(29,78,216,0.08)",
//           position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
//         }}>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
//
//               {/* Search */}
//               <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0, maxWidth: 300 }}>
//                 <Search style={{
//                   position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
//                   width: 14, height: 14, color: "#94a3b8", pointerEvents: "none",
//                 }} />
//                 <input
//                   type="text"
//                   placeholder="Search courses…"
//                   value={search}
//                   onChange={e => setSearch(e.target.value)}
//                   className="si"
//                   style={{
//                     width: "100%", paddingLeft: 34, paddingRight: search ? 32 : 12,
//                     paddingTop: 8, paddingBottom: 8,
//                     border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
//                     fontSize: 13, fontFamily: "inherit", color: INK,
//                     background: "rgba(255,255,255,0.9)",
//                     transition: "border-color 0.2s, box-shadow 0.2s",
//                     boxSizing: "border-box",
//                   }}
//                 />
//                 {search && (
//                   <button onClick={() => setSearch("")} style={{
//                     position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
//                     background: "none", border: "none", cursor: "pointer", padding: 0,
//                     display: "flex", alignItems: "center",
//                   }}>
//                     <X style={{ width: 13, height: 13, color: "#94a3b8" }} />
//                   </button>
//                 )}
//               </div>
//
//               {/* Category dropdown */}
//               <div style={{ position: "relative", flexShrink: 0 }}>
//                 <select
//                   value={category}
//                   onChange={e => setCategory(e.target.value)}
//                   className="fs"
//                   style={{
//                     paddingLeft: 12, paddingRight: 32, paddingTop: 8, paddingBottom: 8,
//                     border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
//                     fontSize: 13, fontFamily: "inherit", color: INK,
//                     background: "rgba(255,255,255,0.9)", cursor: "pointer",
//                     transition: "border-color 0.2s, box-shadow 0.2s",
//                   }}
//                 >
//                   {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//                 </select>
//                 <ChevronDown style={{
//                   position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//                   width: 12, height: 12, color: "#94a3b8", pointerEvents: "none",
//                 }} />
//               </div>
//
//               {/* Type pills */}
//               <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
//                 {(["", "free", "paid"] as const).map(t => (
//                   <button
//                     key={t}
//                     onClick={() => setType(t)}
//                     style={{
//                       padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
//                       border: "1px solid",
//                       borderColor: type === t ? BRAND : "rgba(29,78,216,0.18)",
//                       background: type === t ? BRAND : "rgba(255,255,255,0.9)",
//                       color: type === t ? "#fff" : MUTED,
//                       cursor: "pointer", fontFamily: "inherit",
//                       transition: "all 0.18s",
//                       boxShadow: type === t ? "0 4px 12px rgba(37,99,235,0.22)" : "none",
//                     }}
//                   >
//                     {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
//                   </button>
//                 ))}
//               </div>
//
//               {/* Clear filters */}
//               {hasFilters && (
//                 <button
//                   onClick={() => { setSearch(""); setCategory(""); setType(""); }}
//                   style={{
//                     display: "inline-flex", alignItems: "center", gap: 5,
//                     padding: "6px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
//                     border: "1px solid rgba(239,68,68,0.3)", background: "#fef2f2",
//                     color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
//                     transition: "all 0.15s", flexShrink: 0,
//                   }}
//                 >
//                   <X style={{ width: 11, height: 11 }} /> Clear
//                 </button>
//               )}
//
//               {!isLoading && (
//                 <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap", flexShrink: 0 }}>
//                   {filtered.length} course{filtered.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//
//             {/* Category scroll tabs — mobile */}
//             <div className="flex sm:hidden gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
//               {CATEGORIES.map(c => (
//                 <button
//                   key={c.value}
//                   onClick={() => setCategory(c.value)}
//                   style={{
//                     flexShrink: 0, padding: "5px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
//                     border: "1px solid",
//                     borderColor: category === c.value ? BRAND : "rgba(29,78,216,0.15)",
//                     background: category === c.value ? BRAND : "rgba(255,255,255,0.9)",
//                     color: category === c.value ? "#fff" : MUTED,
//                     cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
//                     transition: "all 0.18s",
//                   }}
//                 >
//                   {c.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//
//         {/* ── Courses Grid ── */}
//         <section style={{ background: PAPER, position: "relative" }}>
//           {/* Ambient blobs */}
//           <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
//             <div style={{ position: "absolute", top: "15%", left: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.055) 0%,transparent 70%)", filter: "blur(80px)" }} />
//             <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.045) 0%,transparent 70%)", filter: "blur(80px)" }} />
//           </div>
//
//           <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
//               </div>
//             ) : filtered.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 style={{
//                   borderRadius: 20, padding: "clamp(40px,6vw,72px) clamp(24px,6vw,56px)",
//                   textAlign: "center",
//                   background: "rgba(255,255,255,0.72)",
//                   border: "1px solid rgba(29,78,216,0.09)",
//                   boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
//                   backdropFilter: "blur(12px)",
//                 }}
//               >
//                 <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 14px" }} />
//                 <p style={{ color: INK, fontWeight: 700, fontSize: 17, marginBottom: 8, letterSpacing: "-0.02em" }}>
//                   {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
//                 </p>
//                 <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6 }}>
//                   {courses.length === 0
//                     ? "We're building something great. Check back shortly."
//                     : "Try clearing the search or changing the category."}
//                 </p>
//                 {hasFilters && (
//                   <button
//                     onClick={() => { setSearch(""); setCategory(""); setType(""); }}
//                     style={{
//                       marginTop: 20, padding: "10px 24px", borderRadius: 12,
//                       background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
//                       color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
//                       border: "none", fontFamily: "inherit",
//                       boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
//                     }}
//                   >
//                     Clear filters
//                   </button>
//                 )}
//               </motion.div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 <AnimatePresence mode="popLayout">
//                   {filtered.map((c, i) => (
//                     <CourseCard key={c._id} course={c} delay={Math.min(i * 0.035, 0.2)} isLoggedIn={isLoggedIn} />
//                   ))}
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>
//         </section>
//
//         {/* ── Guest CTA Banner ── */}
//         {!isLoggedIn && !isLoading && (
//           <section style={{ background: PAPER }}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
//               <motion.div
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
//                 style={{
//                   borderRadius: 20, padding: "clamp(24px,4vw,36px) clamp(20px,5vw,44px)",
//                   background: "rgba(255,255,255,0.82)",
//                   border: "1px solid rgba(29,78,216,0.14)",
//                   boxShadow: "0 16px 48px rgba(29,78,216,0.09), 0 4px 12px rgba(29,78,216,0.05)",
//                   backdropFilter: "blur(16px)",
//                   display: "flex", flexWrap: "wrap", alignItems: "center",
//                   justifyContent: "space-between", gap: 20,
//                   position: "relative", overflow: "hidden",
//                 }}
//               >
//                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }} />
//                 <div>
//                   <p style={{ color: INK, fontWeight: 700, fontSize: "clamp(15px,2vw,18px)", margin: 0, letterSpacing: "-0.02em" }}>
//                     Full access — sign in once, learn forever.
//                   </p>
//                   <p style={{ color: MUTED, fontSize: 13, marginTop: 4, fontWeight: 400 }}>
//                     Track progress, earn certificates, and unlock every premium course.
//                   </p>
//                 </div>
//                 <Link
//                   href="/login?redirect=/dashboard/content"
//                   style={{
//                     display: "inline-flex", alignItems: "center", gap: 8,
//                     padding: "11px 24px", borderRadius: 12, flexShrink: 0,
//                     background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
//                     color: "#fff", fontWeight: 700, fontSize: 13.5, textDecoration: "none",
//                     boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
//                     transition: "transform 0.18s, box-shadow 0.2s",
//                   }}
//                   className="hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.40)]"
//                 >
//                   Sign in to get started <ArrowRight style={{ width: 14, height: 14 }} />
//                 </Link>
//               </motion.div>
//             </div>
//           </section>
//         )}
//
//         <StandardFooter />
//       </div>
//     </>
//   );
// }




"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award,
    Search, ChevronDown, X, Play, CheckCircle, Tag,
    Mic, FileText, Users, Briefcase, Code2, Brain, TrendingUp,
    Bell, BellRing, CalendarClock, HelpCircle, Plus, Minus, GraduationCap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER      = "#F8F6F1";
const INK        = "#0f172a";
const MUTED      = "#64748b";
const SUCCESS    = "#059669";
const MONO       = "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace";

interface Course {
    _id: string;
    title: string;
    shortDescription?: string;
    contentType: "free" | "paid" | "exclusive";
    category: string;
    difficulty?: string;
    price?: number;
    discountPrice?: number | null;
    discount?: { type: string; value: number; isActive: boolean };
    thumbnail?: string;
    totalDuration?: number;
    certificateEnabled?: boolean;
    analytics?: { enrollments: number; averageRating: number };
    mentorId: { name: string; designation: string; company?: string };
    enrollment?: { progress: number };
    totalLectures?: number;
    modules?: { title: string }[];
}

const CAT_LABEL: Record<string, string> = {
    "mock-interview":  "Mock Interview",
    "resume-building": "Resume Building",
    "gd-practice":     "Group Discussion",
    "placement-prep":  "Placement Prep",
    "skills":          "Skills",
    "soft-skills":     "Soft Skills",
    "career-growth":   "Career Growth",
    "coding":          "Coding",
    "system-design":   "System Design",
    "behavioral":      "Behavioral",
    "other":           "Other",
};

const CATEGORIES = [
    { value: "", label: "All" },
    { value: "mock-interview",  label: "Mock Interview" },
    { value: "resume-building", label: "Resume" },
    { value: "gd-practice",     label: "Group Discussion" },
    { value: "placement-prep",  label: "Placement Prep" },
    { value: "coding",          label: "Coding" },
    { value: "behavioral",      label: "Behavioral" },
    { value: "career-growth",   label: "Career Growth" },
];

const DIFF_DOT: Record<string, string> = {
    beginner:     "#10b981",
    intermediate: "#2563eb",
    advanced:     "#f97316",
    expert:       "#ef4444",
};

/* Quick-nav onto the existing category filter — same values CATEGORIES already uses */
const PREP_TRACKS: { value: string; label: string; blurb: string; icon: React.ElementType }[] = [
    { value: "mock-interview",  label: "Mock Interviews",  blurb: "Live practice rounds",   icon: Mic },
    { value: "resume-building", label: "Resume Building",  blurb: "ATS-ready resumes",      icon: FileText },
    { value: "gd-practice",     label: "Group Discussion", blurb: "Structured GD drills",   icon: Users },
    { value: "placement-prep",  label: "Placement Prep",   blurb: "End-to-end prep plans",  icon: Briefcase },
    { value: "coding",          label: "Coding",           blurb: "DSA & problem solving",  icon: Code2 },
    { value: "behavioral",      label: "Behavioral",       blurb: "STAR-method answers",    icon: Brain },
    { value: "career-growth",   label: "Career Growth",    blurb: "Beyond your first job",  icon: TrendingUp },
];

/* Dummy placeholders — soft-skill tracks in the works, not real course records from the API.
   Images are stock placeholders (Lorem Picsum); swap in real thumbnails when these go live. */
type ComingSoonItem = { id: string; title: string; category: string; difficulty: string; blurb: string; image: string };
const COMING_SOON: ComingSoonItem[] = [
    { id: "cs-1", title: "Professional Communication Masterclass", category: "soft-skills", difficulty: "beginner",     blurb: "Build clear, confident communication for emails, meetings, and one-on-ones with stakeholders.",  image: "https://picsum.photos/id/1011/600/760" },
    { id: "cs-2", title: "Public Speaking & Presentation Skills",  category: "soft-skills", difficulty: "intermediate", blurb: "Conquer stage fright and deliver compelling presentations that keep every audience engaged.",    image: "https://picsum.photos/id/1015/600/760" },
    { id: "cs-3", title: "Emotional Intelligence at Work",         category: "soft-skills", difficulty: "beginner",     blurb: "Understand and manage emotions — yours and your team's — to build stronger working relationships.", image: "https://picsum.photos/id/1025/600/760" },
    { id: "cs-4", title: "Leadership & Team Management",           category: "soft-skills", difficulty: "intermediate", blurb: "Practical frameworks for leading teams, giving feedback, and driving outcomes without authority.",   image: "https://picsum.photos/id/1035/600/760" },
    { id: "cs-5", title: "Conflict Resolution & Negotiation",      category: "soft-skills", difficulty: "intermediate", blurb: "Navigate disagreements and negotiate outcomes that work for everyone — in interviews and at work.", image: "https://picsum.photos/id/1043/600/760" },
    { id: "cs-6", title: "Time Management & Productivity",         category: "soft-skills", difficulty: "beginner",     blurb: "Proven systems to prioritise ruthlessly, eliminate distractions, and ship work that matters.",       image: "https://picsum.photos/id/1050/600/760" },
    { id: "cs-7", title: "Networking & Personal Branding",         category: "soft-skills", difficulty: "beginner",     blurb: "Build a professional network that opens doors — LinkedIn, referrals, industry events, and beyond.",  image: "https://picsum.photos/id/1062/600/760" },
    { id: "cs-8", title: "Critical Thinking & Problem Solving",    category: "soft-skills", difficulty: "advanced",     blurb: "Structured mental models to break down ambiguous problems and communicate solutions under pressure.",  image: "https://picsum.photos/id/1074/600/760" },
];

const STEPS = [
    { n: "01", title: "Pick your track",  body: "Browse mock interviews, resume building, GD, coding and more — filter by what you need right now." },
    { n: "02", title: "Learn & practice", body: "Work through mentor-led lessons and hands-on drills at your own pace, on your own schedule." },
    { n: "03", title: "Get certified",    body: "Finish strong and add a verifiable certificate to your profile when a course supports it." },
];

const FAQS = [
    { q: "Do I get a certificate after finishing a course?", a: "Yes — any course with the Cert badge issues a certificate once you complete it, ready to add to your profile or resume." },
    { q: "Can I preview a course before enrolling?",         a: "Every course has a free preview, so you can see the format, the mentor, and the structure before you commit." },
    { q: "What happens after I enroll in a paid course?",    a: "You get full access to all modules, downloadable resources, and any live sessions tied to that course." },
    { q: "Will free courses stay free?",                     a: "Yes — courses currently marked Free remain free to access." },
];

/* ─── Readiness card — hero signature element ─── */
function ReadinessCard() {
    const items = [
        { label: "Resume reviewed", done: true },
        { label: "Aptitude round",  done: true },
        { label: "Technical round", done: false },
        { label: "HR round",        done: false },
    ];
    const doneCount = items.filter(i => i.done).length;
    const pct = Math.round((doneCount / items.length) * 100);
    const r = 28, circumference = 2 * Math.PI * r;

    return (
        <motion.div
            initial={{ opacity: 0, y: 26, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
                width: 264, background: "#fff", borderRadius: 18,
                border: "1px solid rgba(29,78,216,0.12)",
                boxShadow: "0 28px 60px rgba(15,23,42,0.16)",
                padding: 18,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9.5, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em" }}>
      <motion.span
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: SUCCESS, display: "inline-block" }}
      />
      Readiness Tracker
    </span>
                <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.04em" }}>SAMPLE</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth="6" />
                    <circle
                        cx="30" cy="30" r={r} fill="none" stroke={BRAND} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (pct / 100) * circumference}
                        transform="rotate(-90 30 30)"
                    />
                    <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight={700} fontFamily={MONO} fill={INK}>{pct}%</text>
                </svg>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>Placement-ready</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{doneCount} of {items.length} stages cleared</div>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {items.map(it => (
                    <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: it.done ? INK : MUTED, fontWeight: it.done ? 600 : 500 }}>
                        {it.done
                            ? <CheckCircle style={{ width: 13, height: 13, color: SUCCESS, flexShrink: 0 }} />
                            : <span style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid #cbd5e1", flexShrink: 0, display: "inline-block" }} />}
                        {it.label}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* ─── Course Card ─── */
function CourseCard({ course, delay = 0, isLoggedIn = false }: { course: Course; delay?: number; isLoggedIn?: boolean }) {
    const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
    const isEnrolled = !!course.enrollment;
    const pct        = course.enrollment?.progress ?? 0;
    const inits      = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const hasDiscount = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
    const effectivePrice = hasDiscount && course.discountPrice != null ? course.discountPrice : (course.price ?? 0);
    const discountLabel = hasDiscount
        ? course.discount!.type === "percentage"
            ? `${course.discount!.value}% OFF`
            : `₹${course.discount!.value} OFF`
        : null;

    const green     = "#059669";
    const accentClr = isEnrolled ? green : BRAND;
    const borderClr = isEnrolled ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.18)";
    const accentBar = isEnrolled
        ? "linear-gradient(90deg,#10b981,#05966955,transparent)"
        : `linear-gradient(90deg,${BRAND},${BRAND_DEEP}55,transparent)`;
    const previewHref = `/courses/${course._id}`;
    const enrollHref  = isEnrolled
        ? `/dashboard/content/${course._id}`
        : isLoggedIn
            ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
            : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
            style={{
                display: "flex", flexDirection: "column", height: "100%",
                borderRadius: 20, overflow: "hidden",
                background: "#fff",
                border: `1.5px solid ${borderClr}`,
                boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
                willChange: "transform",
            }}
            whileHover={{ translateY: -4, boxShadow: "0 14px 40px rgba(37,99,235,0.13)" }}
        >
            {/* Accent bar */}
            <div style={{ height: 3, background: accentBar, flexShrink: 0 }} />

            {/* Thumbnail */}
            <div style={{ height: 172, flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", position: "relative" }}>
                {course.thumbnail
                    ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BookOpen style={{ width: 44, height: 44, color: "rgba(255,255,255,0.18)" }} />
                    </div>
                }
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.18),transparent 55%)" }} />
            </div>

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 18px 18px", gap: 9 }}>

                {/* Chips — category + type + difficulty + cert inline */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
          padding: "2px 8px", borderRadius: 99,
          background: "rgba(37,99,235,0.08)", color: BRAND, border: "1px solid rgba(37,99,235,0.15)",
      }}>
        {CAT_LABEL[course.category] ?? course.category}
      </span>
                    {isEnrolled
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 7px", borderRadius: 99 }}>
            <CheckCircle style={{ width: 8, height: 8 }} /> Enrolled
          </span>
                        : isPaid
                            ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#eff6ff", color: BRAND, border: "1px solid rgba(37,99,235,0.2)" }}>Paid</span>
                            : <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#f0fdf4", color: green, border: "1px solid #bbf7d0" }}>Free</span>
                    }
                    {course.difficulty && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, color: MUTED }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
        </span>
                    )}
                    {course.certificateEnabled && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: 99 }}>
          <Award style={{ width: 8, height: 8 }} /> Cert
        </span>
                    )}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0, color: INK,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {course.title}
                </h3>

                {/* Description */}
                {course.shortDescription && (
                    <p style={{
                        fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0, flex: 1,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {course.shortDescription}
                    </p>
                )}

                {/* Instructor + stats */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(37,99,235,0.07)", marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                            background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 9, fontWeight: 700,
                        }}>
                            {inits}
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {course.mentorId.name}
        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {(course.analytics?.averageRating ?? 0) > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: MUTED, fontFamily: MONO }}>
            <Star style={{ width: 10, height: 10, color: "#f59e0b", fill: "#f59e0b" }} />
                                {course.analytics!.averageRating.toFixed(1)}
          </span>
                        )}
                        {(course.modules?.length ?? 0) > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED, fontFamily: MONO }}>
            <BookOpen style={{ width: 10, height: 10 }} />
                                {course.modules!.length} mod
          </span>
                        )}
                        {(course.totalDuration ?? 0) > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED, fontFamily: MONO }}>
            <Clock style={{ width: 10, height: 10 }} />
                                {course.totalDuration}m
          </span>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: `linear-gradient(90deg,${borderClr},transparent)` }} />

                {/* Price box + CTAs */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Price row */}
                    <div style={{ background: isEnrolled ? "rgba(5,150,105,0.07)" : "rgba(37,99,235,0.06)", borderRadius: 10, padding: "8px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {isEnrolled ? (
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: accentClr, lineHeight: 1 }}>
                                    {pct >= 100 ? "Completed" : pct > 0 ? "In Progress" : "Enrolled"}
                                </div>
                                {pct > 0 && pct < 100 && (
                                    <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: "rgba(37,99,235,0.12)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
                                    </div>
                                )}
                            </div>
                        ) : isPaid && (course.price ?? 0) > 0 ? (
                            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                                <span style={{ fontSize: 17, fontWeight: 800, color: BRAND, lineHeight: 1, letterSpacing: "-0.02em", fontFamily: MONO }}>₹{effectivePrice}</span>
                                {hasDiscount && <span style={{ fontSize: 11, color: MUTED, textDecoration: "line-through", fontFamily: MONO }}>₹{course.price}</span>}
                                <span style={{ fontSize: 9.5, color: MUTED, fontWeight: 500 }}>excl. GST</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: 15, fontWeight: 800, color: green, lineHeight: 1 }}>Free</div>
                        )}
                        {discountLabel && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#f97316,#ea580c)", padding: "2px 7px", borderRadius: 99, fontFamily: MONO }}>
            <Tag style={{ width: 7, height: 7 }} />{discountLabel}
          </span>
                        )}
                    </div>

                    {/* CTA buttons */}
                    {isEnrolled ? (
                        <Link
                            href={`/dashboard/content/${course._id}`}
                            style={{
                                padding: "9px 0", borderRadius: 10, width: "100%",
                                fontSize: 12, fontWeight: 700, color: "#fff",
                                background: "linear-gradient(135deg,#10b981,#059669)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                                textDecoration: "none",
                                boxShadow: "0 3px 10px rgba(5,150,105,0.28)",
                            }}
                        >
                            <Play style={{ width: 11, height: 11, fill: "#fff" }} /> {pct >= 100 ? "Review" : pct > 0 ? "Continue" : "Start"}
                        </Link>
                    ) : (
                        <div style={{ display: "flex", gap: 6 }}>
                            <Link
                                href={previewHref}
                                style={{
                                    flex: 1, padding: "9px 0", borderRadius: 10,
                                    fontSize: 11.5, fontWeight: 700, color: BRAND,
                                    background: "rgba(37,99,235,0.08)", border: "1.5px solid rgba(37,99,235,0.22)",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                                    textDecoration: "none",
                                }}
                            >
                                <Play style={{ width: 10, height: 10, fill: BRAND }} /> Free Preview
                            </Link>
                            <Link
                                href={enrollHref}
                                style={{
                                    flex: 1, padding: "9px 0", borderRadius: 10,
                                    fontSize: 11.5, fontWeight: 700, color: "#fff",
                                    background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                                    textDecoration: "none",
                                    boxShadow: "0 3px 10px rgba(37,99,235,0.24)",
                                }}
                            >
                                {isPaid ? <><Lock style={{ width: 10, height: 10 }} /> Enroll</> : <><Play style={{ width: 10, height: 10, fill: "#fff" }} /> Enroll</>}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Coming-soon card — redesigned as an image poster, dummy / illustrative only ─── */
function ComingSoonCard({ item, delay = 0 }: { item: ComingSoonItem; delay?: number }) {
    const [notified, setNotified] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
            style={{
                position: "relative", flexShrink: 0, scrollSnapAlign: "start",
                width: 252, height: 340, borderRadius: 20, overflow: "hidden",
                boxShadow: "0 18px 40px rgba(15,23,42,0.2)",
            }}
        >
            <img
                src={item.image}
                alt={item.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 40%, rgba(15,23,42,0.05) 68%)",
            }} />

            {/* Top row — coming soon + category */}
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "4px 9px", borderRadius: 99,
                background: BRAND, color: "#fff",
            }}>
                <CalendarClock style={{ width: 9, height: 9 }} /> Coming Soon
            </span>
                <span style={{
                    fontSize: 8.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                    padding: "4px 8px", borderRadius: 99,
                    background: "rgba(255,255,255,0.16)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.32)",
                }}>
                {CAT_LABEL[item.category] ?? item.category}
            </span>
            </div>

            {/* Bottom content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[item.difficulty] ?? "#fff", display: "inline-block" }} />
                {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
            </span>

                <h3 style={{
                    fontSize: 14, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", margin: "0 0 6px", color: "#fff",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {item.title}
                </h3>

                <p style={{
                    fontSize: 11, color: "rgba(255,255,255,0.78)", lineHeight: 1.5, margin: "0 0 12px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {item.blurb}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                        <div style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 9, fontWeight: 700,
                        }}>
                            N
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Neel
                    </span>
                    </div>

                    <button
                        type="button"
                        className="notify-btn"
                        onClick={() => setNotified(true)}
                        disabled={notified}
                        style={{
                            flexShrink: 0,
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 11px", borderRadius: 99,
                            fontSize: 10.5, fontWeight: 700, border: "none",
                            background: notified ? SUCCESS : "#fff",
                            color: notified ? "#fff" : BRAND,
                            cursor: notified ? "default" : "pointer",
                            transition: "all 0.18s",
                        }}
                    >
                        {notified ? <><BellRing style={{ width: 11, height: 11 }} /> Notified</> : <><Bell style={{ width: 11, height: 11 }} /> Notify</>}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div style={{
            height: 400, borderRadius: 20, overflow: "hidden",
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(29,78,216,0.08)",
        }} className="animate-pulse">
            <div style={{ height: 172, background: "rgba(37,99,235,0.08)" }} />
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: "40%", height: 14, borderRadius: 6, background: "rgba(37,99,235,0.1)" }} />
                <div style={{ width: "85%", height: 16, borderRadius: 6, background: "rgba(15,23,42,0.08)" }} />
                <div style={{ width: "65%", height: 16, borderRadius: 6, background: "rgba(15,23,42,0.08)" }} />
                <div style={{ width: "100%", height: 38, borderRadius: 10, background: "rgba(37,99,235,0.07)", marginTop: 8 }} />
                <div style={{ width: "100%", height: 34, borderRadius: 10, background: "rgba(37,99,235,0.1)" }} />
            </div>
        </div>
    );
}

/* ─── FAQ item ─── */
function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div style={{ borderBottom: "1px solid rgba(29,78,216,0.1)" }}>
            <button
                type="button"
                onClick={onToggle}
                className="accordion-btn"
                aria-expanded={isOpen}
                style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    padding: "16px 4px", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", textAlign: "left",
                }}
            >
                <span style={{ fontSize: 14.5, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{q}</span>
                <span style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isOpen ? BRAND : "rgba(37,99,235,0.08)", transition: "background 0.18s",
                }}>
      {isOpen
          ? <Minus style={{ width: 12, height: 12, color: "#fff" }} />
          : <Plus style={{ width: 12, height: 12, color: BRAND }} />}
    </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                    >
                        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, margin: "0 4px 16px", maxWidth: 640 }}>{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Page ─── */
export default function CoursesPage() {
    const { isLoggedIn } = useAuth();
    const [courses, setCourses]   = useState<Course[]>([]);
    const [filtered, setFiltered] = useState<Course[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [search, setSearch]     = useState("");
    const [category, setCategory] = useState("");
    const [type, setType]         = useState<"" | "free" | "paid">("");

// Presentation-only additions — none of these touch data fetching
    const [sortBy, setSortBy]   = useState<"newest" | "rating" | "popular">("newest");
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    useEffect(() => {
        const token = getAuthToken();

        const publicFetch = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`)
            .then(r => r.json());

        const enrollFetch = token
            ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json()).catch(() => ({ success: false }))
            : Promise.resolve({ success: false });

        Promise.all([publicFetch, enrollFetch])
            .then(([pubData, enrollData]) => {
                let list: Course[] = pubData.success ? pubData.data.courses || [] : [];
                if (enrollData.success && Array.isArray(enrollData.data)) {
                    const enrollMap = new Map<string, { progress: number }>();
                    enrollData.data.forEach((e: any) => {
                        const id = e.courseId?._id ?? e.courseId;
                        if (id) enrollMap.set(id, { progress: e.progress || 0 });
                    });
                    list = list.map(c => enrollMap.has(c._id) ? { ...c, enrollment: enrollMap.get(c._id) } : c);
                }
                setCourses(list);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    useEffect(() => {
        let r = [...courses];
        if (search.trim()) {
            const q = search.toLowerCase();
            r = r.filter(c =>
                c.title.toLowerCase().includes(q) ||
                (c.shortDescription ?? "").toLowerCase().includes(q) ||
                (CAT_LABEL[c.category] ?? c.category).toLowerCase().includes(q)
            );
        }
        if (category) r = r.filter(c => c.category === category);
        if (type === "free") r = r.filter(c => c.contentType === "free");
        if (type === "paid") r = r.filter(c => c.contentType !== "free");
        setFiltered(r);
    }, [courses, search, category, type]);

// Client-side sort of already-filtered results — purely presentational, no new requests
    const sortedFiltered = useMemo(() => {
        if (sortBy === "newest") return filtered;
        const arr = [...filtered];
        if (sortBy === "rating") arr.sort((a, b) => (b.analytics?.averageRating ?? 0) - (a.analytics?.averageRating ?? 0));
        if (sortBy === "popular") arr.sort((a, b) => (b.analytics?.enrollments ?? 0) - (a.analytics?.enrollments ?? 0));
        return arr;
    }, [filtered, sortBy]);

    const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
    const freeCnt = courses.filter(c => c.contentType === "free").length;
    const hasFilters = search || category || type;

    const STATS = [
        { val: `${courses.length}+`, label: "Courses" },
        { val: totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+", label: "Enrolled" },
        { val: `${freeCnt}`, label: "Free" },
        { val: "4.9★", label: "Avg rating" },
    ];

    return (
        <>
            <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&display=swap');
    .lc2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .si:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
    .fs { appearance: none; }
    .fs:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .chip:focus-visible, .cta-btn:focus-visible, .accordion-btn:focus-visible, .notify-btn:focus-visible, .type-pill:focus-visible {
      outline: 2px solid #2563eb; outline-offset: 2px;
    }
    .chip { transition: border-color 0.18s, background 0.18s, transform 0.18s; }
    .chip:hover { transform: translateY(-2px); }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
    }
  `}</style>

            <div style={{
                background: PAPER,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                minHeight: "100vh",
                position: "relative",
            }}>
                <Navbar />

                {/* ── Hero ── */}
                <section style={{
                    position: "relative",
                    paddingTop: "calc(var(--yic-header-h, 64px) + 52px)",
                    paddingBottom: 52,
                    overflow: "hidden",
                    background: PAPER,
                }}>
                    {/* Grid pattern */}
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                        backgroundImage:
                            "linear-gradient(rgba(59,130,246,0.055) 1px, transparent 1px)," +
                            "linear-gradient(90deg, rgba(59,130,246,0.055) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
                    }} />
                    <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
                    <div style={{ position: "absolute", bottom: "0%", left: "3%", width: 340, height: 340, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                        <div style={{ display: "flex", gap: 44, alignItems: "center", flexWrap: "wrap" }}>

                            {/* Left — copy */}
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                style={{ flex: "1 1 480px", minWidth: 0 }}
                            >
                                {/* Eyebrow */}
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                                    <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
                                    <div style={{
                                        display: "inline-flex", alignItems: "center", gap: 7,
                                        padding: "6px 14px", borderRadius: 99,
                                        background: "#2563eb14", border: "1px solid #2563eb33",
                                    }}>
                                        <Sparkles size={11} style={{ color: BRAND }} />
                                        <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  All Courses
                </span>
                                    </div>
                                    <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
                                </div>

                                <h1 style={{
                                    margin: "0 0 14px",
                                    fontSize: "clamp(34px, 5vw, 60px)",
                                    lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 700,
                                    color: INK, fontFamily: "'DM Sans', system-ui, sans-serif",
                                }}>
                                    Learn from{" "}
                                    <span style={{ position: "relative", display: "inline-block", color: BRAND }}>
                the best.
                <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: "absolute", left: 0, right: 0, bottom: -3,
                        height: 3, borderRadius: 2,
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                        transformOrigin: "left", display: "block",
                    }}
                />
              </span>
                                </h1>

                                <p style={{
                                    fontSize: "clamp(14px,1.25vw,16.5px)",
                                    color: MUTED, lineHeight: 1.7, maxWidth: 520,
                                    marginBottom: 24, fontWeight: 400,
                                }}>
                                    Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
                                    {!isLoggedIn && " Sign in to track progress and earn certificates."}
                                </p>

                                {/* CTA row */}
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                                    <button
                                        type="button"
                                        className="cta-btn"
                                        onClick={scrollToGrid}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 7,
                                            padding: "11px 22px", borderRadius: 12, border: "none", cursor: "pointer",
                                            fontSize: 13.5, fontWeight: 700, color: "#fff", fontFamily: "inherit",
                                            background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                                            boxShadow: "0 8px 22px rgba(37,99,235,0.28)",
                                        }}
                                    >
                                        Explore courses <ArrowRight style={{ width: 14, height: 14 }} />
                                    </button>
                                    <button
                                        type="button"
                                        className="cta-btn"
                                        onClick={() => { setType("free"); scrollToGrid(); }}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 7,
                                            padding: "11px 20px", borderRadius: 12, cursor: "pointer",
                                            fontSize: 13.5, fontWeight: 700, color: BRAND, fontFamily: "inherit",
                                            background: "rgba(37,99,235,0.07)", border: "1.5px solid rgba(37,99,235,0.22)",
                                        }}
                                    >
                                        <Play style={{ width: 13, height: 13, fill: BRAND }} /> Try a free course
                                    </button>
                                </div>

                                {/* Stats pill */}
                                <div style={{
                                    display: "inline-flex", alignItems: "center",
                                    gap: "clamp(12px,3vw,32px)", flexWrap: "wrap",
                                    padding: "13px 22px", borderRadius: 99,
                                    background: "#fff", border: "1px solid #2563eb1a",
                                    boxShadow: "0 8px 28px #2563eb12",
                                    marginBottom: 18,
                                }}>
                                    {STATS.map(s => (
                                        <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                                            <span style={{ fontSize: "clamp(13px,1.4vw,17px)", fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", fontFamily: MONO }}>{s.val}</span>
                                            <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Value strip */}
                                <div style={{ display: "flex", gap: "10px 20px", flexWrap: "wrap" }}>
                                    {[
                                        { icon: GraduationCap, text: "Mentor-led, by industry professionals" },
                                        { icon: Award, text: "Certificates on course completion" },
                                        { icon: Clock, text: "Learn at your own pace" },
                                    ].map(v => {
                                        const Icon = v.icon;
                                        return (
                                            <span key={v.text} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, fontWeight: 500 }}>
                    <Icon style={{ width: 14, height: 14, color: BRAND, flexShrink: 0 }} /> {v.text}
                  </span>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Right — signature readiness card */}
                            <div className="hidden lg:flex" style={{ flex: "0 0 280px", justifyContent: "center" }}>
                                <ReadinessCard />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Prep tracks quick nav ── */}
                <section style={{ background: PAPER, position: "relative" }}>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-8">
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: 0 }}>
                                Pick a prep track
                            </h2>
                            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{PREP_TRACKS.length} tracks</span>
                        </div>
                        <div className="flex hide-scrollbar" style={{ gap: 12, overflowX: "auto", paddingBottom: 6 }}>
                            {PREP_TRACKS.map(t => {
                                const Icon = t.icon;
                                const active = category === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        className="chip"
                                        onClick={() => { setCategory(active ? "" : t.value); scrollToGrid(); }}
                                        style={{
                                            flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
                                            padding: "10px 16px", borderRadius: 14, cursor: "pointer",
                                            border: active ? `1.5px solid ${BRAND}` : "1.5px solid rgba(29,78,216,0.14)",
                                            background: active ? "rgba(37,99,235,0.08)" : "#fff",
                                            minWidth: 188, textAlign: "left", fontFamily: "inherit",
                                        }}
                                    >
                <span style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? BRAND : "rgba(37,99,235,0.08)",
                    color: active ? "#fff" : BRAND,
                }}>
                  <Icon size={15} />
                </span>
                                        <span>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{t.label}</div>
                  <div style={{ fontSize: 10.5, color: MUTED, marginTop: 1 }}>{t.blurb}</div>
                </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Sticky Filter Bar ── */}
                <div style={{
                    background: "rgba(248,246,241,0.92)",
                    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    borderTop: "1px solid rgba(29,78,216,0.08)",
                    borderBottom: "1px solid rgba(29,78,216,0.08)",
                    position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
                }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

                            {/* Search */}
                            <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0, maxWidth: 300 }}>
                                <Search style={{
                                    position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                                    width: 14, height: 14, color: "#94a3b8", pointerEvents: "none",
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search courses…"
                                    aria-label="Search courses"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="si"
                                    style={{
                                        width: "100%", paddingLeft: 34, paddingRight: search ? 32 : 12,
                                        paddingTop: 8, paddingBottom: 8,
                                        border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
                                        fontSize: 13, fontFamily: "inherit", color: INK,
                                        background: "rgba(255,255,255,0.9)",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                        boxSizing: "border-box",
                                    }}
                                />
                                {search && (
                                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search" style={{
                                        position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", padding: 0,
                                        display: "flex", alignItems: "center",
                                    }}>
                                        <X style={{ width: 13, height: 13, color: "#94a3b8" }} />
                                    </button>
                                )}
                            </div>

                            {/* Category dropdown */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="fs"
                                    aria-label="Filter by category"
                                    style={{
                                        paddingLeft: 12, paddingRight: 32, paddingTop: 8, paddingBottom: 8,
                                        border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
                                        fontSize: 13, fontFamily: "inherit", color: INK,
                                        background: "rgba(255,255,255,0.9)", cursor: "pointer",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                                <ChevronDown style={{
                                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                                    width: 12, height: 12, color: "#94a3b8", pointerEvents: "none",
                                }} />
                            </div>

                            {/* Sort dropdown — client-side only, doesn't touch the fetched data */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as "newest" | "rating" | "popular")}
                                    className="fs"
                                    aria-label="Sort courses"
                                    style={{
                                        paddingLeft: 12, paddingRight: 32, paddingTop: 8, paddingBottom: 8,
                                        border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
                                        fontSize: 13, fontFamily: "inherit", color: INK,
                                        background: "rgba(255,255,255,0.9)", cursor: "pointer",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="rating">Top rated</option>
                                    <option value="popular">Most popular</option>
                                </select>
                                <ChevronDown style={{
                                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                                    width: 12, height: 12, color: "#94a3b8", pointerEvents: "none",
                                }} />
                            </div>

                            {/* Type pills */}
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                {(["", "free", "paid"] as const).map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        className="type-pill"
                                        onClick={() => setType(t)}
                                        style={{
                                            padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                                            border: "1px solid",
                                            borderColor: type === t ? BRAND : "rgba(29,78,216,0.18)",
                                            background: type === t ? BRAND : "rgba(255,255,255,0.9)",
                                            color: type === t ? "#fff" : MUTED,
                                            cursor: "pointer", fontFamily: "inherit",
                                            transition: "all 0.18s",
                                            boxShadow: type === t ? "0 4px 12px rgba(37,99,235,0.22)" : "none",
                                        }}
                                    >
                                        {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                                    </button>
                                ))}
                            </div>

                            {/* Clear filters */}
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 5,
                                        padding: "6px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                                        border: "1px solid rgba(239,68,68,0.3)", background: "#fef2f2",
                                        color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
                                        transition: "all 0.15s", flexShrink: 0,
                                    }}
                                >
                                    <X style={{ width: 11, height: 11 }} /> Clear
                                </button>
                            )}

                            {!isLoading && (
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap", flexShrink: 0, fontFamily: MONO }}>
              {sortedFiltered.length} course{sortedFiltered.length !== 1 ? "s" : ""}
            </span>
                            )}
                        </div>

                        {/* Category scroll tabs — mobile */}
                        <div className="flex sm:hidden hide-scrollbar gap-2 mt-2 overflow-x-auto pb-1">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setCategory(c.value)}
                                    style={{
                                        flexShrink: 0, padding: "5px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                                        border: "1px solid",
                                        borderColor: category === c.value ? BRAND : "rgba(29,78,216,0.15)",
                                        background: category === c.value ? BRAND : "rgba(255,255,255,0.9)",
                                        color: category === c.value ? "#fff" : MUTED,
                                        cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                                        transition: "all 0.18s",
                                    }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Courses Grid ── */}
                <section ref={gridRef} style={{ background: PAPER, position: "relative", scrollMarginTop: "calc(var(--yic-header-h, 64px) + 64px)" }}>
                    {/* Ambient blobs */}
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: "15%", left: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.055) 0%,transparent 70%)", filter: "blur(80px)" }} />
                        <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.045) 0%,transparent 70%)", filter: "blur(80px)" }} />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                            <div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                                <Award style={{ width: 12, height: 12 }} /> Our catalog
                            </span>
                                <h2 style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: 0 }}>
                                    All courses
                                </h2>
                            </div>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                                padding: "7px 15px", borderRadius: 99,
                                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`, color: "#fff",
                                boxShadow: "0 6px 16px rgba(37,99,235,0.28)", flexShrink: 0,
                            }}>
                            <CheckCircle style={{ width: 12, height: 12 }} /> Official courses
                        </span>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : sortedFiltered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    borderRadius: 20, padding: "clamp(40px,6vw,72px) clamp(24px,6vw,56px)",
                                    textAlign: "center",
                                    background: "rgba(255,255,255,0.72)",
                                    border: "1px solid rgba(29,78,216,0.09)",
                                    boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 14px" }} />
                                <p style={{ color: INK, fontWeight: 700, fontSize: 17, marginBottom: 8, letterSpacing: "-0.02em" }}>
                                    {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
                                </p>
                                <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6 }}>
                                    {courses.length === 0
                                        ? "We're building something great. Check back shortly — or take a look at what's in the works below."
                                        : "Try clearing the search or changing the category."}
                                </p>
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                                        style={{
                                            marginTop: 20, padding: "10px 24px", borderRadius: 12,
                                            background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                                            color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
                                            border: "none", fontFamily: "inherit",
                                            boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                <AnimatePresence mode="popLayout">
                                    {sortedFiltered.map((c, i) => (
                                        <CourseCard key={c._id} course={c} delay={Math.min(i * 0.035, 0.2)} isLoggedIn={isLoggedIn} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Coming Soon — redesigned as a horizontal filmstrip of poster cards ── */}
                <section style={{ background: PAPER, position: "relative" }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                            <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              <CalendarClock style={{ width: 12, height: 12 }} /> In the works
            </span>
                                <h2 style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: 0 }}>
                                    Coming soon — Soft Skills
                                </h2>
                            </div>
                            <p style={{ maxWidth: 420, color: MUTED, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                                A dedicated soft-skills track is on the way — communication, leadership, EQ, and more. Tap notify and we'll let you know the moment one goes live.
                            </p>
                        </div>
                        <div className="flex hide-scrollbar" style={{ gap: 16, overflowX: "auto", paddingBottom: 10, scrollSnapType: "x mandatory" }}>
                            {COMING_SOON.map((item, i) => (
                                <ComingSoonCard key={item.id} item={item} delay={Math.min(i * 0.04, 0.2)} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How it works ── */}
                <section style={{ background: "#fff", borderTop: "1px solid rgba(29,78,216,0.08)", borderBottom: "1px solid rgba(29,78,216,0.08)" }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
                        <div style={{ textAlign: "center", marginBottom: 36 }}>
                            <h2 style={{ fontSize: "clamp(22px,2.6vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                                How a track works
                            </h2>
                            <p style={{ color: MUTED, fontSize: 13.5, maxWidth: 480, margin: "0 auto" }}>
                                The same three steps for every course, free or paid.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ maxWidth: 920, margin: "0 auto" }}>
                            {STEPS.map((s, i) => (
                                <motion.div
                                    key={s.n}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ textAlign: "left" }}
                                >
                                    <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: BRAND, letterSpacing: "0.04em" }}>{s.n}</span>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: "6px 0 6px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section style={{ background: PAPER }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                            <HelpCircle style={{ width: 18, height: 18, color: BRAND }} />
                            <h2 style={{ fontSize: "clamp(20px,2.4vw,24px)", fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: 0 }}>
                                Frequently asked
                            </h2>
                        </div>
                        <div style={{ maxWidth: 720, background: "#fff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 18, padding: "4px 18px", boxShadow: "0 4px 20px rgba(29,78,216,0.05)" }}>
                            {FAQS.map((f, i) => (
                                <FaqItem key={f.q} q={f.q} a={f.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Guest CTA Banner ── */}
                {!isLoggedIn && !isLoading && (
                    <section style={{ background: PAPER }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    borderRadius: 20, padding: "clamp(24px,4vw,36px) clamp(20px,5vw,44px)",
                                    background: "rgba(255,255,255,0.82)",
                                    border: "1px solid rgba(29,78,216,0.14)",
                                    boxShadow: "0 16px 48px rgba(29,78,216,0.09), 0 4px 12px rgba(29,78,216,0.05)",
                                    backdropFilter: "blur(16px)",
                                    display: "flex", flexWrap: "wrap", alignItems: "center",
                                    justifyContent: "space-between", gap: 20,
                                    position: "relative", overflow: "hidden",
                                }}
                            >
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }} />
                                <div>
                                    <p style={{ color: INK, fontWeight: 700, fontSize: "clamp(15px,2vw,18px)", margin: 0, letterSpacing: "-0.02em" }}>
                                        Full access — sign in once, learn forever.
                                    </p>
                                    <p style={{ color: MUTED, fontSize: 13, marginTop: 4, fontWeight: 400 }}>
                                        Track progress, earn certificates, and unlock every premium course.
                                    </p>
                                </div>
                                <Link
                                    href="/login?redirect=/dashboard/content"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "11px 24px", borderRadius: 12, flexShrink: 0,
                                        background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                                        color: "#fff", fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                                        boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
                                        transition: "transform 0.18s, box-shadow 0.2s",
                                    }}
                                    className="hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.40)]"
                                >
                                    Sign in to get started <ArrowRight style={{ width: 14, height: 14 }} />
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )}

                <StandardFooter />
            </div>
        </>
    );
}