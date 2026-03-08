'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Users, DollarSign, Clock, Filter, Search, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function JobOpeningsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, filterType, jobs]);

  const fetchJobs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      let jobsData = [];

      try {
        const response = await axios.get(`${API_URL}/jobs`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          timeout: 10000
        });
        jobsData = response.data.jobs || [];
      } catch (err) {
        console.error('Jobs API error:', err);
        jobsData = [];
      }

      setJobs(jobsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.jobType === filterType);
    }

    setFilteredJobs(filtered);
  };

  const applyToJob = async (jobId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      await axios.post(`${API_URL}/jobs/${jobId}/apply`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppliedJobs([...appliedJobs, jobId]);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to apply to job');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Openings</h1>
          <p className="text-zinc-400 mt-2">Discover opportunities that match your skills</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by position, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-blue-500 focus:outline-none transition"
        >
          <option value="all">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Job Count */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400">Showing {filteredJobs.length} job(s)</p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Briefcase size={48} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400">No jobs found matching your criteria</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition group cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{job.position}</h3>
                  <p className="text-blue-400 font-semibold">{job.companyName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  job.jobType === 'Remote'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {job.jobType}
                </span>
              </div>

              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{job.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <MapPin size={16} className="text-emerald-400" />
                  {job.location}
                </div>
                {job.salary?.min && job.salary?.max && (
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <DollarSign size={16} className="text-green-400" />
                    ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Users size={16} className="text-orange-400" />
                  {job.experienceLevel} Level
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 3).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300">
                      +{job.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyToJob(job._id);
                }}
                disabled={appliedJobs.includes(job._id)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
                  appliedJobs.includes(job._id)
                    ? 'bg-emerald-600/20 text-emerald-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Send size={16} />
                {appliedJobs.includes(job._id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedJob(null)}>
          <div
            className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.position}</h2>
                <p className="text-xl text-blue-400 font-semibold">{selectedJob.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-emerald-400" />
                <span className="text-zinc-300">{selectedJob.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                <span className="text-zinc-300">{selectedJob.jobType}</span>
              </div>
              {selectedJob.salary?.min && (
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  <span className="text-zinc-300">₹{selectedJob.salary.min.toLocaleString()} - ₹{selectedJob.salary.max.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Job Description</h3>
              <p className="text-zinc-300 leading-relaxed">{selectedJob.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.requiredSkills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                applyToJob(selectedJob._id);
                setSelectedJob(null);
              }}
              disabled={appliedJobs.includes(selectedJob._id)}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                appliedJobs.includes(selectedJob._id)
                  ? 'bg-emerald-600/20 text-emerald-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {appliedJobs.includes(selectedJob._id) ? 'Already Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">💡 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-3">1</div>
            <h3 className="font-semibold text-white mb-2">Update Your Skills</h3>
            <p className="text-zinc-400 text-sm">Keep your profile updated with your latest skills and experience</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-3">2</div>
            <h3 className="font-semibold text-white mb-2">Smart Matching</h3>
            <p className="text-zinc-400 text-sm">We automatically match job openings with your profile and send you notifications</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-3">3</div>
            <h3 className="font-semibold text-white mb-2">Apply & Connect</h3>
            <p className="text-zinc-400 text-sm">Apply directly to jobs and get matched with companies instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
