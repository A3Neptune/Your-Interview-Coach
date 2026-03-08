'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyPrepAPI } from '@/lib/api';

interface Question {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isFree: boolean;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: 'Technology',
    price: 499,
    featured: false,
    isActive: true,
    discount: { type: 'none' as 'none' | 'percentage' | 'fixed', value: 0, isActive: false },
  });

  const [softSkills, setSoftSkills] = useState<Section[]>([
    { title: 'Communication', description: '', questions: [] }
  ]);
  const [technicalQuestions, setTechnicalQuestions] = useState<Section[]>([
    { title: 'Technical Round', description: '', questions: [] }
  ]);
  const [behavioralQuestions, setBehavioralQuestions] = useState<Section[]>([
    { title: 'Behavioral', description: '', questions: [] }
  ]);

  const [freePreviewCounts, setFreePreviewCounts] = useState({
    soft: 3,
    technical: 3,
    behavioral: 3,
  });

  const addQuestion = (
    sections: Section[],
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    sectionIndex: number
  ) => {
    const updated = [...sections];
    updated[sectionIndex].questions.push({
      question: '',
      answer: '',
      difficulty: 'medium',
      isFree: false,
    });
    setSections(updated);
  };

  const updateQuestion = (
    sections: Section[],
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    sectionIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: any
  ) => {
    const updated = [...sections];
    (updated[sectionIndex].questions[questionIndex] as any)[field] = value;
    setSections(updated);
  };

  const removeQuestion = (
    sections: Section[],
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    sectionIndex: number,
    questionIndex: number
  ) => {
    const updated = [...sections];
    updated[sectionIndex].questions.splice(questionIndex, 1);
    setSections(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.description) {
      toast.error('Please fill in company name and description');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        softSkills: { sections: softSkills, freePreviewCount: freePreviewCounts.soft },
        technicalQuestions: { sections: technicalQuestions, freePreviewCount: freePreviewCounts.technical },
        behavioralQuestions: { sections: behavioralQuestions, freePreviewCount: freePreviewCounts.behavioral },
      };

      await companyPrepAPI.createCompany(payload);
      toast.success('Company created successfully!');
      router.push('/mentor-dashboard/company-content');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionSection = (
    title: string,
    sections: Section[],
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    previewKey: 'soft' | 'technical' | 'behavioral'
  ) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Free Preview:</label>
          <input
            type="number"
            min={0}
            value={freePreviewCounts[previewKey]}
            onChange={(e) => setFreePreviewCounts(prev => ({
              ...prev,
              [previewKey]: parseInt(e.target.value) || 0
            }))}
            className="w-16 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white text-center"
          />
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="mb-6">
          <input
            type="text"
            value={section.title}
            onChange={(e) => {
              const updated = [...sections];
              updated[sIdx].title = e.target.value;
              setSections(updated);
            }}
            placeholder="Section Title"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white mb-2"
          />

          {section.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-3">
              <div className="flex items-start gap-2 mb-3">
                <span className="px-2 py-1 bg-zinc-700 rounded text-xs text-white">Q{qIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(sections, setSections, sIdx, qIdx)}
                  className="ml-auto p-1 text-red-400 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(sections, setSections, sIdx, qIdx, 'question', e.target.value)}
                placeholder="Question"
                rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white mb-2"
              />
              <textarea
                value={q.answer}
                onChange={(e) => updateQuestion(sections, setSections, sIdx, qIdx, 'answer', e.target.value)}
                placeholder="Answer"
                rows={3}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white mb-2"
              />
              <div className="flex gap-4">
                <select
                  value={q.difficulty}
                  onChange={(e) => updateQuestion(sections, setSections, sIdx, qIdx, 'difficulty', e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={q.isFree}
                    onChange={(e) => updateQuestion(sections, setSections, sIdx, qIdx, 'isFree', e.target.checked)}
                    className="w-4 h-4"
                  />
                  Free Preview
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addQuestion(sections, setSections, sIdx)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Add New Company</h1>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              >
                <option>Technology</option>
                <option>Finance</option>
                <option>Consulting</option>
                <option>Healthcare</option>
                <option>E-commerce</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-zinc-300">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-zinc-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Questions */}
        {renderQuestionSection('Soft Skills Questions', softSkills, setSoftSkills, 'soft')}
        {renderQuestionSection('Technical Questions', technicalQuestions, setTechnicalQuestions, 'technical')}
        {renderQuestionSection('Behavioral Questions', behavioralQuestions, setBehavioralQuestions, 'behavioral')}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition disabled:opacity-50"
        >
          <Save size={20} />
          {isSubmitting ? 'Creating...' : 'Create Company'}
        </button>
      </form>
    </div>
  );
}
