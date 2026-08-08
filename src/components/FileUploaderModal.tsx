import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react';
import type { Problem } from '../types/index';
import { StorageService } from '../services/storage';

interface FileUploaderModalProps {
  onLoadCode: (code: string, fileName: string) => void;
  onImportProblem: (problem: Problem) => void;
  onClose: () => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  onLoadCode,
  onImportProblem,
  onClose
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Global Escape key listener
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClose]);

  const handleFileUpload = (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');

    const reader = new FileReader();
    const isJson = file.name.endsWith('.json');

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      if (isJson) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.title && parsed.description) {
            const importedProblem: Problem = {
              id: parsed.id || `imported-${Date.now()}`,
              title: parsed.title,
              slug: parsed.slug || `imported-${Date.now()}`,
              difficulty: parsed.difficulty || 'Medium',
              category: parsed.category || 'Arrays & Hashing',
              acceptanceRate: 80.0,
              solvedByCount: 1,
              companies: parsed.companies || ['Community'],
              description: parsed.description,
              examples: parsed.examples || [
                { input: 'input = [1, 2]', output: '[2, 1]', explanation: 'Reversed order' }
              ],
              constraints: parsed.constraints || ['1 <= n <= 10^5'],
              starterCode: parsed.starterCode || {
                javascript: '// Write your code here\n',
                typescript: '// Write your code here\n',
                python: '# Write your code here\n',
                cpp: '// Write your code here\n',
                java: '// Write your code here\n'
              },
              solutionTemplate: parsed.solutionTemplate || {
                javascript: '// Solution\n',
                typescript: '// Solution\n',
                python: '# Solution\n',
                cpp: '// Solution\n',
                java: '// Solution\n'
              },
              testcases: parsed.testcases || [
                { id: 1, input: 'input = [1, 2]', expectedOutput: '[2, 1]' }
              ],
              hints: parsed.hints || ['Think carefully about constraints.'],
              editorial: parsed.editorial || {
                approach: 'Community approach',
                intuition: 'Imported solution package intuition.',
                complexity: { time: 'O(N)', space: 'O(1)' },
                codeSolution: {
                  javascript: '// Code\n',
                  typescript: '// Code\n',
                  python: '# Code\n',
                  cpp: '// Code\n',
                  java: '// Code\n'
                }
              },
              isCustom: true
            };

            StorageService.saveCustomProblem(importedProblem);
            onImportProblem(importedProblem);
            setSuccessMsg(`Successfully imported challenge package "${parsed.title}"!`);
            setTimeout(() => onClose(), 1200);
            return;
          }
        } catch {
          // If JSON parse failed, fallback to loading as raw code file
        }
      }

      // Load as source code into active editor
      onLoadCode(content, file.name);
      setSuccessMsg(`Loaded ${file.name} directly into your active workspace editor!`);
      setTimeout(() => onClose(), 1000);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 animate-modal cursor-default"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Code or Challenge Package</h2>
              <p className="text-xs text-slate-400">Load solution scripts or import custom JSON challenge files</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-indigo-500 bg-indigo-950/40 scale-[1.02]'
              : 'border-slate-700 bg-[#090d16] hover:border-slate-600'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.js,.ts,.py,.cpp,.java,.json';
            input.onchange = (e: any) => {
              if (e.target.files[0]) handleFileUpload(e.target.files[0]);
            };
            input.click();
          }}
        >
          <FileCode className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-white">
            Drag and drop your file here, or <span className="text-indigo-400 underline">browse</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supported extensions: .js, .ts, .py, .cpp, .java, or .json
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
