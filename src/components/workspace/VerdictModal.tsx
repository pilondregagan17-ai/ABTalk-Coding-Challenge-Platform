import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  XCircle, 
  Clock, 
  Cpu, 
  ArrowRight, 
  Flame,
  Zap
} from 'lucide-react';
import type { ExecutionResult, Problem } from '../../types/index';
import { audioService } from '../../services/audio';

interface VerdictModalProps {
  problem: Problem;
  result: ExecutionResult;
  onClose: () => void;
  onNextProblem: () => void;
}

export const VerdictModal: React.FC<VerdictModalProps> = ({
  problem,
  result,
  onClose,
  onNextProblem
}) => {
  const isAccepted = result.status === 'Accepted';
  const runtimePercentile = result.runtimePercentile !== undefined ? result.runtimePercentile : 100.0;
  const memoryPercentile = result.memoryPercentile !== undefined ? result.memoryPercentile : 100.0;
  const isTopRecord = runtimePercentile >= 100.0;

  useEffect(() => {
    if (isAccepted) {
      audioService.playSuccessFanfare();

      // Launch dynamic confetti burst
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ec4899']
        });
      } catch {}
    } else {
      audioService.playTestFail();
    }
  }, [isAccepted]);

  // Global Escape key listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl bg-[#0e1626] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 animate-modal relative overflow-hidden cursor-default"
      >
        {/* Glow backdrop accent */}
        <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${
          isAccepted ? 'from-emerald-400 via-teal-500 to-indigo-500' : 'from-rose-500 via-red-500 to-amber-500'
        }`} />

        {/* Header Verdict Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isAccepted ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
            }`}>
              {isAccepted ? <Trophy className="w-6 h-6 animate-bounce" /> : <XCircle className="w-6 h-6" />}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{result.status}</span>
                {isAccepted && <span className="text-xl">🎉</span>}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {problem.title} • {result.passedCount}/{result.totalCount} Testcases Passed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Accepted Percentile Analytics Cards */}
        {isAccepted && (
          <div className="space-y-4">
            {isTopRecord && (
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Pioneer Benchmark: You hold the #1 fastest solution on record!</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                  Top 100%
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Runtime Percentile */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Runtime</span>
                  </span>
                  <span className="font-mono text-white font-bold">{result.runtimeMs} ms</span>
                </div>
                <div className="text-lg font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <span>Beats {runtimePercentile.toFixed(1)}%</span>
                  {isTopRecord && <span className="text-xs">🏆</span>}
                </div>
                <p className="text-[11px] text-slate-500">
                  {isTopRecord 
                    ? 'Fastest execution recorded on the platform!' 
                    : 'Faster than historical submissions'}
                </p>

                {/* Bell curve bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(10, Math.min(100, runtimePercentile))}%` }}
                  />
                </div>
              </div>

              {/* Memory Percentile */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Memory</span>
                  </span>
                  <span className="font-mono text-white font-bold">{result.memoryMB} MB</span>
                </div>
                <div className="text-lg font-extrabold text-cyan-400">
                  Beats {memoryPercentile.toFixed(1)}%
                </div>
                <p className="text-[11px] text-slate-500">
                  Memory optimized solution profile
                </p>

                {/* Bell curve bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(10, Math.min(100, memoryPercentile))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak & XP Rewards Badge */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                <div>
                  <div className="text-xs font-bold text-amber-300">+50 XP Awarded & Synced!</div>
                  <div className="text-[11px] text-slate-400">Synced to Firebase Firestore & activity heatmap</div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                Pioneer Rank ⬆️
              </span>
            </div>
          </div>
        )}

        {/* Failed Test Info */}
        {!isAccepted && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <p className="text-xs text-rose-300 font-medium leading-relaxed">
              Your solution did not pass all hidden testcases. Review edge cases such as empty inputs, negative numbers, or maximum boundary values.
            </p>
            {result.errorSummary && (
              <pre className="p-2.5 rounded bg-black/50 text-[11px] font-mono text-rose-400 overflow-x-auto">
                {result.errorSummary}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Review Code
          </button>

          {isAccepted && (
            <button
              onClick={onNextProblem}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
