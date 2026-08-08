import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Upload
} from 'lucide-react';
import type { Problem, SupportedLanguage } from '../../types/index';
import { audioService } from '../../services/audio';

interface CodeEditorProps {
  problem: Problem;
  code: string;
  onChangeCode: (code: string) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onRunCode: () => void;
  onSubmitCode: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  onResetCode: () => void;
}

const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; ext: string; icon: string }> = {
  javascript: { label: 'JavaScript (Node v20)', ext: '.js', icon: '🟨' },
  typescript: { label: 'TypeScript 5.0', ext: '.ts', icon: '🟦' },
  python: { label: 'Python 3.11', ext: '.py', icon: '🐍' },
  cpp: { label: 'C++ 20 (GCC)', ext: '.cpp', icon: '⚡' },
  java: { label: 'Java 21 (OpenJDK)', ext: '.java', icon: '☕' }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  onRunCode,
  onSubmitCode,
  isRunning,
  isSubmitting,
  onResetCode
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Auto-resize line numbers based on code line count
  const lines = code.split('\n');
  const lineCount = lines.length;

  const lastKeySound = useRef(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Sound effect on keypress
    const now = Date.now();
    if (now - lastKeySound.current > 150) {
      audioService.playKeyClick();
      lastKeySound.current = now;
    }

    // Shortcuts: Ctrl+Enter (Run), Ctrl+Shift+Enter (Submit)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onSubmitCode();
      } else {
        onRunCode();
      }
      return;
    }

    // Tab key indentation support (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChangeCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Synchronize line numbers scroll with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag and drop file upload directly onto the editor
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onChangeCode(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className={`flex flex-col bg-[#070b14] border-b border-slate-800 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#070b14]' : 'h-[55%] min-h-[280px]'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0a0f1d] shrink-0">
        {/* Left: Language Select & Draft Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            >
              {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang].icon} {LANGUAGE_LABELS[lang].label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Draft auto-saved</span>
          </div>
        </div>

        {/* Right Toolbar: Actions & Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Scaling */}
          <button
            onClick={() => setFontSize(fontSize === 16 ? 12 : fontSize + 2)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-all"
            title="Adjust Font Size"
          >
            {fontSize}px
          </button>

          {/* Reset Code Boilerplate */}
          <button
            onClick={onResetCode}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
            title="Reset code to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            onClick={copyCode}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Run Code Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning || isSubmitting}
            className="ml-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            title="Run code against testcases (Ctrl + Enter)"
          >
            <Play className={`w-3.5 h-3.5 text-indigo-400 ${isRunning ? 'animate-spin' : 'fill-indigo-400'}`} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 bg-slate-900 rounded text-[9px] text-slate-400 border border-slate-800">
              ^↵
            </kbd>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={onSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all disabled:opacity-50"
            title="Submit solution for full grading (Ctrl + Shift + Enter)"
          >
            <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Drag and drop overlay hint */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-indigo-950/80 backdrop-blur-sm border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center text-white">
          <Upload className="w-10 h-10 text-indigo-400 animate-bounce mb-2" />
          <p className="font-semibold text-sm">Drop solution code file here</p>
          <p className="text-xs text-indigo-300">Supports .js, .ts, .py, .cpp, .java</p>
        </div>
      )}

      {/* Code Textarea & Gutter */}
      <div className="flex-1 relative flex overflow-hidden bg-[#070b14]">
        {/* Line Numbers Gutter */}
        <div 
          ref={lineNumbersRef}
          className="w-12 py-3 bg-[#090d16] text-right pr-3 select-none text-slate-600 font-mono text-xs border-r border-slate-800/80 overflow-hidden shrink-0 leading-[1.6]"
          style={{ fontSize: `${fontSize}px` }}
        >
          {Array.from({ length: Math.max(15, lineCount) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Primary Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono outline-none resize-none overflow-auto whitespace-pre leading-[1.6] selection:bg-indigo-600/40 tab-size-2"
          style={{ 
            fontSize: `${fontSize}px`,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace"
          }}
          placeholder="// Write your algorithm solution here..."
        />
      </div>
    </div>
  );
};
