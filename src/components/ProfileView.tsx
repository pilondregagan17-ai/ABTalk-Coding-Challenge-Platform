import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Bookmark, 
  Clock, 
  Target, 
  Activity,
  Edit3,
  RotateCcw,
  User
} from 'lucide-react';
import type { Problem, Submission, UserStats } from '../types/index';
import { StorageService } from '../services/storage';

interface ProfileViewProps {
  userStats: UserStats;
  submissions: Submission[];
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onUpdateStats?: () => void;
}

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '🚀', '⚡', '🧙‍♂️', '🥷', '🤖', '👑', '🔥', '🛡️'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  userStats,
  submissions,
  problems,
  onSelectProblem,
  onUpdateStats
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState(userStats.username);
  const [editAvatar, setEditAvatar] = useState(userStats.avatar);
  const [editTitle, setEditTitle] = useState(userStats.title);

  // Generate 52 weeks (364 days) calendar dates for heatmap
  const daysInYear = Array.from({ length: 364 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (363 - i));
    const isoDate = d.toISOString().split('T')[0];
    const count = userStats.activityMap[isoDate] || 0;
    return { date: isoDate, count };
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-900/80 border-slate-800';
    if (count <= 2) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (count <= 4) return 'bg-emerald-700 border-emerald-600 text-emerald-200';
    if (count <= 6) return 'bg-emerald-500 border-emerald-400 text-slate-950';
    return 'bg-emerald-300 border-emerald-200 text-slate-950';
  };

  const bookmarkedProblems = userStats.bookmarks
    .map(id => problems.find(p => p.id === id || p.slug === id))
    .filter(Boolean) as Problem[];

  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;
  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateUserProfile(editUsername, editAvatar, editTitle);
    setShowEditModal(false);
    if (onUpdateStats) onUpdateStats();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all your submissions and stats? This will return your account to a clean fresh state.')) {
      StorageService.resetAllUserData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-modal">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-xl shadow-indigo-500/20 relative group">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-4xl overflow-hidden">
              {userStats.avatar && (userStats.avatar.startsWith('http') || userStats.avatar.startsWith('data:')) ? (
                <img src={userStats.avatar} alt={userStats.username} className="w-full h-full object-cover rounded-[20px]" referrerPolicy="no-referrer" />
              ) : (
                userStats.avatar || '👨‍💻'
              )}
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute inset-0 bg-black/60 rounded-[20px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-opacity"
            >
              Edit
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white">{userStats.username}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {userStats.title}
              </span>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-1 rounded text-slate-500 hover:text-indigo-400"
                title="Edit Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Global Standing #{userStats.rank || 1} • {userStats.points} XP Earned
            </p>
          </div>
        </div>

        {/* Quick Streak & Solved Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-4 bg-[#0b1120] p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 px-3 border-r border-slate-800">
              <Flame className={`w-6 h-6 ${userStats.streakDays > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-600'}`} />
              <div className="text-left">
                <div className="text-base font-extrabold text-white">{userStats.streakDays}d</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <div className="text-base font-extrabold text-white">{userStats.solvedCount}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Solved</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetData}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-medium transition-all"
            title="Reset practice data for a clean fresh start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GitHub-style 365 Days Activity Calendar Heatmap */}
      <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Submissions Activity Heatmap ({userStats.totalSubmissions} Total Submissions)
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-700 border border-emerald-600" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-300 border border-emerald-200" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid (52 columns x 7 rows) */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[720px]">
            {daysInYear.map((day, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-[3px] border ${getHeatmapColor(day.count)} transition-all hover:scale-125 cursor-pointer`}
                title={`${day.date}: ${day.count} submissions`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Solved Breakdown & Badges Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solved Stats Gauges (1 Col) */}
        <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Solved Breakdown</span>
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400">Easy</span>
                <span className="text-slate-300">{userStats.easyCount} / {Math.max(1, easyTotal)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(userStats.easyCount / Math.max(1, easyTotal)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">Medium</span>
                <span className="text-slate-300">{userStats.mediumCount} / {Math.max(1, mediumTotal)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(userStats.mediumCount / Math.max(1, mediumTotal)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-400">Hard</span>
                <span className="text-slate-300">{userStats.hardCount} / {Math.max(1, hardTotal)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(userStats.hardCount / Math.max(1, hardTotal)) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
            <span>Acceptance Rate:</span>
            <span className="text-white font-mono font-bold">{userStats.acceptanceRate}%</span>
          </div>
        </div>

        {/* Badges Trophy Case (2 Cols) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#090d16] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Badges & Achievements</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {userStats.badges.filter(b => b.unlocked).length} / {userStats.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userStats.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all text-center space-y-1.5 ${
                  badge.unlocked
                    ? 'bg-[#0b1120] border-indigo-500/30 text-white shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 text-slate-600 grayscale opacity-50'
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="font-bold text-xs">{badge.title}</div>
                <p className="text-[10px] text-slate-400 line-clamp-2">{badge.description}</p>
                {badge.unlocked && badge.unlockedAt && (
                  <div className="text-[9px] text-emerald-400 font-mono">Unlocked {badge.unlockedAt}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Submissions Archive */}
      <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Recent Submissions Archive ({submissions.length})</span>
        </h2>

        {submissions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">No submissions recorded yet</p>
            <p className="text-[11px] text-slate-500">Pick any challenge from the Problems arena to run code and build your profile!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.slice(0, 10).map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl bg-[#0b1120] border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                    sub.status === 'Accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {sub.status}
                  </span>
                  <span className="font-semibold text-white">{sub.problemTitle}</span>
                  <span className="font-mono text-slate-400 uppercase text-[10px]">{sub.language}</span>
                </div>

                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                  <span>{sub.runtimeMs}ms</span>
                  <span>{sub.memoryMB}MB</span>
                  <span className="text-[10px] text-slate-500">{new Date(sub.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Problems List */}
      {bookmarkedProblems.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bookmarked Problems ({bookmarkedProblems.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className="p-4 rounded-xl bg-[#0b1120] border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer group transition-all"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300">
                    {prob.title}
                  </h3>
                  <div className="text-[10px] text-slate-400">{prob.category} • {prob.difficulty}</div>
                </div>
                <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 space-y-5 animate-modal">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Customize Coder Profile</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Choose Avatar Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                        editAvatar === av
                          ? 'bg-indigo-600/30 border-indigo-500 scale-110'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Display Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                  className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Title / Specialization</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Algorithm Apprentice, Full-Stack Engineer"
                  className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
