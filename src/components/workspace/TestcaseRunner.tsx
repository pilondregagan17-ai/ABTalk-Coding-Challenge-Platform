import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Code2, 
  AlertCircle
} from 'lucide-react';
import type { ExecutionResult, TestCase, TestResultItem } from '../../types/index';

interface TestcaseRunnerProps {
  testcases: TestCase[];
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  onAddCustomTestCase: (input: string, expectedOutput: string) => void;
  onDeleteCustomTestCase: (id: number) => void;
}

export const TestcaseRunner: React.FC<TestcaseRunnerProps> = ({
  testcases,
  executionResult,
  isRunning,
  onAddCustomTestCase,
  onDeleteCustomTestCase
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'testcases' | 'console'>('testcases');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');

  const currentCase = testcases[activeCaseIndex] || testcases[0];
  const currentResult = executionResult?.testResults.find(r => r.id === currentCase?.id);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddCustomTestCase(customInput.trim(), customExpected.trim());
      setCustomInput('');
      setCustomExpected('');
      setShowCustomModal(false);
      setActiveCaseIndex(testcases.length); // Switch to the newly created case
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#090d16] border-t border-slate-800 overflow-hidden">
      {/* Console & Testcase Tabs Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#070b14] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'testcases'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Testcases ({testcases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'console'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stdout Logs {executionResult?.stdoutLogs && executionResult.stdoutLogs.length > 0 && `(${executionResult.stdoutLogs.length})`}</span>
          </button>
        </div>

        {/* Status / Verdict Summary Badge if Result Available */}
        {executionResult && (
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
              executionResult.status === 'Accepted'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {executionResult.status} ({executionResult.passedCount}/{executionResult.totalCount} Passed)
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              {executionResult.runtimeMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === 'testcases' && (
          <div className="space-y-4">
            {/* Horizontal Test Case Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {testcases.map((tc, idx) => {
                const res = executionResult?.testResults.find(r => r.id === tc.id);
                const isPassed = res?.passed;
                const isFailed = res && !res.passed;

                return (
                  <button
                    key={tc.id}
                    onClick={() => setActiveCaseIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all border ${
                      activeCaseIndex === idx
                        ? 'bg-slate-800 text-white border-indigo-500/60 shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isPassed && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    {isFailed && <span className="w-2 h-2 rounded-full bg-rose-400"></span>}
                    {!res && <span className="w-2 h-2 rounded-full bg-slate-600"></span>}
                    <span>Case {idx + 1}</span>
                    {tc.isCustom && <span className="text-[9px] text-cyan-400 font-mono">(Custom)</span>}
                  </button>
                );
              })}

              {/* Add Custom Testcase Button */}
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-all"
                title="Add your own custom test case"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test</span>
              </button>
            </div>

            {/* Selected Case Content */}
            {currentCase && (
              <div className="space-y-3">
                {/* Input Card */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Input Arguments
                    </span>
                    {currentCase.isCustom && (
                      <button
                        onClick={() => onDeleteCustomTestCase(currentCase.id)}
                        className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <pre className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                    <code>{currentCase.input}</code>
                  </pre>
                </div>

                {/* Diff Viewer: Expected vs Actual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Expected Output */}
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Expected Output
                    </span>
                    <pre className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{currentCase.expectedOutput}</code>
                    </pre>
                  </div>

                  {/* Actual Output */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                        Actual Output
                      </span>
                      {currentResult && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          currentResult.passed ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {currentResult.passed ? 'MATCH' : 'MISMATCH'}
                        </span>
                      )}
                    </div>
                    <pre className={`p-3 rounded-lg bg-[#070b14] border text-xs font-mono overflow-x-auto ${
                      !currentResult
                        ? 'border-slate-800 text-slate-500'
                        : currentResult.passed
                        ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/10'
                        : 'border-rose-500/30 text-rose-300 bg-rose-950/10'
                    }`}>
                      <code>
                        {currentResult ? currentResult.actualOutput : 'Click "Run" to test solution...'}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Error Summary or Individual Case Logs */}
                {currentResult?.error && (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Runtime Exception</span>
                    </div>
                    <p>{currentResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stdout Console Logs */}
        {activeTab === 'console' && (
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Captured console.log() Stream
            </span>
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-mono text-indigo-300 space-y-1 min-h-[140px] max-h-[220px] overflow-y-auto">
              {!executionResult || executionResult.stdoutLogs.length === 0 ? (
                <div className="text-slate-600 italic">
                  No logs captured. Use console.log() in your code to debug values in real-time.
                </div>
              ) : (
                executionResult.stdoutLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span className="text-slate-200">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal to Add Custom Test Case */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 space-y-4 animate-modal">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>Add Custom Test Case</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Input Parameters (e.g. nums = [2,7,11], target = 9)
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                  placeholder="nums = [1, 2, 3], target = 4"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Output (e.g. [0, 2] or true)
                </label>
                <input
                  type="text"
                  value={customExpected}
                  onChange={(e) => setCustomExpected(e.target.value)}
                  required
                  className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                  placeholder="[0, 2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/40"
                >
                  Save Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
