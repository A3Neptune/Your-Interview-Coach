'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check, Sparkles, ArrowRight, MessageCircle, Calendar, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StandardFooter from '@/components/StandardFooter';

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const contactInfo = [
  { icon: Mail, label: 'Email us', value: 'hello@yourinterviewcoach.com', sub: 'We reply within 2 hours', accent: '#2563eb', href: 'mailto:hello@yourinterviewcoach.com' },
  { icon: Phone, label: 'Call us', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM–7 PM IST', accent: '#0891b2', href: 'tel:+919876543210' },
  { icon: Calendar, label: 'Book a call', value: 'Free 15-min discovery', sub: 'No commitment needed', accent: '#7c3aed', href: '/select-slot' },
  { icon: MapPin, label: 'Based in', value: 'Bengaluru, India', sub: 'Serving clients worldwide', accent: '#059669', href: '#' },
];

const topics = ['Mock Interview', 'Career Roadmap', 'Resume Review', 'Group Workshop', 'Corporate Training', 'Other'];

type FormState = { name: string; email: string; topic: string; message: string };
type TouchedState = { [K in keyof FormState]?: boolean };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', topic: '', message: '' });
  const [touched, setTouched] = useState<TouchedState>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  function validate() {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.topic) errs.topic = 'Please pick a topic';
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Tell us a bit more (10+ chars)';
    return errs;
  }

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, topic: true, message: true });
    if (!isValid) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
  }

  function field(key: keyof FormState) {
    const hasErr = touched[key] && errors[key];
    const isFocused = focused === key;
    return {
      borderColor: hasErr ? '#ef4444' : isFocused ? '#2563eb' : 'rgba(219,234,254,0.8)',
      boxShadow: isFocused && !hasErr ? '0 0 0 3px rgba(37,99,235,0.12)' : hasErr ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
    };
  }

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '12px', fontSize: '14px',
    background: 'rgba(248,250,255,0.9)', border: '1.5px solid', outline: 'none', color: '#0f172a',
    fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  };
  const labelBase: React.CSSProperties = { fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' };

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#F8F6F1', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap');
        @keyframes ct-word { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ct-shim { from{transform:translateX(-120%) skewX(-8deg)} to{transform:translateX(280%) skewX(-8deg)} }
        @keyframes ct-success-in { from{opacity:0;transform:scale(0.88) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ct-check { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
        @keyframes ct-info-hover { from{transform:translateY(0)} to{transform:translateY(-3px)} }
        .ct-word { animation: ct-word 0.62s cubic-bezier(0.22,1,0.36,1) both; }
        .ct-info-card { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.2s ease; }
        .ct-info-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(37,99,235,0.1) !important; }
        .ct-submit { position:relative;overflow:hidden; transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),box-shadow 0.28s ease; will-change:transform; }
        .ct-submit:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.32)!important; }
        .ct-submit:not(:disabled):hover .ct-shim { animation:ct-shim 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ct-shim { position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);pointer-events:none; }
        .ct-success { animation: ct-success-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ct-check-path { stroke-dasharray:60;stroke-dashoffset:60;animation:ct-check 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ct-topic-dd { transition:max-height 0.32s cubic-bezier(0.22,1,0.36,1),opacity 0.25s ease; }
        @media(prefers-reduced-motion:reduce){ .ct-word,.ct-info-card,.ct-submit{animation:none!important;transition:none!important} }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{ position:'absolute',top:'6%',right:'-2%',width:'360px',height:'360px',background:'radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 68%)',borderRadius:'50%' }} />
          <div style={{ position:'absolute',bottom:'0',left:'5%',width:'280px',height:'280px',background:'radial-gradient(circle,rgba(8,145,178,0.06) 0%,transparent 68%)',borderRadius:'50%' }} />
          <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(37,99,235,0.06) 1px,transparent 1px)',backgroundSize:'36px 36px',WebkitMaskImage:'radial-gradient(ellipse 70% 55% at 50% 40%,black 0%,transparent 100%)',maskImage:'radial-gradient(ellipse 70% 55% at 50% 40%,black 0%,transparent 100%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="ct-word inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7" style={{ background:'rgba(255,255,255,0.88)',border:'1.5px solid rgba(147,197,253,0.6)',boxShadow:'0 2px 14px rgba(37,99,235,0.07)',animationDelay:'0ms' }}>
            <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Get in Touch</span>
          </div>

          <h1 style={{ fontFamily:"'Fraunces',serif",lineHeight:1.1,letterSpacing:'-0.02em',marginBottom:'14px' }}>
            {['We\'d love','to','hear'].map((w,i)=>(
              <span key={i} className="ct-word" style={{ display:'inline-block',marginRight:'0.22em',fontSize:'clamp(34px,7vw,66px)',fontWeight:300,color:'#0f172a',animationDelay:`${i*55+60}ms` }}>{w}</span>
            ))}
            <span className="ct-word" style={{ display:'inline-block',fontSize:'clamp(34px,7vw,66px)',fontStyle:'italic',fontWeight:600,color:'#2563eb',animationDelay:'230ms' }}>from you.</span>
          </h1>

          <p className="ct-word text-slate-500 max-w-lg mx-auto leading-relaxed" style={{ fontSize:'clamp(14px,2vw,16.5px)',animationDelay:'360ms' }}>
            Have a question? Want to book a session? Or just not sure where to start — we're here.
          </p>
        </div>
      </section>

      {/* ── INFO CARDS ROW ── */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((c,i)=>{
            const Icon=c.icon;
            return (
              <FadeUp key={i} delay={i*60}>
                <a href={c.href} className="ct-info-card block" style={{ padding:'18px 18px',borderRadius:'18px',background:'rgba(255,255,255,0.95)',border:`1.5px solid rgba(219,234,254,0.7)`,boxShadow:'0 2px 10px rgba(37,99,235,0.04)',textDecoration:'none',position:'relative',overflow:'hidden' }}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${c.accent},transparent)` }} />
                  <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:`${c.accent}10`,border:`1px solid ${c.accent}22`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px' }}>
                    <Icon style={{ width:'16px',height:'16px',color:c.accent }} />
                  </div>
                  <div style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'4px' }}>{c.label}</div>
                  <div style={{ fontSize:'13.5px',fontWeight:700,color:'#0f172a',marginBottom:'3px',lineHeight:1.25 }}>{c.value}</div>
                  <div style={{ fontSize:'11.5px',color:'#64748b' }}>{c.sub}</div>
                </a>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── MAIN CONTENT: form + aside ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

          {/* ── FORM ── */}
          <div className="lg:col-span-3">
            <FadeUp>
              <div style={{ borderRadius:'24px',background:'rgba(255,255,255,0.97)',border:'1.5px solid rgba(219,234,254,0.7)',boxShadow:'0 6px 30px rgba(37,99,235,0.06)',overflow:'hidden' }}>
                {/* Top bar */}
                <div style={{ height:'3px',background:'linear-gradient(90deg,#1e40af,#2563eb,#38bdf8,transparent)' }} />
                <div style={{ padding:'28px 28px 32px' }}>

                  {sent ? (
                    <div className="ct-success" style={{ textAlign:'center',padding:'32px 16px' }}>
                      <div style={{ width:'60px',height:'60px',borderRadius:'50%',background:'rgba(5,150,105,0.1)',border:'2px solid rgba(5,150,105,0.25)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px' }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path className="ct-check-path" d="M6 14l6 6 10-10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                      <h3 style={{ fontFamily:"'Fraunces',serif",fontSize:'22px',fontWeight:600,color:'#0f172a',marginBottom:'8px' }}>Message sent!</h3>
                      <p style={{ fontSize:'14px',color:'#64748b',lineHeight:1.6 }}>We'll get back to you within 2 hours. Check your inbox for a confirmation.</p>
                      <button onClick={()=>{setSent(false);setForm({name:'',email:'',topic:'',message:''});setTouched({});}} style={{ marginTop:'20px',padding:'10px 22px',borderRadius:'10px',fontSize:'13px',fontWeight:600,color:'#2563eb',background:'rgba(37,99,235,0.08)',border:'1.5px solid rgba(37,99,235,0.2)',cursor:'pointer',transition:'background 0.2s ease' }}>
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:'22px',fontWeight:600,color:'#0f172a',marginBottom:'6px' }}>Send us a message</h2>
                      <p style={{ fontSize:'13px',color:'#64748b',marginBottom:'24px' }}>Fill this out and we'll reply within a couple of hours.</p>

                      {/* Name + Email row */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="ct-name" style={labelBase}>Full name <span style={{ color:'#ef4444' }}>*</span></label>
                          <input
                            id="ct-name" type="text" placeholder="Arjun Mehra"
                            value={form.name}
                            onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                            onFocus={()=>setFocused('name')}
                            onBlur={()=>{setFocused(null);setTouched(t=>({...t,name:true}));}}
                            style={{ ...inputBase,...field('name') }}
                          />
                          {touched.name && errors.name && <p style={{ fontSize:'11.5px',color:'#ef4444',marginTop:'4px' }}>{errors.name}</p>}
                        </div>
                        {/* Email */}
                        <div>
                          <label htmlFor="ct-email" style={labelBase}>Email <span style={{ color:'#ef4444' }}>*</span></label>
                          <input
                            id="ct-email" type="email" placeholder="arjun@email.com"
                            value={form.email}
                            onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                            onFocus={()=>setFocused('email')}
                            onBlur={()=>{setFocused(null);setTouched(t=>({...t,email:true}));}}
                            style={{ ...inputBase,...field('email') }}
                          />
                          {touched.email && errors.email && <p style={{ fontSize:'11.5px',color:'#ef4444',marginTop:'4px' }}>{errors.email}</p>}
                        </div>
                      </div>

                      {/* Topic custom dropdown */}
                      <div style={{ marginBottom:'16px' }}>
                        <label style={labelBase}>Topic <span style={{ color:'#ef4444' }}>*</span></label>
                        <div style={{ position:'relative' }}>
                          <button
                            type="button"
                            onClick={()=>setTopicOpen(o=>!o)}
                            onBlur={()=>{setTimeout(()=>setTopicOpen(false),150);setTouched(t=>({...t,topic:true}));}}
                            style={{ ...inputBase,...field('topic'),display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',background: topicOpen ? 'rgba(255,255,255,0.98)':'rgba(248,250,255,0.9)' }}
                          >
                            <span style={{ color: form.topic ? '#0f172a':'#94a3b8' }}>{form.topic || 'Select a topic'}</span>
                            <ChevronDown style={{ width:'16px',height:'16px',color:'#94a3b8',transform: topicOpen ? 'rotate(180deg)':'rotate(0)',transition:'transform 0.25s ease',flexShrink:0 }} />
                          </button>
                          <div className="ct-topic-dd" style={{ position:'absolute',top:'calc(100% + 6px)',left:0,right:0,maxHeight: topicOpen ? '260px':'0',opacity: topicOpen ? 1:0,overflow:'hidden',borderRadius:'12px',background:'white',border:'1.5px solid rgba(219,234,254,0.8)',boxShadow:'0 8px 28px rgba(37,99,235,0.1)',zIndex:20 }}>
                            {topics.map((t)=>(
                              <button key={t} type="button"
                                onClick={()=>{setForm(f=>({...f,topic:t}));setTopicOpen(false);setTouched(td=>({...td,topic:true}));}}
                                style={{ width:'100%',padding:'10px 14px',textAlign:'left',background: form.topic===t ? 'rgba(37,99,235,0.06)':'transparent',color: form.topic===t ? '#2563eb':'#374151',fontSize:'13.5px',fontWeight: form.topic===t ? 600:400,border:'none',cursor:'pointer',transition:'background 0.15s ease',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                                {t}
                                {form.topic===t && <Check style={{ width:'13px',height:'13px',color:'#2563eb' }} />}
                              </button>
                            ))}
                          </div>
                        </div>
                        {touched.topic && errors.topic && <p style={{ fontSize:'11.5px',color:'#ef4444',marginTop:'4px' }}>{errors.topic}</p>}
                      </div>

                      {/* Message */}
                      <div style={{ marginBottom:'22px' }}>
                        <label htmlFor="ct-msg" style={labelBase}>Message <span style={{ color:'#ef4444' }}>*</span></label>
                        <textarea
                          id="ct-msg" rows={4} placeholder="Tell us what you're looking for, your current situation, or any questions you have..."
                          value={form.message}
                          onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                          onFocus={()=>setFocused('message')}
                          onBlur={()=>{setFocused(null);setTouched(t=>({...t,message:true}));}}
                          style={{ ...inputBase,...field('message'),resize:'vertical',minHeight:'100px' }}
                        />
                        <div style={{ display:'flex',justifyContent:'space-between',marginTop:'4px' }}>
                          {touched.message && errors.message ? <p style={{ fontSize:'11.5px',color:'#ef4444' }}>{errors.message}</p> : <span />}
                          <span style={{ fontSize:'11px',color:'#94a3b8' }}>{form.message.length}/500</span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={sending}
                        className="ct-submit"
                        style={{ width:'100%',padding:'13px 20px',borderRadius:'13px',fontSize:'14.5px',fontWeight:700,color:'white',background: sending ? 'rgba(37,99,235,0.55)':'linear-gradient(135deg,#1e40af,#2563eb)',border:'none',cursor: sending ? 'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:'0 4px 18px rgba(37,99,235,0.25)' }}>
                        <span className="ct-shim" />
                        <span style={{ position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'8px' }}>
                          {sending ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}>
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                              </svg>
                              Sending…
                            </>
                          ) : (
                            <>Send message <Send style={{ width:'15px',height:'15px' }} /></>
                          )}
                        </span>
                      </button>
                      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    </form>
                  )}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ── RIGHT ASIDE ── */}
          <div className="lg:col-span-2">
            <FadeUp delay={120}>
              {/* Quick links */}
              <div style={{ padding:'22px 22px',borderRadius:'20px',background:'rgba(255,255,255,0.95)',border:'1.5px solid rgba(219,234,254,0.7)',boxShadow:'0 4px 20px rgba(37,99,235,0.06)',marginBottom:'14px' }}>
                <div style={{ height:'3px',background:'linear-gradient(90deg,#2563eb,transparent)',borderRadius:'2px',marginBottom:'18px' }} />
                <h3 style={{ fontSize:'14px',fontWeight:700,color:'#0f172a',marginBottom:'14px' }}>Quick access</h3>
                {[
                  { label:'Book a session', sub:'Pick your slot now', icon:Calendar, accent:'#2563eb', href:'/services' },
                  { label:'View all services', sub:'See what we offer', icon:ArrowRight, accent:'#0891b2', href:'/services' },
                  { label:'Start free call', sub:'15-min no-commitment chat', icon:Phone, accent:'#7c3aed', href:'/select-slot' },
                ].map((item,i)=>{
                  const Icon=item.icon;
                  return (
                    <a key={i} href={item.href} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'11px 12px',borderRadius:'12px',textDecoration:'none',transition:'background 0.18s ease',marginBottom: i===2?0:'6px',background:'rgba(248,250,255,0.6)',border:'1px solid rgba(219,234,254,0.5)' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(37,99,235,0.05)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(248,250,255,0.6)'}
                    >
                      <div style={{ width:'34px',height:'34px',borderRadius:'9px',background:`${item.accent}10`,border:`1px solid ${item.accent}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <Icon style={{ width:'15px',height:'15px',color:item.accent }} />
                      </div>
                      <div>
                        <div style={{ fontSize:'13px',fontWeight:600,color:'#0f172a' }}>{item.label}</div>
                        <div style={{ fontSize:'11px',color:'#94a3b8' }}>{item.sub}</div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Office hours */}
              <div style={{ padding:'20px 22px',borderRadius:'20px',background:'rgba(255,255,255,0.95)',border:'1.5px solid rgba(219,234,254,0.7)',boxShadow:'0 4px 20px rgba(37,99,235,0.04)',marginBottom:'14px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px' }}>
                  <Clock style={{ width:'14px',height:'14px',color:'#2563eb' }} />
                  <span style={{ fontSize:'12px',fontWeight:700,color:'#0f172a' }}>Office hours</span>
                </div>
                {[
                  { day:'Monday – Friday', time:'9 AM – 7 PM' },
                  { day:'Saturday', time:'10 AM – 4 PM' },
                  { day:'Sunday', time:'Closed' },
                ].map((row,i)=>(
                  <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom: i<2 ? '1px solid rgba(219,234,254,0.5)':'none' }}>
                    <span style={{ fontSize:'12.5px',color:'#374151' }}>{row.day}</span>
                    <span style={{ fontSize:'12.5px',fontWeight:600,color: row.time==='Closed' ? '#94a3b8':'#2563eb' }}>{row.time}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div style={{ padding:'18px 20px',borderRadius:'18px',background:'linear-gradient(135deg,#0f172a,#1e3a8a)',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:'-10px',right:'-10px',width:'100px',height:'100px',background:'radial-gradient(circle,rgba(96,165,250,0.2) 0%,transparent 70%)',borderRadius:'50%' }} />
                <div style={{ position:'relative',zIndex:1 }}>
                  <div style={{ display:'flex',gap:'2px',marginBottom:'8px' }}>
                    {[...Array(5)].map((_,i)=><span key={i} style={{ fontSize:'13px' }}>★</span>)}
                  </div>
                  <p style={{ fontSize:'13px',color:'rgba(191,219,254,0.9)',lineHeight:1.6,marginBottom:'10px' }}>
                    "Replied in under an hour and helped me figure out exactly which session I needed."
                  </p>
                  <div style={{ fontSize:'11px',color:'rgba(148,163,184,0.7)',fontWeight:500 }}>— Pooja S., Product Manager</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      <StandardFooter />
    </main>
  );
}