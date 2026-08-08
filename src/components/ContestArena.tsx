import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Award, 
  Timer,
  ChevronRight
} from 'lucide-react';
import type { Contest, Problem } from '../types/index';
import { MOCK_CONTESTS } from '../data/mockContests';

interface ContestArenaProps {
  onSelectProblem: (problem: Problem) => void;
  problems: Problem[];
}

export const ContestArena: React.FC<ContestArenaProps> = ({
  onSelectProblem,
  problems
}) => {
  const [activeContest, setActiveContest] = useState<Contest>(MOCK_CONTESTS[0]);
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 minutes
  const [leaderboard, setLeaderboard] = useState(activeContest.leaderboard);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const contestProblems = activeContest.problemIds
    .map(id => problems.find(p => p.id === id || p.slug === id))
    .filter(Boolean) as Problem[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-modal">
      {/* Contest Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {MOCK_CONTESTS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveContest(c);
              setLeaderboard(c.leaderboard);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeContest.id === c.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/60'
                : 'bg-[#090d16] text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{c.title}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
              c.status === 'Live' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {c.status}
            </span>
          </button>
        ))}
      </div>

      {/* Main Contest Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-[#0e1628] to-indigo-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{activeContest.badge}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{activeContest.participantsCount.toLocaleString()} Participants</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeContest.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeContest.description}
            </p>
          </div>

          {/* Live Countdown Timer Clock Card */}
          <div className="p-6 rounded-2xl bg-[#090d16]/90 border border-indigo-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-1.5 shadow-xl shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>Time Remaining</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              {formatTime(secondsRemaining)}
            </div>
            <p className="text-[11px] text-slate-500">Auto-submits when countdown reaches zero</p>
          </div>
        </div>
      </div>

      {/* Grid: Contest Problems on Left, Live Leaderboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Problems List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>Contest Problem Set</span>
            <span className="text-xs font-mono text-slate-400">({contestProblems.length} Challenges)</span>
          </h2>

          <div className="space-y-3">
            {contestProblems.map((prob, idx) => {
              const points = (idx + 1) * 100;
              return (
                <div
                  key={prob.id}
                  onClick={() => onSelectProblem(prob)}
                  className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all cursor-pointer flex items-center justify-between group shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      Q{idx + 1}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {prob.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.2 rounded font-medium text-[10px] ${
                          prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                        }`}>
                          {prob.difficulty}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono font-semibold text-amber-400">
                          {points} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-indigo-600 group-hover:border-indigo-500 text-slate-400 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Leaderboard (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Live Leaderboard</span>
            </h2>
            <span className="text-[11px] text-emerald-400 font-mono animate-pulse">● Live Updating</span>
          </div>

          <div className="rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-3 bg-[#0b1120] border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Rank & Pioneer</span>
              <span>Score / Penalty</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[460px] overflow-y-auto">
              {leaderboard.length > 0 ? (
                leaderboard.map((p) => (
                  <div
                    key={p.rank}
                    className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                      p.isCurrentUser ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 font-mono font-bold text-center ${
                        p.rank === 1 ? 'text-amber-400' : p.rank === 2 ? 'text-slate-300' : p.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        #{p.rank}
                      </span>
                      <span className="text-sm">{p.avatar}</span>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{p.username}</span>
                          {p.isCurrentUser && (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{p.country}</span>
                          <span>• {p.solvedProblems.length} solved</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-indigo-400 text-xs">
                        {p.score} pts
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {p.penaltyTimeMinutes}m
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2">
                  <div className="text-slate-400 text-xs font-semibold">No submissions yet</div>
                  <p className="text-slate-600 text-[11px]">
                    Be the first to solve a contest problem and claim the #1 spot!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
