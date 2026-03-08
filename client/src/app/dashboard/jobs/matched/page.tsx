'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, TrendingUp, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function MatchedJobsPage() {
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  useEffect(() => {
    fetchMatchedJobs();
  }, []);

  const fetchMatchedJobs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/jobs/matched/for-user`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          timeout: 10000
        });
        setMatchedJobs(response.data.matchedJobs || []);
      } catch (err) {
        console.error('Matched jobs API error:', err);
        toast.error('Failed to load matched jobs');
        setMatchedJobs([]);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching matched jobs:', err);
      setIsLoading(false);
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Recommended for You</h1>
        <p className="text-zinc-400 mt-2">Jobs matched to your skills and experience</p>
      </div>

      {/* Stats */}
      {matchedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-zinc-400 text-sm">Total Matches</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{matchedJobs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p className="text-zinc-400 text-sm">Average Match</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {matchedJobs.length > 0 ? (matchedJobs.reduce((sum: number, j: any) => sum + j.matchPercentage, 0) / matchedJobs.length).toFixed(0) : 0}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-zinc-400 text-sm">High Match (90%+)</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {matchedJobs.filter(j => j.matchPercentage >= 90).length}
            </p>
          </div>
        </div>
      )}

      {/* Matched Jobs List */}
      <div className="space-y-4">
        {matchedJobs.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl">
            <Briefcase size={48} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400 mb-2">No matched jobs yet</p>
            <p className="text-zinc-500 text-sm">Update your profile with skills to get personalized recommendations</p>
          </div>
        ) : (
          matchedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{job.position}</h3>
                  <p className="text-blue-400 font-semibold">{job.companyName}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span className="text-emerald-300 font-bold">{job.matchPercentage.toFixed(0)}% Match</span>
                </div>
              </div>

              <p className="text-zinc-400 text-sm mb-4">{job.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <MapPin size={16} className="text-emerald-400" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Clock size={16} className="text-purple-400" />
                  {job.jobType}
                </div>
                {job.salary?.min && job.salary?.max && (
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <DollarSign size={16} className="text-green-400" />
                    ₹{job.salary.min.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Matched Skills */}
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">Your Matched Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* All Skills */}
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">All Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-xs rounded-full ${
                        job.matchedSkills.includes(skill)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => applyToJob(job._id)}
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
    </div>
  );
}
