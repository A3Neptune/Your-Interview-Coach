'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StandardFooter from '@/components/StandardFooter';
import { companyPrepAPI } from '@/lib/api';

interface Company {
  _id: string;
  companyName: string;
  logo: string;
  description: string;
  industry: string;
  price: number;
  discount?: { type: string; value: number; isActive: boolean };
  totalQuestions: number;
  enrollmentCount: number;
  featured: boolean;
}

export default function CompanyPrepPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCompanies();
    fetchIndustries();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchQuery, selectedIndustry, companies]);

  const fetchCompanies = async () => {
    try {
      const res = await companyPrepAPI.getCompanies();
      setCompanies(res.data.companies || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setIsLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const res = await companyPrepAPI.getIndustries();
      setIndustries(res.data.industries || []);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }
    setFilteredCompanies(filtered);
  };

  const getDiscountedPrice = (company: Company) => {
    if (!company.discount || !company.discount.isActive) return company.price;
    if (company.discount.type === 'percentage') {
      return Math.round(company.price - (company.price * company.discount.value) / 100);
    }
    return Math.round(company.price - company.discount.value);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#09090b] mt-10">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">Company Interview Prep</span>
              </div>
              <h1 className="text-6xl font-bold text-white mb-6">
                Master Top Company<br />Interviews
              </h1>
              <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
                Real questions from Google, Amazon, Microsoft & more. Get 3 free previews per category.
              </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-16"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                <option value="all">All Industries</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </motion.div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 size={64} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-400 text-lg">No companies found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.slice(0, showAll ? undefined : itemsPerPage).map((company, idx) => {
                    const discountedPrice = getDiscountedPrice(company);
                    const hasDiscount = company.discount?.isActive && discountedPrice < company.price;

                    return (
                      <motion.div
                        key={company._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link href={`/company-prep/${company._id}`}>
                          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 h-full cursor-pointer">
                            {company.featured && (
                              <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                <TrendingUp size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400">HOT</span>
                              </div>
                            )}

                            <div className="mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center mb-4">
                                <Building2 size={32} className="text-emerald-400" />
                              </div>
                              <h3 className="text-3xl font-bold text-white mb-2">{company.companyName}</h3>
                              <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-zinc-400">
                                {company.industry}
                              </span>
                            </div>

                            <p className="text-zinc-400 mb-6 line-clamp-2">{company.description}</p>

                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                              <div>
                                <p className="text-xs text-zinc-500 mb-1">Questions</p>
                                <p className="text-2xl font-bold text-white">{company.totalQuestions}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500 mb-1">Students</p>
                                <p className="text-2xl font-bold text-white">{company.enrollmentCount}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                {hasDiscount ? (
                                  <>
                                    <span className="text-zinc-500 line-through text-sm mr-2">₹{company.price}</span>
                                    <span className="text-3xl font-bold text-emerald-400">₹{discountedPrice}</span>
                                  </>
                                ) : (
                                  <span className="text-3xl font-bold text-white">₹{company.price}</span>
                                )}
                              </div>
                              <div className="p-3 bg-emerald-500 rounded-xl group-hover:bg-emerald-400 transition-colors">
                                <ArrowRight size={20} className="text-white" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredCompanies.length > itemsPerPage && (
                  <div className="flex justify-center mt-12">
                    <motion.button
                      onClick={() => setShowAll(!showAll)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/30"
                    >
                      {showAll ? '← Show Less' : '→ Show More Companies'}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <StandardFooter />
    </>
  );
}
