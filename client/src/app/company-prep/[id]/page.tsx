'use client';

import { useEffect, useState, useMemo, memo, useCallback, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, Sparkles, CheckCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import StandardFooter from '@/components/StandardFooter';
import { companyPrepAPI, getAuthToken } from '@/lib/api';

// Lazy load ResourceCard for better initial load
const ResourceCard = dynamic(() => import('@/components/ResourceCard'), {
  loading: () => <div className="animate-pulse bg-zinc-900/80 border border-zinc-800/50 rounded-2xl h-32" />,
  ssr: false,
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Optimized Question Card with lazy rendering
const QuestionCard = memo(({ question, index, isLocked }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only set up observer if not yet visible
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect(); // Disconnect after first visibility
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    const element = document.getElementById(`question-${index}`);
    if (element) {
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [index, hasAnimated]);

  // Return skeleton if not visible yet
  if (!isVisible && !hasAnimated) {
    return (
      <div id={`question-${index}`} className="bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4" />
        <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div
      id={`question-${index}`}
      className={`bg-zinc-900/80 border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 ${
        isLocked ? 'border-zinc-800/50' : 'border-zinc-700/80 hover:border-emerald-500/30'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm font-bold text-white flex-shrink-0">
          Q{index + 1}
        </span>
        {isLocked ? (
          <Lock size={16} className="text-zinc-600 mt-1 flex-shrink-0" />
        ) : (
          <CheckCircle size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
        )}
      </div>

      <h4 className="text-lg font-semibold text-white mb-4 leading-relaxed">{question.question}</h4>

      {isLocked ? (
        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
          <Lock size={20} className="text-zinc-500 flex-shrink-0" />
          <span className="text-zinc-400 font-medium">🔒 Unlock to view answer</span>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{question.answer}</p>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.question.question === nextProps.question.question &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.index === nextProps.index
  );
});

QuestionCard.displayName = 'QuestionCard';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [company, setCompany] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'soft' | 'technical' | 'behavioral'>('soft');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchCompanyContent();
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [params.id]);

  const fetchCompanyContent = useCallback(async () => {
    try {
      const res = await companyPrepAPI.getCompany(params.id as string);
      setCompany(res.data.company);
      setHasPurchased(res.data.hasPurchased || false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load content');
      setIsLoading(false);
    }
  }, [params.id]);

  const handlePurchase = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error('Please login to purchase');
      router.push(`/login?redirect=/company-prep/${params.id}`);
      return;
    }

    setIsProcessing(true);
    try {
      const orderRes = await companyPrepAPI.createOrder(params.id as string);
      const { orderId, amount, companyName } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Career Coach LMS',
        description: `${companyName} Interview Prep`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await companyPrepAPI.verifyPayment(params.id as string, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! All questions unlocked');
            fetchCompanyContent();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#10b981' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsProcessing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  }, [params.id, router, fetchCompanyContent]);

  // Memoized calculations
  const discountedPrice = useMemo(() => {
    if (!company?.discount?.isActive) return company?.price || 0;
    if (company.discount.type === 'percentage') {
      return Math.round(company.price - (company.price * company.discount.value) / 100);
    }
    return Math.round(company.price - company.discount.value);
  }, [company]);

  const tabs = useMemo(() => [
    { key: 'soft', label: 'Soft Skills', data: company?.softSkills },
    { key: 'technical', label: 'Technical', data: company?.technicalQuestions },
    { key: 'behavioral', label: 'Behavioral', data: company?.behavioralQuestions },
  ], [company]);

  const activeData = useMemo(() => tabs.find(t => t.key === activeTab)?.data, [tabs, activeTab]);

  const lockedQuestionsCount = useMemo(() => {
    if (hasPurchased || !activeData) return 0;
    let count = 0;
    activeData.sections?.forEach((section: any) => {
      section.questions?.forEach((q: any) => {
        if (q.answer === '🔒 Unlock full content') count++;
      });
      section.resources?.forEach((r: any) => {
        if (r.solution === '🔒 Unlock full content' || !r.isFree) count++;
      });
    });
    return count;
  }, [hasPurchased, activeData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Company not found</h1>
          <button onClick={() => router.push('/company-prep')} className="px-6 py-2 bg-white text-black rounded-xl font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/company-prep')}
          className="text-zinc-400 hover:text-white transition-all duration-300 mb-6 flex items-center gap-2 group"
          whileHover={{ x: -6 }}
        >
          <span className="text-xl">←</span>
          <span className="text-sm font-medium">Back to Companies</span>
        </motion.button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">{company.companyName}</h1>
          <p className="text-zinc-400 text-lg mb-4">{company.description}</p>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-zinc-800/80 border border-zinc-700 rounded-full text-sm text-zinc-300">
              {company.industry}
            </span>
            <span className="text-zinc-400">{company.totalQuestions} Total Questions</span>
          </div>
        </div>

        {/* Purchase Banner - Always visible */}
        {!hasPurchased && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      🔓 Unlock All {company.totalQuestions} Questions
                    </h3>
                    <p className="text-white/90 text-lg">Lifetime Access • All Categories Included</p>
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="px-10 py-5 bg-white hover:bg-zinc-100 text-emerald-600 font-bold text-lg rounded-2xl transition-all disabled:opacity-50 flex items-center gap-3 shadow-2xl"
                >
                  <CreditCard size={24} />
                  {isProcessing ? 'Processing...' : `Buy Now - ₹${discountedPrice}`}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                startTransition(() => {
                  setActiveTab(tab.key as any);
                });
              }}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab.key
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-zinc-400 hover:text-white'
              } ${isPending ? 'opacity-50' : ''}`}
              disabled={isPending}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Floating Payment Banner (visible when scrolling) */}
        {!hasPurchased && lockedQuestionsCount > 0 && (
          <motion.div
            className="sticky top-4 z-50 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-2xl border border-emerald-400/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      🔓 Unlock {lockedQuestionsCount} More Questions
                    </h3>
                    <p className="text-white/90">Get lifetime access to all {company.totalQuestions} questions</p>
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-white hover:bg-zinc-100 text-emerald-600 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                  <CreditCard size={20} />
                  {isProcessing ? 'Processing...' : `Pay ₹${discountedPrice}`}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions - Optimized without AnimatePresence for better performance */}
        <div
          className={`space-y-6 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}
        >
          {activeData?.sections?.map((section: any, sIdx: number) => (
            <div key={`${activeTab}-section-${sIdx}`}>
              <h3 className="text-2xl font-bold text-white mb-6">{section.title}</h3>
              {section.description && (
                <p className="text-zinc-400 mb-4">{section.description}</p>
              )}

              {/* Questions */}
              {section.questions && section.questions.length > 0 && (
                <div className="space-y-4 mb-8">
                  {section.questions.map((q: any, qIdx: number) => (
                    <QuestionCard
                      key={`${activeTab}-q-${qIdx}-${q.question.slice(0, 20)}`}
                      question={q}
                      index={qIdx}
                      isLocked={!hasPurchased && q.answer === '🔒 Unlock full content'}
                    />
                  ))}
                </div>
              )}

              {/* Resources */}
              {section.resources && section.resources.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    📚 Resources
                  </h4>
                  <div className="space-y-4">
                    {section.resources.map((resource: any, rIdx: number) => (
                      <ResourceCard
                        key={`${activeTab}-r-${rIdx}-${resource.title}`}
                        resource={resource}
                        index={rIdx}
                        isLocked={!hasPurchased && (resource.solution === '🔒 Unlock full content' || !resource.isFree)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    <StandardFooter />
    </>
  );
}
