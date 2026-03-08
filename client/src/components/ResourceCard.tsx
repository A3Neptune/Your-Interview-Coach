'use client';

import { FileText, Video, ExternalLink, Code, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  _id?: string;
  type: 'pdf' | 'googleDrive' | 'codingQuestion' | 'video' | 'article';
  title: string;
  description?: string;
  url: string;
  cloudinaryPublicId?: string;
  problemStatement?: string;
  solution?: string;
  hints?: string[];
  testCases?: { input: string; output: string }[];
  difficulty?: 'easy' | 'medium' | 'hard';
  isFree?: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
  isLocked: boolean;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText size={24} className="text-emerald-400" />;
    case 'googleDrive':
      return <ExternalLink size={24} className="text-blue-400" />;
    case 'codingQuestion':
      return <Code size={24} className="text-purple-400" />;
    case 'video':
      return <Video size={24} className="text-red-400" />;
    case 'article':
      return <FileText size={24} className="text-yellow-400" />;
    default:
      return <FileText size={24} className="text-gray-400" />;
  }
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30';
  }
};

export default function ResourceCard({ resource, index, isLocked }: ResourceCardProps) {
  const handleResourceClick = () => {
    if (!isLocked && resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-zinc-900/80 border rounded-2xl p-6 backdrop-blur-sm ${
        isLocked ? 'border-zinc-800/50' : 'border-zinc-700/80 hover:border-emerald-500/50 cursor-pointer'
      } transition-all duration-300`}
      onClick={handleResourceClick}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isLocked ? 'bg-zinc-800' : 'bg-zinc-800/50'}`}>
          {getResourceIcon(resource.type)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">{resource.title}</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-medium text-zinc-400 capitalize">
                  {resource.type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {resource.difficulty && (
                  <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                )}
              </div>
            </div>
            {isLocked ? (
              <Lock size={20} className="text-zinc-600" />
            ) : (
              <CheckCircle size={20} className="text-emerald-500" />
            )}
          </div>

          {resource.description && (
            <p className="text-zinc-400 text-sm mb-3">{resource.description}</p>
          )}

          {/* Coding Question Specific Content */}
          {resource.type === 'codingQuestion' && (
            <div className="mt-4 space-y-3">
              {resource.problemStatement && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-2">Problem Statement</h5>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">{resource.problemStatement}</p>
                </div>
              )}

              {!isLocked && resource.hints && resource.hints.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-2">Hints</h5>
                  <ul className="space-y-1">
                    {resource.hints.map((hint, idx) => (
                      <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isLocked && resource.testCases && resource.testCases.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-2">Test Cases</h5>
                  <div className="space-y-2">
                    {resource.testCases.map((tc, idx) => (
                      <div key={idx} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
                        <p className="text-xs text-zinc-400 mb-1">Input:</p>
                        <code className="text-sm text-emerald-400 block mb-2">{tc.input}</code>
                        <p className="text-xs text-zinc-400 mb-1">Output:</p>
                        <code className="text-sm text-emerald-400 block">{tc.output}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resource.solution && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-2">Solution</h5>
                  {isLocked ? (
                    <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                      <Lock size={20} className="text-zinc-500" />
                      <span className="text-zinc-400 font-medium">🔒 Unlock to view solution</span>
                    </div>
                  ) : (
                    <pre className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-zinc-300 whitespace-pre-wrap">{resource.solution}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PDF/Google Drive/Video/Article - Show link */}
          {!isLocked && (resource.type === 'pdf' || resource.type === 'googleDrive' || resource.type === 'video' || resource.type === 'article') && (
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              <ExternalLink size={16} />
              <span>Open Resource</span>
            </div>
          )}

          {isLocked && resource.type !== 'codingQuestion' && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
              <Lock size={18} className="text-zinc-500" />
              <span className="text-zinc-400 text-sm font-medium">🔒 Unlock to access this resource</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
