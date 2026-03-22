// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { authAPI, setAuthToken } from '@/lib/api';
// import { useAuth } from '@/context/AuthContext';

// export default function SignupPage() {
//   const router = useRouter();
//   const { isLoggedIn, isLoading: authLoading, fetchUser } = useAuth();
//   const [googleData, setGoogleData] = useState<any>(null);
//   const [userType, setUserType] = useState<'student' | 'professional'>('student');
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     mobile: '',
//     yearOfStudy: '',
//     company: '',
//     designation: '',
//     yearsOfExperience: '',
//     skills: '',
//   });

//   useEffect(() => {
//     if (!authLoading && isLoggedIn) {
//       router.push('/dashboard');
//     }
//   }, [isLoggedIn, authLoading, router]);

//   useEffect(() => {
//     const data = sessionStorage.getItem('googleData');
//     if (data) {
//       const parsed = JSON.parse(data);
//       setGoogleData(parsed);
//       setFormData(prev => ({
//         ...prev,
//         name: parsed.name || '',
//         email: parsed.email || '',
//       }));
//     }
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.mobile) {
//       toast.error('Name, email, and mobile are required');
//       return;
//     }

//     if (!googleData && !formData.password) {
//       toast.error('Password is required');
//       return;
//     }

//     if (userType === 'student' && !formData.yearOfStudy) {
//       toast.error('Year of study is required');
//       return;
//     }

//     if (userType === 'professional' && (!formData.company || !formData.designation || !formData.yearsOfExperience)) {
//       toast.error('Company, designation, and experience are required');
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const signupData: any = {
//         name: formData.name,
//         email: formData.email,
//         mobile: formData.mobile,
//         userType,
//         isEmailSignup: !googleData,
//         skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
//       };

//       if (!googleData) {
//         signupData.password = formData.password;
//       }

//       if (userType === 'student') {
//         signupData.yearOfStudy = parseInt(formData.yearOfStudy);
//       } else {
//         signupData.company = formData.company;
//         signupData.designation = formData.designation;
//         signupData.yearsOfExperience = parseInt(formData.yearsOfExperience);
//       }

//       const response = await authAPI.signup(signupData);
//       setAuthToken(response.data.token);
//       await fetchUser(); // Wait for auth context to update
//       toast.success('Account created successfully!');
//       sessionStorage.removeItem('googleData');

//       // Allow time for auth state to propagate
//       setTimeout(() => router.push('/dashboard'), 800);
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || 'Signup failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
//       {/* Background Effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
//       </div>

//       <div className="relative w-full max-w-lg">
//         {/* Logo */}
//         <Link href="/" className="flex items-center justify-center gap-2 mb-8">
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold">C</span>
//           </div>
//           <span className="text-xl font-semibold text-slate-900">YourInterviewCoach</span>
//         </Link>

//         {/* Form Card */}
//         <div className="bg-white/80  border border-blue-200/50 rounded-3xl p-8">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-900 mb-2">Create account</h1>
//             <p className="text-slate-600 text-sm">Start your journey with us</p>
//           </div>

//           {!googleData && (
//             <Link href="/login" className="block w-full mb-6">
//               <div className="w-full py-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100 transition">
//                 <p className="text-slate-900 font-semibold">Sign up with Google</p>
//                 <p className="text-slate-600 text-xs mt-1">Quick signup in one click</p>
//               </div>
//             </Link>
//           )}

//           {!googleData && (
//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-blue-200" />
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="bg-white px-3 text-xs text-slate-500">OR</span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSignup} className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm text-slate-700 mb-2">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   disabled={!!googleData}
//                   placeholder="Your name"
//                   className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition disabled:opacity-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-slate-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={!!googleData}
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition disabled:opacity-50"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm text-slate-700 mb-2">Mobile</label>
//                 <input
//                   type="tel"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   placeholder="+91 98765 43210"
//                   className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                 />
//               </div>

//               {!googleData && (
//                 <div>
//                   <label className="block text-sm text-slate-700 mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                   />
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm text-slate-700 mb-2">I am a</label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setUserType('student')}
//                   className={`p-3 rounded-lg border transition ${
//                     userType === 'student'
//                       ? 'bg-blue-100 border-blue-400'
//                       : 'bg-blue-50 border-blue-200 hover:border-blue-300'
//                   }`}
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">🎓</div>
//                     <div className={`text-sm font-semibold ${userType === 'student' ? 'text-blue-600' : 'text-slate-700'}`}>
//                       Student
//                     </div>
//                   </div>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setUserType('professional')}
//                   className={`p-3 rounded-lg border transition ${
//                     userType === 'professional'
//                       ? 'bg-blue-100 border-blue-400'
//                       : 'bg-blue-50 border-blue-200 hover:border-blue-300'
//                   }`}
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">💼</div>
//                     <div className={`text-sm font-semibold ${userType === 'professional' ? 'text-blue-600' : 'text-slate-700'}`}>
//                       Professional
//                     </div>
//                   </div>
//                 </button>
//               </div>
//             </div>

//             {userType === 'student' && (
//               <div>
//                 <label className="block text-sm text-slate-700 mb-2">Year of Study</label>
//                 <select
//                   name="yearOfStudy"
//                   value={formData.yearOfStudy}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                 >
//                   <option value="">Select year</option>
//                   <option value="1">1st Year</option>
//                   <option value="2">2nd Year</option>
//                   <option value="3">3rd Year</option>
//                   <option value="4">4th Year</option>
//                 </select>
//               </div>
//             )}

//             {userType === 'professional' && (
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <label className="block text-sm text-slate-700 mb-2">Company</label>
//                   <input
//                     type="text"
//                     name="company"
//                     value={formData.company}
//                     onChange={handleInputChange}
//                     placeholder="Google"
//                     className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-slate-700 mb-2">Role</label>
//                   <input
//                     type="text"
//                     name="designation"
//                     value={formData.designation}
//                     onChange={handleInputChange}
//                     placeholder="Engineer"
//                     className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-slate-700 mb-2">Exp (yrs)</label>
//                   <input
//                     type="number"
//                     name="yearsOfExperience"
//                     value={formData.yearsOfExperience}
//                     onChange={handleInputChange}
//                     placeholder="3"
//                     className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm text-slate-700 mb-2">Skills (optional)</label>
//               <input
//                 type="text"
//                 name="skills"
//                 value={formData.skills}
//                 onChange={handleInputChange}
//                 placeholder="Python, React, System Design"
//                 className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//             >
//               {isLoading ? 'Creating account...' : 'Create account'}
//             </button>
//           </form>

//           <p className="text-center text-sm text-slate-600 mt-6">
//             Already have an account?{' '}
//             <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
//               Sign in
//             </Link>
//           </p>
//         </div>

//         {/* Bottom Links */}
//         <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-600">
//           <Link href="/" className="hover:text-blue-600">Home</Link>
//           <span>•</span>
//           <Link href="/#features" className="hover:text-blue-600">Features</Link>
//           <span>•</span>
//           <Link href="/#pricing" className="hover:text-blue-600">Pricing</Link>
//         </div>
//       </div>
//     </div>
//   );
// }





'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authAPI, setAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Check, Eye, EyeOff, GraduationCap, Briefcase, User, Mail, Phone, Lock, Building2, BadgeCheck, Clock, ChevronRight } from 'lucide-react';

/* ── tiny field-level validation helpers ── */
const validators = {
  name:              (v: string) => v.trim().length >= 2,
  email:             (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  mobile:            (v: string) => /^[6-9]\d{9}$/.test(v),
  password:          (v: string) => v.length >= 6,
  yearOfStudy:       (v: string) => !!v,
  company:           (v: string) => v.trim().length >= 1,
  designation:       (v: string) => v.trim().length >= 1,
  yearsOfExperience: (v: string) => !!v && parseInt(v) >= 0,
};

function FieldValid({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
      <Check className="w-3 h-3 text-white" strokeWidth={3} />
    </span>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, fetchUser } = useAuth();
  const [googleData, setGoogleData] = useState<any>(null);
  const [userType, setUserType] = useState<'student' | 'professional'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    yearOfStudy: '',
    company: '',
    designation: '',
    yearsOfExperience: '',
    skills: '',
  });

  useEffect(() => {
    if (!authLoading && isLoggedIn) router.push('/dashboard');
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const data = sessionStorage.getItem('googleData');
    if (data) {
      const parsed = JSON.parse(data);
      setGoogleData(parsed);
      setFormData(prev => ({ ...prev, name: parsed.name || '', email: parsed.email || '' }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      if (digitsOnly.length > 0 && !/^[6-9]/.test(digitsOnly)) return;
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) => setTouched(prev => ({ ...prev, [name]: true }));

  const isValid = (field: keyof typeof validators) =>
    validators[field]?.(formData[field as keyof typeof formData] as string) ?? false;

  const showValid = (field: keyof typeof validators) => isValid(field);

  /* count filled required fields for progress */
  const requiredFields = ['name', 'email', 'mobile', ...(!googleData ? ['password'] : []),
    ...(userType === 'student' ? ['yearOfStudy'] : ['company', 'designation', 'yearsOfExperience'])];
  const filledCount = requiredFields.filter(f => isValid(f as keyof typeof validators)).length;
  const progressPct = Math.round((filledCount / requiredFields.length) * 100);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) { toast.error('Name, email, and mobile are required'); return; }
    if (!googleData && !formData.password) { toast.error('Password is required'); return; }
    if (userType === 'student' && !formData.yearOfStudy) { toast.error('Year of study is required'); return; }
    if (userType === 'professional' && (!formData.company || !formData.designation || !formData.yearsOfExperience)) {
      toast.error('Company, designation, and experience are required'); return;
    }
    try {
      setIsLoading(true);
      const signupData: any = {
        name: formData.name, email: formData.email, mobile: formData.mobile,
        userType, isEmailSignup: !googleData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };
      if (!googleData) signupData.password = formData.password;
      if (userType === 'student') signupData.yearOfStudy = parseInt(formData.yearOfStudy);
      else { signupData.company = formData.company; signupData.designation = formData.designation; signupData.yearsOfExperience = parseInt(formData.yearsOfExperience); }
      const response = await authAPI.signup(signupData);
      setAuthToken(response.data.token);
      await fetchUser();
      toast.success('Account created successfully!');
      sessionStorage.removeItem('googleData');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  /* shared input class */
  const inputBase = "w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200";
  const inputIdle = "bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .signup-grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .card-shadow { box-shadow: 0 4px 32px rgba(29,78,216,0.08), 0 1px 4px rgba(29,78,216,0.04); }

        .field-wrap input:focus ~ .field-icon,
        .field-wrap select:focus ~ .field-icon { color: #1d4ed8; }

        .progress-bar { transition: width 0.5s cubic-bezier(.23,1,.32,1); }

        .type-btn { transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease; }
        .type-btn:hover { transform: translateY(-1px); }
        .type-btn:active { transform: translateY(0); }

        .submit-btn {
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.30);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-slide { animation: fadeSlide 0.3s cubic-bezier(.23,1,.32,1) both; }
      `}</style>

      <div
        className="signup-grain min-h-screen flex items-center justify-center p-4 relative"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* grid */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(29,78,216,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,78,216,0.03) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }} />

        {/* blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(30%,-30%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 w-full max-w-[480px]">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-7 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
              <span className="text-white font-bold text-sm">YC</span>
            </div>
            <span className="text-slate-800 font-semibold text-base tracking-tight group-hover:text-blue-600 transition-colors">
              YourInterviewCoach
            </span>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-3xl p-7 card-shadow border border-slate-100">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">Create your account</h1>
              <p className="text-slate-500 text-sm">Start your journey to interview success</p>
            </div>

            {/* Progress bar */}
            {filledCount > 0 && (
              <div className="mb-5 fade-slide">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Profile completion</span>
                  <span className="text-[11px] font-bold" style={{ color: progressPct === 100 ? '#16a34a' : '#1d4ed8' }}>
                    {progressPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="progress-bar h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background: progressPct === 100
                        ? 'linear-gradient(90deg,#16a34a,#22c55e)'
                        : 'linear-gradient(90deg,#1e3a8a,#1d4ed8)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Google option */}
            {!googleData && (
              <>
                <Link href="/login" className="block w-full mb-5">
                  <div className="flex items-center justify-between w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      </div>
                      <div>
                        <p className="text-slate-800 font-semibold text-sm">Continue with Google</p>
                        <p className="text-slate-400 text-[11px]">Quick signup in one click</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 font-medium">or sign up with email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSignup} className="space-y-4" noValidate>

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="field-wrap">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Name</label>
                  <div className="relative">
                    <User className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      onBlur={() => handleBlur('name')} disabled={!!googleData}
                      placeholder="Your name" className={`${inputBase} ${inputIdle} disabled:opacity-60 disabled:bg-slate-50`} />
                    <FieldValid show={showValid('name')} />
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <Mail className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      onBlur={() => handleBlur('email')} disabled={!!googleData}
                      placeholder="you@example.com" className={`${inputBase} ${inputIdle} disabled:opacity-60 disabled:bg-slate-50`} />
                    <FieldValid show={showValid('email')} />
                  </div>
                </div>
              </div>

              {/* Mobile + Password */}
              <div className="grid grid-cols-2 gap-3">
                <div className="field-wrap">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mobile</label>
                  <div className="relative">
                    <Phone className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange}
                      onBlur={() => handleBlur('mobile')} placeholder="+91 98765 43210"
                      className={`${inputBase} ${inputIdle}`} />
                    <FieldValid show={showValid('mobile')} />
                  </div>
                </div>

                {!googleData && (
                  <div className="field-wrap">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <Lock className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                      <input type={showPassword ? 'text' : 'password'} name="password"
                        value={formData.password} onChange={handleInputChange}
                        onBlur={() => handleBlur('password')} placeholder="Min 6 chars"
                        className={`${inputBase} ${inputIdle} pr-16`} />
                      {/* toggle + valid — side by side */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {showValid('password') && (
                          <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </span>
                        )}
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                          className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {/* password strength hint */}
                    {formData.password && (
                      <div className="mt-1.5 flex gap-1">
                        {[1,2,3].map(i => (
                          <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
                            style={{
                              background: formData.password.length >= i * 3
                                ? i === 3 ? '#16a34a' : i === 2 ? '#eab308' : '#ef4444'
                                : '#e2e8f0'
                            }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User type */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['student', 'professional'] as const).map(type => (
                    <button key={type} type="button" onClick={() => setUserType(type)}
                      className={`type-btn relative p-3.5 rounded-xl border-2 text-left ${
                        userType === type
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          userType === type ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          {type === 'student'
                            ? <GraduationCap className={`w-4 h-4 ${userType === type ? 'text-blue-600' : 'text-slate-400'}`} />
                            : <Briefcase className={`w-4 h-4 ${userType === type ? 'text-blue-600' : 'text-slate-400'}`} />
                          }
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${userType === type ? 'text-blue-700' : 'text-slate-600'}`}>
                            {type === 'student' ? 'Student' : 'Professional'}
                          </p>
                          <p className="text-[10px] text-slate-400 hover:cursor-pointer">
                            {type === 'student' ? 'Currently studying' : 'Working professional'}
                          </p>
                        </div>
                      </div>
                      {userType === type && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student field */}
              {userType === 'student' && (
                <div className="fade-slide field-wrap">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Year of Study</label>
                  <div className="relative">
                    <Clock className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10 pointer-events-none" />
                    <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange}
                      onBlur={() => handleBlur('yearOfStudy')}
                      className={`${inputBase} ${inputIdle} appearance-none cursor-pointer`}>
                      <option value="">Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    <FieldValid show={showValid('yearOfStudy')} />
                  </div>
                </div>
              )}

              {/* Professional fields */}
              {userType === 'professional' && (
                <div className="fade-slide grid grid-cols-3 gap-3">
                  <div className="field-wrap">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Company</label>
                    <div className="relative">
                      <Building2 className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange}
                        onBlur={() => handleBlur('company')} placeholder="Google"
                        className={`${inputBase} ${inputIdle}`} />
                      <FieldValid show={showValid('company')} />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Role</label>
                    <div className="relative">
                      <BadgeCheck className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                      <input type="text" name="designation" value={formData.designation} onChange={handleInputChange}
                        onBlur={() => handleBlur('designation')} placeholder="Engineer"
                        className={`${inputBase} ${inputIdle}`} />
                      <FieldValid show={showValid('designation')} />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Exp (yrs)</label>
                    <div className="relative">
                      <Clock className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors z-10" />
                      <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience}
                        onChange={handleInputChange} onBlur={() => handleBlur('yearsOfExperience')}
                        placeholder="3" className={`${inputBase} ${inputIdle}`} />
                      <FieldValid show={showValid('yearsOfExperience')} />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="field-wrap">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Skills <span className="text-slate-400 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input type="text" name="skills" value={formData.skills} onChange={handleInputChange}
                    placeholder="Python, React, System Design, ..."
                    className={`${inputBase} ${inputIdle} pl-4`} />
                  {formData.skills.trim().length > 2 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
                {/* skill pills preview */}
                {formData.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.skills.split(',').filter(s => s.trim()).slice(0, 6).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-medium text-blue-700"
                        style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.15)' }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading || !validators.mobile(formData.mobile)}
                className="submit-btn w-full py-3.5 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: isLoading ? '#94a3b8' : 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-slate-400">
            {['Home', '/', 'Features', '/#features', 'Pricing', '/#pricing'].reduce<{ label: string; href: string }[]>((acc, val, i, arr) => {
              if (i % 2 === 0) acc.push({ label: arr[i] as string, href: arr[i + 1] as string });
              return acc;
            }, []).map(({ label, href }, i, arr) => (
              <span key={label} className="flex items-center gap-4">
                <Link href={href} className="hover:text-blue-600 transition-colors">{label}</Link>
                {i < arr.length - 1 && <span className="text-slate-200">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}