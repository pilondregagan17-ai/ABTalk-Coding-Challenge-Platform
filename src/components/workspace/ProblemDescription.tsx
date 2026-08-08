import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Building2, 
  ChevronRight, 
  ChevronDown, 
  MessageSquare, 
  ThumbsUp, 
  Copy, 
  Check, 
  Bookmark, 
  Cpu, 
  History,
  Send,
  Plus
} from 'lucide-react';
import type { Problem, Submission, DiscussionPost } from '../../types/index';
import { StorageService } from '../../services/storage';
import { FirestoreService } from '../../services/firestore';

interface ProblemDescriptionProps {
  problem: Problem;
  submissions: Submission[];
  onOpenAiHelper: (mode: 'hint' | 'debug' | 'complexity') => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  submissions,
  onOpenAiHelper,
  isBookmarked,
  onToggleBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'submissions' | 'discussions'>('description');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [copiedExample, setCopiedExample] = useState<number | null>(null);

  // Real dynamic problem metrics
  const metrics = StorageService.getProblemMetrics(problem.id);

  // Persistent real discussions
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(() => {
    const fromStorage = StorageService.getDiscussions(problem.id);
    if (fromStorage.length > 0) return fromStorage;
    return [];
  });

  useEffect(() => {
    setDiscussions(StorageService.getDiscussions(problem.id));
    setRevealedHints([]);
  }, [problem.id]);

  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionBody, setNewDiscussionBody] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter(i => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(index);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const handleUpvote = (postId: string) => {
    const updated = discussions.map(d => {
      if (d.id === postId) {
        const isUp = d.userUpvoted;
        return {
          ...d,
          upvotes: isUp ? d.upvotes - 1 : d.upvotes + 1,
          userUpvoted: !isUp
        };
      }
      return d;
    });
    setDiscussions(updated);
    const target = updated.find(d => d.id === postId);
    if (target) {
      StorageService.saveDiscussion(target);
      FirestoreService.saveDiscussionToCloud(target);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim() || !newDiscussionBody.trim()) return;

    const userStats = StorageService.getUserStats();
    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      problemId: problem.id,
      author: userStats.username,
      avatar: userStats.avatar,
      title: newDiscussionTitle.trim(),
      content: newDiscussionBody.trim(),
      tags: [problem.category, 'Solution'],
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      comments: []
    };

    StorageService.saveDiscussion(newPost);
    FirestoreService.saveDiscussionToCloud(newPost);
    setDiscussions([newPost, ...discussions]);
    setNewDiscussionTitle('');
    setNewDiscussionBody('');
    setShowNewPostForm(false);
  };

  const getDifficultyBadgeClass = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return 'text-slate-300 bg-slate-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1120] border-r border-slate-800/80 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-4 border-b border-slate-800 bg-[#090d16]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'description'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Description</span>
          </button>

          <button
            onClick={() => setActiveTab('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'editorial'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Editorial Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Submissions ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'discussions'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Discussions ({discussions.length})</span>
          </button>
        </div>

        {/* Quick Problem Bookmark & AI Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenAiHelper('hint')}
            className="px-2.5 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm"
            title="Ask Pioneer AI for subtle hints or analysis"
          >
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">AI Doctor</span>
          </button>

          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-md border transition-all ${
              isBookmarked
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            {/* Header / Title */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {problem.title}
                </h1>
                {problem.isCustom && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Community Custom
                  </span>
                )}
              </div>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className={`px-2.5 py-0.5 rounded-md font-semibold text-xs border ${getDifficultyBadgeClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>

                <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium">
                  {problem.category}
                </span>

                <div className="flex items-center gap-1 text-slate-400 px-2 py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Acceptance: <strong className="text-slate-200">
                      {metrics.totalSubmissions > 0 ? `${metrics.acceptanceRate}%` : '0.0%'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 px-2 py-0.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Solved by: <strong className="text-slate-200">
                      {metrics.solvedByCount.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Company Tags */}
              {problem.companies && problem.companies.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500 font-medium">Companies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.companies.map((company, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-800/80" />

            {/* Problem Statement Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
              <p className="whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-[11px] text-slate-400">
                Examples
              </h3>

              {problem.examples.map((ex, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl bg-[#090d16] border border-slate-800/90 p-4 space-y-2 relative group hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400">Example {idx + 1}:</span>
                    <button
                      onClick={() => copyToClipboard(`Input: ${ex.input}\nOutput: ${ex.output}`, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white rounded bg-slate-800 text-[10px] flex items-center gap-1"
                    >
                      {copiedExample === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedExample === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="font-mono text-xs space-y-1 text-slate-300">
                    <div className="flex gap-2">
                      <span className="text-slate-500 select-none">Input:</span>
                      <span className="text-cyan-300 break-all">{ex.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-500 select-none">Output:</span>
                      <span className="text-emerald-400 break-all">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="flex gap-2 pt-1 text-[11px] text-slate-400">
                        <span className="text-slate-500 select-none">Explanation:</span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-[11px] text-slate-400">
                Constraints
              </h3>
              <ul className="space-y-1.5">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                    <span className="text-indigo-400 select-none">•</span>
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/80">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints Accordion */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intelligent Hints ({problem.hints.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Uncover step-by-step</span>
                </div>

                <div className="space-y-2">
                  {problem.hints.map((hint, idx) => {
                    const isRevealed = revealedHints.includes(idx);
                    return (
                      <div 
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-[#090d16] overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleHint(idx)}
                          className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between text-slate-300 hover:bg-slate-800/40"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>Hint {idx + 1}</span>
                          </span>
                          {isRevealed ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        {isRevealed && (
                          <div className="px-4 pb-3 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 bg-slate-950/40">
                            {hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editorial Tab */}
        {activeTab === 'editorial' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Approach: {problem.editorial.approach}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {problem.editorial.intuition}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Time Complexity</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300">
                    {problem.editorial.complexity.time}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Space Complexity</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300">
                    {problem.editorial.complexity.space}
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Solution Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Reference Optimal Implementation:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">JavaScript / Python</span>
              </div>
              <pre className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
                <code>{problem.editorial.codeSolution.javascript || problem.solutionTemplate.javascript}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Submission History ({submissions.length})
            </h3>

            {submissions.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <History className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-300 font-medium">No submissions yet for this problem</p>
                <p className="text-xs text-slate-500">Run your code and submit solution to see runtime & memory benchmarks.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub, idx) => (
                  <div 
                    key={sub.id || idx}
                    className="p-3 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        sub.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {sub.status}
                      </span>
                      <span className="font-mono text-slate-300 uppercase text-[11px]">{sub.language}</span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                      <span>{sub.runtimeMs} ms</span>
                      <span>{sub.memoryMB} MB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Community Solutions & Explanations ({discussions.length})
              </h3>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Solution</span>
              </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <form onSubmit={handleCreatePost} className="p-4 rounded-xl bg-[#090d16] border border-indigo-500/40 space-y-3 animate-modal">
                <h4 className="text-xs font-bold text-white">Share Your Approach / Discussion</h4>
                <input
                  type="text"
                  value={newDiscussionTitle}
                  onChange={(e) => setNewDiscussionTitle(e.target.value)}
                  required
                  placeholder="Title: e.g. Clean O(N) Two Pointers in Python with explanation"
                  className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  value={newDiscussionBody}
                  onChange={(e) => setNewDiscussionBody(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain your intuition, code snippet, and time/space complexity..."
                  className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            )}

            {discussions.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No discussions posted yet</p>
                <p className="text-[11px] text-slate-500">Be the first developer to share your insight or solution approach!</p>
              </div>
            ) : (
              discussions.map(post => (
                <div key={post.id} className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{post.avatar}</span>
                      <span className="text-xs font-semibold text-slate-200">{post.author}</span>
                      <span className="text-[10px] text-slate-500">• {post.createdAt}</span>
                    </div>

                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border transition-all ${
                        post.userUpvoted 
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' 
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.upvotes}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-white">{post.title}</h4>

                  <div className="text-xs text-slate-300 whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 font-mono">
                    {post.content}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
