'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play, Lock, BookOpen, Clock, ArrowRight, Sparkles,
  TrendingUp, CheckCircle, Star, Award, ChevronRight, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAuthToken, removeAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BRAND      = '#2563eb';
const BRAND_DEEP = '#1d4ed8';
const PAPER      = '#F8F6F1';
const INK        = '#0f172a';
const MUTED      = '#64748b';

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  contentType: 'free' | 'paid' | 'exclusive';
  price: number;
  category: string;
  thumbnail?: string;
  difficulty?: string;
  certificateEnabled?: boolean;
  tags?: string[];
  totalDuration?: number;
  analytics?: { enrollments: number; averageRating: number };
  mentorId: {
    name: string;
    designation: string;
    profileImage?: string;
    company?: string;
  };
  enrollment?: {
    progress: number;
    lastAccessedAt: string;
  };
}

const CAT_LABEL: Record<string, string> = {
  'mock-interview':  'Mock Interview',
  'resume-building': 'Resume',
  'gd-practice':     'Group Discussion',
  'placement-prep':  'Placement Prep',
  'coding':          'Coding',
  'behavioral':      'Behavioral',
  'career-growth':   'Career Growth',
  'skills':          'Skills',
  'system-design':   'System Design',
  'other':           'Other',
};

const DIFF_COLOR: Record<string, string> = {
  beginner:     '#10b981',
  intermediate: '#2563eb',
  advanced:     '#f97316',
  expert:       '#ef4444',
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Enrolled / "Continue Learning" card — horizontal bento style ─────────────
function EnrolledCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);
  const pct = course.enrollment?.progress ?? 0;
  const isDone = pct >= 100;

  return (
    <Link
      href={`/dashboard/content/${course._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: 20, overflow: 'hidden',
        background: hovered ? '#fff' : 'rgba(255,255,255,0.82)',
        border: hovered ? '1px solid rgba(29,78,216,0.22)' : '1px solid rgba(29,78,216,0.11)',
        boxShadow: hovered
          ? '0 20px 52px rgba(29,78,216,0.12), 0 4px 14px rgba(29,78,216,0.06)'
          : '0 2px 12px rgba(29,78,216,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(.23,1,.32,1)',
        textDecoration: 'none', height: '100%',
        position: 'relative',
      }}
    >
      {/* Top accent */}
      <div style={{
        height: 3,
        background: hovered
          ? isDone
            ? 'linear-gradient(90deg,#10b981,#059669)'
            : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`
          : 'transparent',
        transition: 'background 0.3s',
      }} />

      {/* Thumbnail */}
      <div style={{
        position: 'relative', height: 140, flexShrink: 0,
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        overflow: 'hidden',
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.22)' }} />
            </div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.45),transparent)' }} />

        {/* Play overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
          background: 'rgba(15,23,42,0.2)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            <Play style={{ width: 18, height: 18, color: BRAND, fill: BRAND, marginLeft: 2 }} />
          </div>
        </div>

        {/* Done badge */}
        {isDone && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#059669', color: '#fff',
            fontSize: 10, fontWeight: 700,
            padding: '3px 9px', borderRadius: 99,
            boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
          }}>
            <CheckCircle style={{ width: 9, height: 9 }} /> Completed
          </div>
        )}

        {/* Category chip */}
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.28)',
            color: '#fff', backdropFilter: 'blur(4px)',
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px 18px 18px', gap: 10 }}>
        <h3 style={{
          fontSize: 14.5, fontWeight: 700, color: hovered ? BRAND_DEEP : INK,
          lineHeight: 1.3, margin: 0, letterSpacing: '-0.015em',
          transition: 'color 0.2s',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.title}
        </h3>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 8.5, fontWeight: 700,
          }}>
            {initials(course.mentorId.name)}
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: MUTED }}>
            {course.mentorId.name}
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: isDone ? '#059669' : BRAND }}>{pct}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'rgba(29,78,216,0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${pct}%`,
              background: isDone
                ? 'linear-gradient(90deg,#10b981,#059669)'
                : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Link
            href={`/dashboard/content/${course._id}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 0', borderRadius: 11,
              background: hovered
                ? isDone
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`
                : 'linear-gradient(135deg,#1e3a8a22,#2563eb22)',
              color: hovered ? '#fff' : BRAND_DEEP,
              fontWeight: 700, fontSize: 12,
              border: `1px solid ${hovered ? 'transparent' : 'rgba(29,78,216,0.18)'}`,
              transition: 'all 0.25s cubic-bezier(.23,1,.32,1)',
              boxShadow: hovered ? '0 8px 20px rgba(37,99,235,0.28)' : 'none',
              textDecoration: 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Play style={{ width: 10, height: 10, fill: hovered ? '#fff' : BRAND_DEEP }} />
            {isDone ? 'Review' : pct > 0 ? 'Continue' : 'Start'}
          </Link>
          <Link
            href={`/dashboard/content/${course._id}`}
            title="Course details"
            style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,78,216,0.18)',
              color: BRAND, textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Info style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>
    </Link>
  );
}

// ── Catalogue card — for all / free / paid tabs ───────────────────────────────
function CatalogueCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);
  const isPaid    = course.contentType === 'paid' || course.contentType === 'exclusive';
  const isEnrolled = !!course.enrollment;
  const pct       = course.enrollment?.progress ?? 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        borderRadius: 20, overflow: 'hidden',
        background: hovered ? '#fff' : 'rgba(255,255,255,0.78)',
        border: hovered ? '1px solid rgba(29,78,216,0.22)' : '1px solid rgba(29,78,216,0.1)',
        boxShadow: hovered
          ? '0 20px 52px rgba(29,78,216,0.11), 0 4px 14px rgba(29,78,216,0.06)'
          : '0 2px 12px rgba(29,78,216,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(.23,1,.32,1)',
      }}
    >
      {/* Hover top accent */}
      <div style={{
        height: 2,
        background: hovered ? `linear-gradient(90deg,${BRAND},rgba(29,78,216,0.3),transparent)` : 'transparent',
        transition: 'background 0.3s',
      }} />

      {/* Thumbnail */}
      <div style={{
        position: 'relative', height: 155, flexShrink: 0,
        background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', overflow: 'hidden',
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.87 }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen style={{ width: 44, height: 44, color: 'rgba(255,255,255,0.2)' }} />
            </div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.48),transparent)' }} />

        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
            padding: '3px 9px', borderRadius: 99,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.28)',
            color: '#fff', backdropFilter: 'blur(4px)',
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>

        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {isPaid
            ? <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 99,
                background: BRAND, color: '#fff',
                display: 'inline-flex', alignItems: 'center', gap: 3,
                boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
              }}><Lock style={{ width: 8, height: 8 }} /> ₹{course.price}</span>
            : <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 99,
                background: '#10b981', color: '#fff', boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
              }}>Free</span>
          }
        </div>

        {isEnrolled && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(16,185,129,0.92)', color: '#fff',
            fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
          }}>
            <CheckCircle style={{ width: 8, height: 8 }} /> Enrolled
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px 18px 18px', gap: 10 }}>
        {/* Difficulty */}
        {course.difficulty && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 600, color: MUTED }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: DIFF_COLOR[course.difficulty] ?? MUTED, display: 'inline-block', flexShrink: 0 }} />
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
        )}

        <h3 style={{
          fontSize: 15, fontWeight: 700, color: hovered ? BRAND_DEEP : INK,
          lineHeight: 1.3, margin: 0, letterSpacing: '-0.018em',
          transition: 'color 0.2s',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.title}
        </h3>

        {(course.shortDescription || course.description) && (
          <p style={{
            fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.shortDescription || course.description}
          </p>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(29,78,216,0.07)', marginTop: 'auto' }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: MUTED }}>
              <TrendingUp style={{ width: 11, height: 11 }} />
              {course.analytics!.enrollments.toLocaleString('en-IN')}
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: MUTED }}>
              <Star style={{ width: 11, height: 11, color: '#f59e0b', fill: '#f59e0b' }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: 99 }}>
              <Award style={{ width: 8, height: 8 }} /> Cert
            </span>
          )}
        </div>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 9.5, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(29,78,216,0.22)',
          }}>
            {initials(course.mentorId.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: INK, margin: 0 }}>{course.mentorId.name}</p>
            {course.mentorId.company && <p style={{ fontSize: 10, color: BRAND, fontWeight: 500, margin: 0 }}>{course.mentorId.company}</p>}
          </div>
        </div>

        {/* Progress if enrolled */}
        {isEnrolled && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTED }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: pct >= 100 ? '#059669' : BRAND }}>{pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'rgba(29,78,216,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: pct >= 100 ? 'linear-gradient(90deg,#10b981,#059669)' : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        {/* CTA row */}
        <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
          {/* Primary action */}
          {isEnrolled ? (
            <Link href={`/dashboard/content/${course._id}`} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 0', borderRadius: 12,
              background: hovered ? `linear-gradient(135deg,${BRAND},${BRAND_DEEP})` : 'linear-gradient(135deg,#1e3a8a22,#2563eb22)',
              border: `1px solid ${hovered ? BRAND : 'rgba(29,78,216,0.2)'}`,
              color: hovered ? '#fff' : BRAND_DEEP,
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              transition: 'all 0.25s cubic-bezier(.23,1,.32,1)',
              boxShadow: hovered ? '0 8px 20px rgba(37,99,235,0.28)' : 'none',
            }}>
              <Play style={{ width: 11, height: 11, fill: hovered ? '#fff' : BRAND_DEEP }} />
              {pct >= 100 ? 'Review' : pct > 0 ? 'Continue' : 'Start'}
            </Link>
          ) : isPaid ? (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 7 }}>
                <span style={{ fontSize: 19, fontWeight: 800, color: INK, letterSpacing: '-0.03em' }}>₹{course.price}</span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>+ GST</span>
              </div>
              <Link href={`/dashboard/checkout/${course._id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px 0', borderRadius: 12,
                background: hovered ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#10b98122,#05966922)',
                border: `1px solid ${hovered ? '#059669' : 'rgba(16,185,129,0.3)'}`,
                color: hovered ? '#fff' : '#059669',
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(.23,1,.32,1)',
                boxShadow: hovered ? '0 8px 20px rgba(5,150,105,0.28)' : 'none',
              }}>
                <Lock style={{ width: 11, height: 11 }} /> Buy Now
              </Link>
            </div>
          ) : (
            <Link href={`/dashboard/content/${course._id}`} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 0', borderRadius: 12,
              background: hovered ? `linear-gradient(135deg,${BRAND},${BRAND_DEEP})` : 'linear-gradient(135deg,#1e3a8a22,#2563eb22)',
              border: `1px solid ${hovered ? BRAND : 'rgba(29,78,216,0.2)'}`,
              color: hovered ? '#fff' : BRAND_DEEP,
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              transition: 'all 0.25s cubic-bezier(.23,1,.32,1)',
              boxShadow: hovered ? '0 8px 20px rgba(37,99,235,0.28)' : 'none',
            }}>
              <Play style={{ width: 11, height: 11, fill: hovered ? '#fff' : BRAND_DEEP }} /> View Free
            </Link>
          )}

          {/* Details button */}
          <Link
            href={`/dashboard/content/${course._id}`}
            title="Course details"
            style={{
              flexShrink: 0, width: 40, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              alignSelf: 'flex-end',
              background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,78,216,0.18)',
              color: BRAND, textDecoration: 'none',
              transition: 'all 0.18s',
              padding: '10px 0',
            }}
          >
            <Info style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div style={{
      height: tall ? 320 : 400, borderRadius: 20,
      background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(29,78,216,0.08)',
    }} className="animate-pulse" />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const router = useRouter();
  const [allCourses, setCourses]       = useState<Course[]>([]);
  const [enrolledCourses, setEnrolled] = useState<Course[]>([]);
  const [activeTab, setTab]            = useState<'all' | 'free' | 'paid' | 'enrolled'>('all');
  const [isLoading, setLoading]        = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) { router.push('/login'); return; }
      setLoading(true);
      try {
        const [coursesRes, enrollRes] = await Promise.all([
          fetch(`${API_URL}/advanced/courses/published?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/enrollments/my-enrollments`,            { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [coursesData, enrollData] = await Promise.all([coursesRes.json(), enrollRes.json()]);

        const courses: Course[] = coursesData.success ? (coursesData.data.courses || []) : [];

        // Build enrollment map
        const enrollMap = new Map<string, { progress: number; lastAccessedAt: string }>();
        if (enrollData.success) {
          enrollData.data.forEach((e: any) => {
            if (e.courseId?._id) {
              enrollMap.set(e.courseId._id, { progress: e.progress || 0, lastAccessedAt: e.lastAccessedAt || e.enrolledAt });
            }
          });
        }

        const merged = courses.map((c: Course) => ({
          ...c,
          enrollment: enrollMap.get(c._id) || c.enrollment,
        }));

        setCourses(merged);

        const enrolled = enrollData.success
          ? enrollData.data
              .filter((e: any) => e.courseId)
              .map((e: any) => ({ ...e.courseId, enrollment: { progress: e.progress || 0, lastAccessedAt: e.lastAccessedAt || e.enrolledAt } }))
          : [];
        setEnrolled(enrolled);
      } catch (err: any) {
        if (err?.status === 401) { removeAuthToken(); router.push('/login'); }
        else toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const free = allCourses.filter(c => c.contentType === 'free');
  const paid = allCourses.filter(c => c.contentType === 'paid' || c.contentType === 'exclusive');
  const totalDone = enrolledCourses.filter(c => (c.enrollment?.progress ?? 0) >= 100).length;
  const inProgress = enrolledCourses.filter(c => {
    const p = c.enrollment?.progress ?? 0;
    return p > 0 && p < 100;
  });

  const TABS = [
    { key: 'all',      label: 'All Courses',   count: allCourses.length },
    { key: 'free',     label: 'Free',           count: free.length },
    { key: 'paid',     label: 'Premium',        count: paid.length },
    { key: 'enrolled', label: 'My Learning',    count: enrolledCourses.length },
  ] as const;

  const tabCourses = {
    all:      allCourses,
    free:     free,
    paid:     paid,
    enrolled: enrolledCourses,
  }[activeTab];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .cd-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: PAPER, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '5%', left: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,78,216,0.055) 0%,transparent 70%)', filter: 'blur(90px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(8,145,178,0.045) 0%,transparent 70%)', filter: 'blur(90px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px)' }}>

          {/* ── Page header ── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ width: 'clamp(20px,4vw,32px)', height: 1, background: 'linear-gradient(90deg,transparent,#2563eb)' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 99, background: '#2563eb14', border: '1px solid #2563eb33' }}>
                <Sparkles size={10} style={{ color: BRAND }} />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: BRAND, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Learning Hub</span>
              </div>
              <span style={{ width: 'clamp(20px,4vw,32px)', height: 1, background: 'linear-gradient(90deg,#2563eb,transparent)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: INK, margin: 0, letterSpacing: '-0.033em', lineHeight: 1.1 }}>
                  Your Courses
                </h1>
                <p style={{ fontSize: 14, color: MUTED, margin: '8px 0 0', fontWeight: 400 }}>
                  Track progress, continue learning, and explore new content.
                </p>
              </div>

              {/* Quick stats pill */}
              {!isLoading && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'clamp(12px,3vw,28px)',
                  flexWrap: 'wrap',
                  padding: '11px 18px', borderRadius: 99,
                  background: '#fff', border: '1px solid rgba(29,78,216,0.12)',
                  boxShadow: '0 4px 16px rgba(29,78,216,0.07)',
                }}>
                  {[
                    { val: String(enrolledCourses.length), label: 'Enrolled' },
                    { val: String(inProgress.length),      label: 'In Progress' },
                    { val: String(totalDone),               label: 'Completed' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: BRAND, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Bento: Continue Learning spotlight ── */}
          {!isLoading && inProgress.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp style={{ width: 15, height: 15, color: BRAND }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>Continue Learning</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: MUTED, background: 'rgba(29,78,216,0.07)', padding: '2px 8px', borderRadius: 99 }}>{inProgress.length}</span>
                </div>
                <button onClick={() => setTab('enrolled')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12, fontWeight: 600, color: BRAND, background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px', borderRadius: 8,
                }}>
                  See all <ChevronRight style={{ width: 13, height: 13 }} />
                </button>
              </div>

              {/* Bento grid: first card wide, rest compact */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                gap: 16,
              }} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inProgress.slice(0, 4).map(c => (
                  <EnrolledCard key={c._id} course={c} />
                ))}
              </div>
            </div>
          )}

          {/* ── Bento: Recently completed ── */}
          {!isLoading && totalDone > 0 && (
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <CheckCircle style={{ width: 15, height: 15, color: '#059669' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>Completed</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#059669', background: '#f0fdf4', padding: '2px 8px', borderRadius: 99, border: '1px solid #bbf7d0' }}>{totalDone}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                gap: 16,
              }} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {enrolledCourses.filter(c => (c.enrollment?.progress ?? 0) >= 100).slice(0, 4).map(c => (
                  <EnrolledCard key={c._id} course={c} />
                ))}
              </div>
            </div>
          )}

          {/* ── Divider before catalogue ── */}
          {!isLoading && (inProgress.length > 0 || totalDone > 0) && (
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(29,78,216,0.14),transparent)', margin: '0 0 32px' }} />
          )}

          {/* ── Tabs ── */}
          <div style={{ marginBottom: 24 }}>
            <div className="cd-scroll" style={{
              display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2,
            }}>
              {TABS.map(t => {
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    style={{
                      flexShrink: 0,
                      padding: '8px 18px', borderRadius: 99,
                      fontSize: 13, fontWeight: 600,
                      border: '1px solid',
                      borderColor: active ? BRAND : 'rgba(29,78,216,0.16)',
                      background: active ? BRAND : 'rgba(255,255,255,0.9)',
                      color: active ? '#fff' : MUTED,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.18s',
                      boxShadow: active ? '0 4px 14px rgba(37,99,235,0.24)' : 'none',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {t.label}
                    <span style={{
                      fontSize: 10.5, fontWeight: 700,
                      padding: '1px 6px', borderRadius: 99,
                      background: active ? 'rgba(255,255,255,0.2)' : 'rgba(29,78,216,0.08)',
                      color: active ? '#fff' : BRAND,
                    }}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Course grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : tabCourses.length === 0 ? (
            <div style={{
              borderRadius: 20, padding: 'clamp(40px,6vw,64px) clamp(24px,6vw,48px)',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(29,78,216,0.09)',
              boxShadow: '0 4px 20px rgba(29,78,216,0.05)',
            }}>
              <BookOpen style={{ width: 48, height: 48, color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontWeight: 700, fontSize: 17, color: INK, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {activeTab === 'enrolled' ? "You haven't enrolled yet" : 'No courses here yet'}
              </p>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.6, maxWidth: 340, margin: '0 auto 20px' }}>
                {activeTab === 'enrolled'
                  ? 'Explore the catalogue and enroll in a course to start tracking your progress.'
                  : 'Check back soon — new content is added regularly.'}
              </p>
              {activeTab === 'enrolled' && (
                <button onClick={() => setTab('all')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 24px', borderRadius: 12,
                  background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.28)',
                }}>
                  Browse all courses <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tabCourses.map((c, i) =>
                activeTab === 'enrolled'
                  ? <EnrolledCard key={c._id} course={c} />
                  : <CatalogueCard key={c._id} course={c} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}