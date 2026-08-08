import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Bookmark, 
  ArrowRight, 
  PlusCircle
} from 'lucide-react';
import type { Category, Difficulty, Problem, Submission, UserStats } from '../types/index';
import { StorageService } from '../services/storage';

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  submissions: Submission[];
  userStats: UserStats;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onOpenCreateModal: () => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queue',
  'Binary Search',
  'Linked List',
  'Trees & Graphs',
  'Dynamic Programming',
  'Math & Geometry'
];

const COMPANIES = ['All', 'AB Talk', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'];

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onSelectProblem,
  submissions,
  userStats,
  bookmarks,
  onToggleBookmark,
  onOpenCreateModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Attempted' | 'Todo'>('All');

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diffMs = midnight.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, minutes });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Daily Challenge Problem
  const dailyProblem = problems[0] || problems.find(p => p.id === 'two-sum');
  const dailyMetrics = dailyProblem ? StorageService.getProblemMetrics(dailyProblem.id) : { acceptanceRate: 0, totalSubmissions: 0 };

  // Solved problem IDs set
  const solvedProblemIds = useMemo(() => {
    return new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId));
  }, [submissions]);

  // Attempted problem IDs set
  const attemptedProblemIds = useMemo(() => {
    return new Set(submissions.map(s => s.problemId));
  }, [submissions]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchCompanies = p.companies?.some(c => c.toLowerCase().includes(q));
        if (!matchTitle && !matchCategory && !matchCompanies) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Company filter
      if (selectedCompany !== 'All' && (!p.companies || !p.companies.includes(selectedCompany))) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'Solved' && !solvedProblemIds.has(p.id)) return false;
      if (selectedStatus === 'Attempted' && (!attemptedProblemIds.has(p.id) || solvedProblemIds.has(p.id))) return false;
      if (selectedStatus === 'Todo' && attemptedProblemIds.has(p.id)) return false;

      return true;
    });
  }, [problems, searchQuery, selectedCategory, selectedDifficulty, selectedCompany, selectedStatus, solvedProblemIds, attemptedProblemIds]);

  const getDifficultyBadgeClass = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return 'text-slate-300 bg-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Daily Challenge Hero Banner */}
      {dailyProblem && (
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-[#0e1628] to-purple-950/80 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Neon background ambient glows */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>Daily Algorithm Challenge • +50 XP Streak Bonus</span>
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resets in {timeLeft.hours}h {timeLeft.minutes}m</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {dailyProblem.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {dailyProblem.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className={`px-2.5 py-0.5 rounded-md font-semibold ${getDifficultyBadgeClass(dailyProblem.difficulty)}`}>
                  {dailyProblem.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  {dailyProblem.category}
                </span>
                <span className="text-slate-400">
                  Acceptance: <strong className="text-slate-200">
                    {dailyMetrics.totalSubmissions > 0 ? `${dailyMetrics.acceptanceRate}%` : '0.0%'}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectProblem(dailyProblem)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-indigo-950/60 hover:scale-105 transition-all"
              >
                <span>Solve Daily Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-1">
          <div className="text-xs font-semibold text-slate-400">Total Solved</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-2">
            <span>{userStats.solvedCount}</span>
            <span className="text-xs text-slate-500 font-normal">/ {problems.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-1">
          <div className="text-xs font-semibold text-emerald-400">Easy Solved</div>
          <div className="text-2xl font-black text-emerald-400">
            {userStats.easyCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-1">
          <div className="text-xs font-semibold text-amber-400">Medium Solved</div>
          <div className="text-2xl font-black text-amber-400">
            {userStats.mediumCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-1">
          <div className="text-xs font-semibold text-rose-400">Hard Solved</div>
          <div className="text-2xl font-black text-rose-400">
            {userStats.hardCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, tag, or company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1120] border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Create Custom Problem CTA */}
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Create Custom Challenge</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950'
                  : 'bg-[#090d16] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-[#0b1120] border border-slate-800 rounded-lg p-1">
            <span className="px-2 text-slate-500 font-semibold text-[11px]">Difficulty:</span>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedDifficulty === d
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#0b1120] border border-slate-800 rounded-lg p-1">
            <span className="px-2 text-slate-500 font-semibold text-[11px]">Status:</span>
            {(['All', 'Solved', 'Attempted', 'Todo'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedStatus === st
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-1 bg-[#0b1120] border border-slate-800 rounded-lg p-1">
            <span className="px-2 text-slate-500 font-semibold text-[11px]">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent text-xs text-slate-300 outline-none pr-2 cursor-pointer"
            >
              {COMPANIES.map((comp) => (
                <option key={comp} value={comp} className="bg-slate-900 text-slate-200">
                  {comp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-[#090d16] border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1120] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4 text-center">Bookmark</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No problems match your active filter criteria. Try clearing search or filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => {
                  const isSolved = solvedProblemIds.has(problem.id);
                  const isAttempted = attemptedProblemIds.has(problem.id);
                  const isBookmarked = bookmarks.includes(problem.id);
                  
                  // Real user metrics for this problem
                  const metrics = StorageService.getProblemMetrics(problem.id);

                  return (
                    <tr 
                      key={problem.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectProblem(problem)}
                    >
                      {/* Status Icon */}
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : isAttempted ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto block animate-pulse" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700 mx-auto block" />
                        )}
                      </td>

                      {/* Title & Companies */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100 group-hover:text-indigo-300 text-sm transition-colors">
                              {problem.title}
                            </span>
                            {problem.isCustom && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                Custom
                              </span>
                            )}
                          </div>
                          {problem.companies && problem.companies.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              {problem.companies.slice(0, 3).map((c, i) => (
                                <span key={i} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800/80">
                                  {c}
                                </span>
                              ))}
                              {problem.companies.length > 3 && (
                                <span>+{problem.companies.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-slate-400">
                        {problem.category}
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] border ${getDifficultyBadgeClass(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Real Dynamic Acceptance Rate */}
                      <td className="py-4 px-4 text-slate-300 font-mono">
                        {metrics.totalSubmissions > 0 ? `${metrics.acceptanceRate}%` : '0.0%'}
                      </td>

                      {/* Bookmark Star */}
                      <td className="py-4 px-4 text-center" onClick={(e) => { e.stopPropagation(); onToggleBookmark(problem.id); }}>
                        <button className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors">
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Action CTA */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectProblem(problem); }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
