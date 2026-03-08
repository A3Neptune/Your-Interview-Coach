'use client';

import { useState, useEffect, memo } from 'react';
import { Building2, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { companyPrepAPI } from '@/lib/api';

// Cache for companies data
let companiesCache: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Memoized Company Card
const CompanyCard = memo(({ company, index }: { company: any; index: number }) => {
  const getDiscountedPrice = (company: any) => {
    if (!company.discount || !company.discount.isActive) return company.price;
    if (company.discount.type === 'percentage') {
      return Math.round(company.price - (company.price * company.discount.value) / 100);
    }
    return Math.round(company.price - company.discount.value);
  };

  const discountedPrice = getDiscountedPrice(company);
  const hasDiscount = company.discount?.isActive && discountedPrice < company.price;

  return (
    <Link href={`/company-prep/${company._id}`} key={company._id}>
      <div className="group relative bg-white/5  border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 h-full cursor-pointer">
        {company.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">HOT</span>
          </div>
        )}

        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 size={28} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{company.companyName}</h3>
          <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-zinc-400">
            {company.industry}
          </span>
        </div>

        <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{company.description}</p>

        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Questions</p>
            <p className="text-xl font-bold text-white">{company.totalQuestions}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Students</p>
            <p className="text-xl font-bold text-white">{company.enrollmentCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-zinc-500 line-through text-sm mr-2">₹{company.price}</span>
                <span className="text-2xl font-bold text-emerald-400">₹{discountedPrice}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-white">₹{company.price}</span>
            )}
          </div>
          <ArrowRight size={20} className="text-white/60 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
});

CompanyCard.displayName = 'CompanyCard';

export default function CompanyPrepSection() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (companiesCache && now - cacheTimestamp < CACHE_DURATION) {
        setCompanies(companiesCache);
        setIsLoading(false);
        return;
      }

      const res = await companyPrepAPI.getCompanies({ featured: true });
      const featuredCompanies = (res.data.companies || []).slice(0, 3);

      // Update cache
      companiesCache = featuredCompanies;
      cacheTimestamp = now;

      setCompanies(featuredCompanies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching featured companies:', error);
      setIsLoading(false);
    }
  };

  return (
    <section id="company-prep" className="py-28 px-4 sm:px-6 bg-gradient-to-b from-[#09090b] via-black to-[#09090b]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="Interview Prep"
          title="Company-Specific Questions"
          subtitle="Master interviews at top companies with real questions on soft skills, technical, and behavioral rounds."
        />

        {/* Free Preview Info */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full ">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold text-sm">3 Free Questions Per Category</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {companies.map((company, idx) => (
              <CompanyCard key={company._id} company={company} index={idx} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center">
          <Link href="/company-prep">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2">
              <span>Explore All Companies</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
