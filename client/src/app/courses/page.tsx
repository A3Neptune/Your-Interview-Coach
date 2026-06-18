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
//                 {course.modules!.length} modules
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

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award,
  Search, ChevronDown, X, Play, CheckCircle, Tag, Filter,
  SlidersHorizontal, TrendingUp, Users, BarChart3, PlayCircle,
  Heart, Share2, MoreHorizontal, ChevronLeft, ChevronRight,
  GraduationCap, Zap, ShieldCheck, Infinity, Globe, MonitorPlay,
  FileText, MessageSquare, Trophy, Flame, Target, Lightbulb,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── Brand Colors ─── */
const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const BRAND_LIGHT = "#3b82f6";
const PAPER      = "#F8F6F1";
const INK        = "#0f172a";
const MUTED      = "#64748b";
const MUTED_LIGHT = "#94a3b8";
const GREEN      = "#059669";
const ORANGE     = "#f97316";
const RED        = "#dc2626";
const YELLOW     = "#eab308";

/* ─── Types ─── */
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
  bestseller?: boolean;
  highestRated?: boolean;
  new?: boolean;
}

const CAT_LABEL: Record<string, string> = {
  "mock-interview":  "Mock Interview",
  "resume-building": "Resume Building",
  "gd-practice":     "Group Discussion",
  "placement-prep":  "Placement Prep",
  "skills":          "Skills",
  "career-growth":   "Career Growth",
  "coding":          "Coding",
  "system-design":   "System Design",
  "behavioral":      "Behavioral",
  "other":           "Other",
};

const CATEGORIES = [
  { value: "", label: "All Courses" },
  { value: "mock-interview",  label: "Mock Interview" },
  { value: "resume-building", label: "Resume Building" },
  { value: "gd-practice",     label: "Group Discussion" },
  { value: "placement-prep",  label: "Placement Prep" },
  { value: "coding",          label: "Coding" },
  { value: "system-design",   label: "System Design" },
  { value: "behavioral",      label: "Behavioral" },
  { value: "career-growth",   label: "Career Growth" },
  { value: "skills",          label: "Skills" },
];

const DIFF_DOT: Record<string, string> = {
  beginner:     "#10b981",
  intermediate: "#2563eb",
  advanced:     "#f97316",
  expert:       "#ef4444",
};

/* ─── Dummy Courses ─── */
const DUMMY_COURSES: Course[] = [
  {
    _id: "dummy-1",
    title: "Complete System Design Interview Bootcamp 2026",
    shortDescription: "Master system design interviews with real-world examples. Covers load balancing, caching, databases, microservices, and more.",
    contentType: "paid",
    category: "system-design",
    difficulty: "advanced",
    price: 4999,
    discountPrice: 1299,
    discount: { type: "percentage", value: 74, isActive: true },
    thumbnail: "",
    totalDuration: 1240,
    certificateEnabled: true,
    analytics: { enrollments: 15420, averageRating: 4.8 },
    mentorId: { name: "Rahul Sharma", designation: "Staff Engineer", company: "Google" },
    totalLectures: 142,
    modules: [{ title: "Basics" }, { title: "Scalability" }, { title: "Databases" }, { title: "Microservices" }, { title: "Case Studies" }],
    bestseller: true,
  },
  {
    _id: "dummy-2",
    title: "Cracking the Coding Interview — Data Structures & Algorithms",
    shortDescription: "Comprehensive DSA course with 500+ LeetCode-style problems. From arrays to dynamic programming.",
    contentType: "paid",
    category: "coding",
    difficulty: "intermediate",
    price: 3999,
    discountPrice: 999,
    discount: { type: "percentage", value: 75, isActive: true },
    thumbnail: "",
    totalDuration: 980,
    certificateEnabled: true,
    analytics: { enrollments: 28340, averageRating: 4.9 },
    mentorId: { name: "Priya Patel", designation: "Senior SDE", company: "Amazon" },
    totalLectures: 210,
    modules: [{ title: "Arrays" }, { title: "Trees" }, { title: "Graphs" }, { title: "DP" }, { title: "Greedy" }],
    bestseller: true,
  },
  {
    _id: "dummy-3",
    title: "Behavioral Interview Mastery — STAR Method Unlocked",
    shortDescription: "Ace every behavioral question using the STAR framework. 50+ real interview scenarios with expert feedback.",
    contentType: "free",
    category: "behavioral",
    difficulty: "beginner",
    price: 0,
    thumbnail: "",
    totalDuration: 320,
    certificateEnabled: true,
    analytics: { enrollments: 8930, averageRating: 4.7 },
    mentorId: { name: "Ananya Gupta", designation: "HR Director", company: "Microsoft" },
    totalLectures: 45,
    modules: [{ title: "STAR Basics" }, { title: "Leadership" }, { title: "Conflict" }, { title: "Failure" }],
    new: true,
  },
  {
    _id: "dummy-4",
    title: "Resume Building Masterclass — From Zero to Hired",
    shortDescription: "Build ATS-friendly resumes that get shortlisted. Templates, keyword optimization, and recruiter insights.",
    contentType: "free",
    category: "resume-building",
    difficulty: "beginner",
    price: 0,
    thumbnail: "",
    totalDuration: 180,
    certificateEnabled: false,
    analytics: { enrollments: 12450, averageRating: 4.6 },
    mentorId: { name: "Vikram Rao", designation: "Talent Acquisition Lead", company: "Flipkart" },
    totalLectures: 28,
    modules: [{ title: "ATS Basics" }, { title: "Templates" }, { title: "Keywords" }, { title: "LinkedIn" }],
  },
  {
    _id: "dummy-5",
    title: "Mock Interview Series — FAANG Technical Rounds",
    shortDescription: "Live mock interviews with ex-FAANG engineers. Get detailed feedback on your approach, code quality, and communication.",
    contentType: "paid",
    category: "mock-interview",
    difficulty: "advanced",
    price: 5999,
    discountPrice: 1999,
    discount: { type: "percentage", value: 67, isActive: true },
    thumbnail: "",
    totalDuration: 560,
    certificateEnabled: true,
    analytics: { enrollments: 6780, averageRating: 4.9 },
    mentorId: { name: "Arjun Mehta", designation: "Ex-Principal Engineer", company: "Meta" },
    totalLectures: 35,
    modules: [{ title: "Google" }, { title: "Amazon" }, { title: "Meta" }, { title: "Netflix" }],
    highestRated: true,
  },
  {
    _id: "dummy-6",
    title: "Group Discussion & Communication Skills Workshop",
    shortDescription: "Dominate GD rounds with structured thinking, confident speaking, and effective group dynamics.",
    contentType: "free",
    category: "gd-practice",
    difficulty: "beginner",
    price: 0,
    thumbnail: "",
    totalDuration: 240,
    certificateEnabled: true,
    analytics: { enrollments: 15670, averageRating: 4.5 },
    mentorId: { name: "Neha Singh", designation: "Communication Coach", company: "TCS" },
    totalLectures: 32,
    modules: [{ title: "GD Basics" }, { title: "Topics" }, { title: "Body Language" }, { title: "Practice" }],
  },
  {
    _id: "dummy-7",
    title: "Placement Preparation — Complete Campus to Corporate Guide",
    shortDescription: "Everything you need for campus placements. Aptitude, technical, HR rounds, and offer negotiation.",
    contentType: "paid",
    category: "placement-prep",
    difficulty: "intermediate",
    price: 2999,
    discountPrice: 799,
    discount: { type: "percentage", value: 73, isActive: true },
    thumbnail: "",
    totalDuration: 720,
    certificateEnabled: true,
    analytics: { enrollments: 22100, averageRating: 4.7 },
    mentorId: { name: "Karan Malhotra", designation: "Placement Officer", company: "IIT Bombay" },
    totalLectures: 95,
    modules: [{ title: "Aptitude" }, { title: "Technical" }, { title: "HR" }, { title: "Negotiation" }],
    bestseller: true,
  },
  {
    _id: "dummy-8",
    title: "Career Growth & Leadership — From IC to Manager",
    shortDescription: "Transition from individual contributor to engineering manager. People management, strategy, and stakeholder communication.",
    contentType: "paid",
    category: "career-growth",
    difficulty: "expert",
    price: 4499,
    discountPrice: 1499,
    discount: { type: "percentage", value: 67, isActive: true },
    thumbnail: "",
    totalDuration: 480,
    certificateEnabled: true,
    analytics: { enrollments: 4320, averageRating: 4.8 },
    mentorId: { name: "Sneha Iyer", designation: "Engineering Manager", company: "Uber" },
    totalLectures: 58,
    modules: [{ title: "Transition" }, { title: "People" }, { title: "Strategy" }, { title: "Growth" }],
    new: true,
  },
  {
    _id: "dummy-9",
    title: "Full Stack Web Development with Next.js 15 & TypeScript",
    shortDescription: "Build production-ready apps with Next.js 15, React Server Components, Prisma, and Tailwind CSS.",
    contentType: "paid",
    category: "coding",
    difficulty: "intermediate",
    price: 3499,
    discountPrice: 899,
    discount: { type: "percentage", value: 74, isActive: true },
    thumbnail: "",
    totalDuration: 860,
    certificateEnabled: true,
    analytics: { enrollments: 18900, averageRating: 4.8 },
    mentorId: { name: "Rohan Desai", designation: "Full Stack Developer", company: "Vercel" },
    totalLectures: 165,
    modules: [{ title: "Next.js" }, { title: "React" }, { title: "Prisma" }, { title: "Deploy" }],
    bestseller: true,
  },
  {
    _id: "dummy-10",
    title: "Cloud Computing Fundamentals — AWS, Azure & GCP",
    shortDescription: "Master cloud platforms with hands-on labs. EC2, S3, Lambda, Kubernetes, and cloud architecture patterns.",
    contentType: "paid",
    category: "skills",
    difficulty: "intermediate",
    price: 3999,
    discountPrice: 1199,
    discount: { type: "percentage", value: 70, isActive: true },
    thumbnail: "",
    totalDuration: 640,
    certificateEnabled: true,
    analytics: { enrollments: 11200, averageRating: 4.6 },
    mentorId: { name: "Amit Verma", designation: "Cloud Architect", company: "AWS" },
    totalLectures: 88,
    modules: [{ title: "AWS" }, { title: "Azure" }, { title: "GCP" }, { title: "K8s" }],
  },
  {
    _id: "dummy-11",
    title: "Data Science & Machine Learning Bootcamp",
    shortDescription: "From Python basics to neural networks. Pandas, Scikit-learn, TensorFlow, and real-world ML projects.",
    contentType: "paid",
    category: "skills",
    difficulty: "advanced",
    price: 5499,
    discountPrice: 1699,
    discount: { type: "percentage", value: 69, isActive: true },
    thumbnail: "",
    totalDuration: 1100,
    certificateEnabled: true,
    analytics: { enrollments: 9800, averageRating: 4.7 },
    mentorId: { name: "Dr. Meera Nair", designation: "ML Engineer", company: "OpenAI" },
    totalLectures: 175,
    modules: [{ title: "Python" }, { title: "Pandas" }, { title: "ML" }, { title: "Deep Learning" }],
    highestRated: true,
  },
  {
    _id: "dummy-12",
    title: "DevOps & CI/CD Pipeline Mastery",
    shortDescription: "Automate deployments with Docker, Kubernetes, Jenkins, GitHub Actions, and Terraform.",
    contentType: "paid",
    category: "skills",
    difficulty: "intermediate",
    price: 3299,
    discountPrice: 999,
    discount: { type: "percentage", value: 70, isActive: true },
    thumbnail: "",
    totalDuration: 520,
    certificateEnabled: true,
    analytics: { enrollments: 7650, averageRating: 4.5 },
    mentorId: { name: "Sanjay Kumar", designation: "DevOps Lead", company: "Netflix" },
    totalLectures: 72,
    modules: [{ title: "Docker" }, { title: "K8s" }, { title: "Jenkins" }, { title: "Terraform" }],
  },
];

/* ─── Helpers ─── */
function fmtDuration(mins: number) {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

function fmtNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

/* ─── Udemy-Style Course Card ─── */
function CourseCard({ course, index = 0, isLoggedIn = false }: { course: Course; index?: number; isLoggedIn?: boolean }) {
  const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
  const isEnrolled = !!course.enrollment;
  const pct        = course.enrollment?.progress ?? 0;
  const inits      = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const hasDiscount = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const discountAmt = hasDiscount
    ? course.discount!.type === "percentage"
      ? Math.round(((course.price ?? 0) * course.discount!.value) / 100)
      : course.discount!.value
    : 0;
  const effectivePrice = hasDiscount ? Math.max(0, (course.price ?? 0) - discountAmt) : (course.price ?? 0);
  const discountLabel = hasDiscount
      ? course.discount!.type === "percentage"
          ? `${course.discount!.value}% off`
          : `₹${course.discount!.value} off`
      : null;

  const previewHref = `/courses/${course._id}`;
  const enrollHref  = isEnrolled
      ? `/dashboard/content/${course._id}`
      : isLoggedIn
          ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
          : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

  const catColors: Record<string, { bg: string; text: string }> = {
    "mock-interview":  { bg: "#fef3c7", text: "#92400e" },
    "resume-building": { bg: "#dbeafe", text: "#1e40af" },
    "gd-practice":     { bg: "#dcfce7", text: "#166534" },
    "placement-prep":  { bg: "#fce7f3", text: "#9d174d" },
    "coding":          { bg: "#e0e7ff", text: "#3730a3" },
    "system-design":   { bg: "#ffedd5", text: "#9a3412" },
    "behavioral":      { bg: "#f3e8ff", text: "#6b21a8" },
    "career-growth":   { bg: "#ccfbf1", text: "#0f766e" },
    "skills":          { bg: "#fee2e2", text: "#991b1b" },
    "other":           { bg: "#f1f5f9", text: "#475569" },
  };
  const catStyle = catColors[course.category] || catColors.other;

  return (
      <motion.div
          layout
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.2) }}
          style={{
            display: "flex", flexDirection: "column",
            borderRadius: 4,
            background: "#fff",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            cursor: "pointer",
            willChange: "transform",
          }}
          whileHover={{
            y: -2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            borderColor: "#cbd5e1",
          }}
      >
        {/* Thumbnail — 16:9 */}
        <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden", background: "#1e293b" }}>
          {course.thumbnail ? (
              <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
          ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, #1e3a8a, #2563eb)` }}>
                <BookOpen style={{ width: 40, height: 40, color: "rgba(255,255,255,0.2)" }} />
              </div>
          )}

          {/* Badges */}
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4, zIndex: 2 }}>
            {course.bestseller && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                  padding: "3px 8px", borderRadius: 2,
                  background: "#fbbf24", color: "#78350f",
                  textTransform: "uppercase",
                }}>Bestseller</span>
            )}
            {course.highestRated && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                  padding: "3px 8px", borderRadius: 2,
                  background: "#f97316", color: "#fff",
                  textTransform: "uppercase",
                }}>Highest rated</span>
            )}
            {course.new && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                  padding: "3px 8px", borderRadius: 2,
                  background: "#10b981", color: "#fff",
                  textTransform: "uppercase",
                }}>New</span>
            )}
            {isEnrolled && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                  padding: "3px 8px", borderRadius: 2,
                  background: "#059669", color: "#fff",
                  textTransform: "uppercase",
                }}>Enrolled</span>
            )}
          </div>

          {/* Play overlay */}
          <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              <Play style={{ width: 20, height: 20, color: INK, marginLeft: 2 }} fill={INK} />
            </div>
          </motion.div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "12px 14px 14px" }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
          padding: "2px 8px", borderRadius: 2,
          background: catStyle.bg, color: catStyle.text,
          alignSelf: "flex-start", marginBottom: 8,
        }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>

          <h3 style={{
            fontSize: 14, fontWeight: 700, lineHeight: 1.35, letterSpacing: "-0.01em",
            margin: "0 0 6px", color: INK,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            minHeight: 38,
          }}>
            {course.title}
          </h3>

          <p style={{ fontSize: 12, color: MUTED, margin: "0 0 8px", fontWeight: 500 }}>
            {course.mentorId.name}
            {course.mentorId.company && <span style={{ color: MUTED_LIGHT }}> · {course.mentorId.company}</span>}
          </p>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#b45309" }}>
            {(course.analytics?.averageRating ?? 0).toFixed(1)}
          </span>
            <div style={{ display: "flex", gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                  <Star
                      key={i}
                      style={{ width: 12, height: 12 }}
                      fill={i <= Math.round(course.analytics?.averageRating ?? 0) ? "#f59e0b" : "#e2e8f0"}
                      color={i <= Math.round(course.analytics?.averageRating ?? 0) ? "#f59e0b" : "#e2e8f0"}
                  />
              ))}
            </div>
            <span style={{ fontSize: 11, color: MUTED_LIGHT, fontWeight: 500 }}>
            ({fmtNum(course.analytics?.enrollments ?? 0)})
          </span>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {(course.totalDuration ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: MUTED, fontWeight: 500 }}>
              <Clock style={{ width: 11, height: 11 }} />
                  {fmtDuration(course.totalDuration!)}
            </span>
            )}
            {(course.totalLectures ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: MUTED, fontWeight: 500 }}>
              <PlayCircle style={{ width: 11, height: 11 }} />
                  {course.totalLectures} lectures
            </span>
            )}
            {course.difficulty && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 10, fontWeight: 600, color: MUTED,
                  textTransform: "capitalize",
                }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: DIFF_DOT[course.difficulty] ?? MUTED,
              }} />
                  {course.difficulty}
            </span>
            )}
          </div>

          {/* Price / Progress */}
          <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            {isEnrolled ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>
                  {pct >= 100 ? "Completed" : pct > 0 ? `${pct}% complete` : "Enrolled"}
                </span>
                    <Link
                        href={`/dashboard/content/${course._id}`}
                        style={{ fontSize: 11, fontWeight: 700, color: BRAND, textDecoration: "none" }}
                    >
                      {pct >= 100 ? "Review" : pct > 0 ? "Continue" : "Start"} →
                    </Link>
                  </div>
                  {pct > 0 && pct < 100 && (
                      <div style={{ height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden" }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }}
                        />
                      </div>
                  )}
                </div>
            ) : isPaid && (course.price ?? 0) > 0 ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
                ₹{effectivePrice.toLocaleString("en-IN")}
              </span>
                  {hasDiscount && (
                      <span style={{ fontSize: 12, color: MUTED_LIGHT, textDecoration: "line-through", fontWeight: 500 }}>
                  ₹{course.price?.toLocaleString("en-IN")}
                </span>
                  )}
                  {discountLabel && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "#fff",
                        background: "#dc2626", padding: "1px 6px", borderRadius: 2,
                      }}>
                  {discountLabel}
                </span>
                  )}
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>Free</span>
                  {course.certificateEnabled && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 2,
                        fontSize: 9, fontWeight: 700, color: GREEN,
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        padding: "1px 5px", borderRadius: 2,
                      }}>
                  <Award style={{ width: 8, height: 8 }} /> Cert
                </span>
                  )}
                </div>
            )}
          </div>
        </div>
      </motion.div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
      <div style={{ borderRadius: 4, background: "#fff", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ paddingTop: "56.25%", background: "#e2e8f0" }} className="animate-pulse" />
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ height: 10, width: "30%", background: "#e2e8f0", borderRadius: 2, marginBottom: 10 }} className="animate-pulse" />
          <div style={{ height: 16, width: "90%", background: "#e2e8f0", borderRadius: 2, marginBottom: 6 }} className="animate-pulse" />
          <div style={{ height: 16, width: "70%", background: "#e2e8f0", borderRadius: 2, marginBottom: 10 }} className="animate-pulse" />
          <div style={{ height: 12, width: "50%", background: "#e2e8f0", borderRadius: 2, marginBottom: 8 }} className="animate-pulse" />
          <div style={{ height: 12, width: "40%", background: "#e2e8f0", borderRadius: 2, marginBottom: 10 }} className="animate-pulse" />
          <div style={{ height: 18, width: "25%", background: "#e2e8f0", borderRadius: 2 }} className="animate-pulse" />
        </div>
      </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{
              fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 800,
              color: INK, letterSpacing: "-0.03em", margin: "0 0 4px",
            }}>
              {title}
            </h2>
            {subtitle && (
                <p style={{ fontSize: 14, color: MUTED, margin: 0, fontWeight: 400 }}>{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      </div>
  );
}

/* ─── Course Carousel ─── */
function CourseCarousel({
                          title, subtitle, courses, isLoggedIn, loading
                        }: {
  title: string; subtitle?: string; courses: Course[]; isLoggedIn: boolean; loading: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [courses]);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
      <div style={{ marginBottom: 48 }}>
        <SectionHeader
            title={title}
            subtitle={subtitle}
            action={courses.length > 4 && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                      onClick={() => scroll(-1)}
                      disabled={!canScrollLeft}
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: "1px solid #e2e8f0", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: canScrollLeft ? "pointer" : "not-allowed",
                        opacity: canScrollLeft ? 1 : 0.4,
                        transition: "all 0.2s",
                      }}
                  >
                    <ChevronLeft style={{ width: 16, height: 16, color: INK }} />
                  </button>
                  <button
                      onClick={() => scroll(1)}
                      disabled={!canScrollRight}
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: "1px solid #e2e8f0", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: canScrollRight ? "pointer" : "not-allowed",
                        opacity: canScrollRight ? 1 : 0.4,
                        transition: "all 0.2s",
                      }}
                  >
                    <ChevronRight style={{ width: 16, height: 16, color: INK }} />
                  </button>
                </div>
            )}
        />

        {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        ) : courses.length === 0 ? (
            <div style={{
              padding: "48px 24px", textAlign: "center",
              background: "#fff", borderRadius: 8, border: "1px dashed #e2e8f0",
            }}>
              <BookOpen style={{ width: 40, height: 40, color: "#cbd5e1", margin: "0 auto 12px" }} />
              <p style={{ color: MUTED, fontSize: 14, fontWeight: 500 }}>Coming soon</p>
            </div>
        ) : (
            <div
                ref={scrollRef}
                style={{
                  display: "flex", gap: 16,
                  overflowX: "auto", scrollSnapType: "x mandatory",
                  scrollbarWidth: "none", msOverflowStyle: "none",
                  paddingBottom: 8,
                }}
            >
              {courses.map((c, i) => (
                  <div key={c._id} style={{ flex: "0 0 260px", scrollSnapAlign: "start" }}>
                    <CourseCard course={c} index={i} isLoggedIn={isLoggedIn} />
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

/* ─── Trust Bar ─── */
function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Lifetime Access" },
    { icon: Infinity, label: "Expert Instructors" },
    { icon: Globe, label: "Learn Anywhere" },
    { icon: MonitorPlay, label: "HD Video Content" },
    { icon: Trophy, label: "Certificates" },
    { icon: MessageSquare, label: "Community Support" },
  ];

  return (
      <div style={{
        background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "16px 0",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "clamp(16px, 3vw, 48px)", flexWrap: "wrap",
          }}>
            {items.map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon style={{ width: 18, height: 18, color: BRAND }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{label}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

/* ─── Main Page ─── */
export default function CoursesPage() {
  const { isLoggedIn } = useAuth();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [type, setType]         = useState<"" | "free" | "paid">("");

  /* ── Fetch from backend + merge dummy fallback ── */
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

          // Fallback to dummy courses if backend returns empty
          if (list.length === 0) {
            list = [...DUMMY_COURSES];
          }

          setCourses(list);
        })
        .catch(() => {
          setCourses([...DUMMY_COURSES]);
        })
        .finally(() => setLoading(false));
  }, [isLoggedIn]);

  /* ── Filter logic ── */
  useEffect(() => {
    let r = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(c =>
          c.title.toLowerCase().includes(q) ||
          (c.shortDescription ?? "").toLowerCase().includes(q) ||
          c.mentorId.name.toLowerCase().includes(q) ||
          (CAT_LABEL[c.category] ?? c.category).toLowerCase().includes(q)
      );
    }
    if (category) r = r.filter(c => c.category === category);
    if (type === "free") r = r.filter(c => c.contentType === "free");
    if (type === "paid") r = r.filter(c => c.contentType !== "free");
    setFiltered(r);
  }, [courses, search, category, type]);

  const hasFilters = search || category || type;

  /* ── Derived lists ── */
  const bestsellers = filtered.filter(c => c.bestseller);
  const newCourses  = filtered.filter(c => c.new);
  const freeCourses = filtered.filter(c => c.contentType === "free");
  const paidCourses = filtered.filter(c => c.contentType !== "free");
  const highestRated = filtered.filter(c => c.highestRated);

  /* ── Stats ── */
  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt = courses.filter(c => c.contentType === "free").length;
  const avgRating = courses.length > 0
      ? (courses.reduce((s, c) => s + (c.analytics?.averageRating ?? 0), 0) / courses.filter(c => (c.analytics?.averageRating ?? 0) > 0).length || 1).toFixed(1)
      : "4.8";

  const STATS = [
    { val: `${courses.length}+`, label: "Courses" },
    { val: totalEnrollments > 0 ? `${fmtNum(totalEnrollments)}+` : "50K+", label: "Students" },
    { val: `${freeCnt}`, label: "Free" },
    { val: `${avgRating}\u2605`, label: "Avg Rating" },
  ];

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .lc2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .lc3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .si:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .fs:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
      `}</style>

        <div style={{
          background: PAPER,
          fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
        }}>
          <Navbar />

          {/* ═══════════════════════════════════════════
            HERO — Dark banner
            ═══════════════════════════════════════════ */}
          <section style={{
            position: "relative",
            background: INK,
            paddingTop: "calc(var(--yic-header-h, 64px) + 48px)",
            paddingBottom: 56,
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.03,
              backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
            <div style={{
              position: "absolute", top: "-20%", right: "-10%",
              width: 600, height: 600, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
              filter: "blur(100px)",
            }} />
            <div style={{
              position: "absolute", bottom: "-10%", left: "5%",
              width: 400, height: 400, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
            }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <Sparkles size={14} style={{ color: BRAND_LIGHT }} />
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: BRAND_LIGHT,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                  }}>
                  All Courses
                </span>
                </div>

                <h1 style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(32px, 5vw, 56px)",
                  lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 800,
                  color: "#fff", maxWidth: 680,
                }}>
                  Learn from{" "}
                  <span style={{ color: BRAND_LIGHT }}>the best</span>,{" "}
                  <br className="hidden sm:block" />
                  at your own pace.
                </h1>

                <p style={{
                  fontSize: "clamp(14px, 1.3vw, 17px)",
                  color: "#94a3b8", lineHeight: 1.7, maxWidth: 520,
                  marginBottom: 32, fontWeight: 400,
                }}>
                  Expert-crafted courses for every stage — mock interviews, resume building,
                  group discussions, coding, system design & more.
                  {!isLoggedIn && " Sign in to track progress and earn certificates."}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "clamp(16px, 2.5vw, 32px)", flexWrap: "wrap",
                  }}>
                    {STATS.map(s => (
                        <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span style={{ fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                        {s.val}
                      </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {s.label}
                      </span>
                        </div>
                    ))}
                  </div>

                  {!isLoggedIn && (
                      <Link
                          href="/login?redirect=/courses"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "12px 24px", borderRadius: 4,
                            background: BRAND, color: "#fff",
                            fontWeight: 700, fontSize: 14, textDecoration: "none",
                            transition: "background 0.2s",
                          }}
                          className="hover:bg-blue-700"
                      >
                        Get Started <ArrowRight style={{ width: 16, height: 16 }} />
                      </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
            TRUST BAR
            ═══════════════════════════════════════════ */}
          <TrustBar />

          {/* ═══════════════════════════════════════════
            STICKY SEARCH + FILTERS
            ═══════════════════════════════════════════ */}
          <div style={{
            position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid #e2e8f0",
          }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

                {/* Search */}
                <div style={{ position: "relative", flex: "1 1 200px", minWidth: 0, maxWidth: 360 }}>
                  <Search style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    width: 16, height: 16, color: "#94a3b8", pointerEvents: "none",
                  }} />
                  <input
                      type="text"
                      placeholder="Search for anything..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="si"
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14,
                        paddingTop: 10, paddingBottom: 10,
                        border: "1.5px solid #e2e8f0", borderRadius: 4,
                        fontSize: 14, fontFamily: "inherit", color: INK,
                        background: "#f8fafc",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxSizing: "border-box",
                      }}
                  />
                  {search && (
                      <button onClick={() => setSearch("")} style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", padding: 0,
                        display: "flex", alignItems: "center",
                      }}>
                        <X style={{ width: 14, height: 14, color: "#94a3b8" }} />
                      </button>
                  )}
                </div>

                {/* Category dropdown */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="fs"
                      style={{
                        paddingLeft: 14, paddingRight: 36, paddingTop: 10, paddingBottom: 10,
                        border: "1.5px solid #e2e8f0", borderRadius: 4,
                        fontSize: 14, fontFamily: "inherit", color: INK,
                        background: "#f8fafc", cursor: "pointer",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        appearance: "none",
                      }}
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <ChevronDown style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    width: 14, height: 14, color: "#94a3b8", pointerEvents: "none",
                  }} />
                </div>

                {/* Type filter */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {(["", "free", "paid"] as const).map(t => (
                      <button
                          key={t}
                          onClick={() => setType(t)}
                          style={{
                            padding: "9px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                            border: "1.5px solid",
                            borderColor: type === t ? BRAND : "#e2e8f0",
                            background: type === t ? BRAND : "#f8fafc",
                            color: type === t ? "#fff" : INK,
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "all 0.18s",
                          }}
                      >
                        {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                      </button>
                  ))}
                </div>

                {/* Clear */}
                {hasFilters && (
                    <button
                        onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "9px 14px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                          border: "1.5px solid #fee2e2", background: "#fef2f2",
                          color: RED, cursor: "pointer", fontFamily: "inherit",
                          transition: "all 0.15s", flexShrink: 0,
                        }}
                    >
                      <X style={{ width: 12, height: 12 }} /> Clear
                    </button>
                )}

                {!isLoading && (
                    <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════ */}
          <section style={{ background: PAPER, position: "relative" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

              {isLoading ? (
                  <>
                    <div style={{ marginBottom: 48 }}>
                      <div style={{ height: 28, width: 200, background: "#e2e8f0", borderRadius: 4, marginBottom: 20 }} className="animate-pulse" />
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                      </div>
                    </div>
                  </>
              ) : filtered.length === 0 ? (
                  <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        borderRadius: 8, padding: "clamp(48px, 8vw, 80px) clamp(24px, 6vw, 56px)",
                        textAlign: "center",
                        background: "#fff",
                        border: "1px dashed #e2e8f0",
                      }}
                  >
                    <BookOpen style={{ width: 56, height: 56, color: "#cbd5e1", margin: "0 auto 16px" }} />
                    <p style={{ color: INK, fontWeight: 700, fontSize: 20, marginBottom: 8, letterSpacing: "-0.02em" }}>
                      No courses found
                    </p>
                    <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                      Try adjusting your search or filters to find what you are looking for.
                    </p>
                    {hasFilters && (
                        <button
                            onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                            style={{
                              padding: "12px 28px", borderRadius: 4,
                              background: BRAND, color: "#fff", fontWeight: 700, fontSize: 14,
                              cursor: "pointer", border: "none", fontFamily: "inherit",
                              transition: "background 0.2s",
                            }}
                            className="hover:bg-blue-700"
                        >
                          Clear all filters
                        </button>
                    )}
                  </motion.div>
              ) : (
                  <AnimatePresence mode="wait">
                    {hasFilters ? (
                        <motion.div
                            key="filtered"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                          <SectionHeader
                              title={search ? `Results for "${search}"` : category ? CAT_LABEL[category] ?? category : type ? (type === "free" ? "Free Courses" : "Premium Courses") : "All Courses"}
                              subtitle={`${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`}
                          />
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                            {filtered.map((c, i) => (
                                <CourseCard key={c._id} course={c} index={i} isLoggedIn={isLoggedIn} />
                            ))}
                          </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                          {/* Bestsellers */}
                          {bestsellers.length > 0 && (
                              <CourseCarousel
                                  title="Bestsellers"
                                  subtitle="Most popular courses right now"
                                  courses={bestsellers}
                                  isLoggedIn={isLoggedIn}
                                  loading={isLoading}
                              />
                          )}

                          {/* New & Noteworthy */}
                          {newCourses.length > 0 && (
                              <CourseCarousel
                                  title="New & Noteworthy"
                                  subtitle="Fresh courses added this week"
                                  courses={newCourses}
                                  isLoggedIn={isLoggedIn}
                                  loading={isLoading}
                              />
                          )}

                          {/* Highest Rated */}
                          {highestRated.length > 0 && (
                              <CourseCarousel
                                  title="Highest Rated"
                                  subtitle="Top-rated by our students"
                                  courses={highestRated}
                                  isLoggedIn={isLoggedIn}
                                  loading={isLoading}
                              />
                          )}

                          {/* Free Courses */}
                          {freeCourses.length > 0 && (
                              <CourseCarousel
                                  title="Free Courses"
                                  subtitle="Start learning at no cost"
                                  courses={freeCourses}
                                  isLoggedIn={isLoggedIn}
                                  loading={isLoading}
                              />
                          )}

                          {/* All Courses Grid */}
                          <div style={{ marginBottom: 48 }}>
                            <SectionHeader
                                title="All Courses"
                                subtitle="Browse our complete catalog"
                            />
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                              {filtered.map((c, i) => (
                                  <CourseCard key={c._id} course={c} index={i} isLoggedIn={isLoggedIn} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
              )}
            </div>
          </section>

          {/* ═══════════════════════════════════════════
            GUEST CTA BANNER
            ═══════════════════════════════════════════ */}
          {!isLoggedIn && !isLoading && (
              <section style={{ background: PAPER }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      style={{
                        borderRadius: 8,
                        background: INK,
                        padding: "clamp(32px, 5vw, 48px) clamp(24px, 5vw, 48px)",
                        display: "flex", flexWrap: "wrap", alignItems: "center",
                        justifyContent: "space-between", gap: 24,
                        position: "relative", overflow: "hidden",
                      }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${BRAND}, ${BRAND_LIGHT})`,
                    }} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
                      <h3 style={{
                        color: "#fff", fontWeight: 800, fontSize: "clamp(18px, 2.5vw, 24px)",
                        margin: "0 0 8px", letterSpacing: "-0.02em",
                      }}>
                        Start learning today
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                        Get unlimited access to all courses, track your progress, and earn certificates.
                        Join 50,000+ students already learning with us.
                      </p>
                    </div>
                    <Link
                        href="/login?redirect=/courses"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          padding: "14px 28px", borderRadius: 4, flexShrink: 0,
                          background: BRAND, color: "#fff",
                          fontWeight: 700, fontSize: 15, textDecoration: "none",
                          transition: "background 0.2s",
                          position: "relative", zIndex: 1,
                        }}
                        className="hover:bg-blue-700"
                    >
                      Sign up for free <ArrowRight style={{ width: 16, height: 16 }} />
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