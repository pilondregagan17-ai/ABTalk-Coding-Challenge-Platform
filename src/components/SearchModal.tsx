import React, { useState, useEffect } from 'react';
import { Search, Code2, ArrowRight, X } from 'lucide-react';
import type { Problem } from '../types/index';

interface SearchModalProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  problems,
  onSelectProblem,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Escape key listener to close modal from anywhere
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClose]);

  const filtered = problems.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q) ||
      p.companies?.some(c => c.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectProblem(filtered[selectedIndex]);
      onClose();
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-indigo-500/30 shadow-2xl overflow-hidden animate-modal cursor-default"
      >
        {/* Search input bar */}
        <div className="relative flex items-center border-b border-slate-800 px-4 py-3.5 gap-2">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type to search algorithm challenges, companies, or categories..."
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-medium"
          />
          
          {/* Clear query button if text exists */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              title="Clear search"
            >
              Clear
            </button>
          )}

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs flex items-center gap-1 shrink-0"
            title="Close (Esc)"
          >
            <span className="hidden sm:inline font-mono text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
              ESC
            </span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching problems found. Try another search term.
            </div>
          ) : (
            filtered.map((problem, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={problem.id}
                  onClick={() => {
                    onSelectProblem(problem);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{problem.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                          problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">{problem.category}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
