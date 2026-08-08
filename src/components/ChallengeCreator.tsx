import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Upload,
  ArrowRight,
  HelpCircle,
  FileCode
} from 'lucide-react';
import type { Category, Difficulty, Problem, TestCase } from '../types/index';
import { StorageService } from '../services/storage';

interface ChallengeCreatorProps {
  onChallengeCreated: (problem: Problem) => void;
  onCancel: () => void;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({
  onChallengeCreated,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [category, setCategory] = useState<Category>('Arrays & Hashing');
  const [description, setDescription] = useState('');
  const [companies, setCompanies] = useState('AB Talk, Google, Amazon');
  const [constraints, setConstraints] = useState('1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9');
  const [hints, setHints] = useState('Consider using a Hash Map or Two Pointers.\nCheck for boundary values.');
  
  const [exampleInput, setExampleInput] = useState('nums = [2, 7, 11, 15], target = 9');
  const [exampleOutput, setExampleOutput] = useState('[0, 1]');
  const [exampleExplanation, setExampleExplanation] = useState('Because nums[0] + nums[1] == 9.');

  const [starterJs, setStarterJs] = useState(`/**
 * @param {any} input
 * @return {any}
 */
function solveChallenge(input) {
  // Write your solution here
  
}`);

  const [testcases, setTestcases] = useState<TestCase[]>([
    { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
    { id: 2, input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', isHidden: false },
    { id: 3, input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', isHidden: true }
  ]);

  const [newTestInput, setNewTestInput] = useState('');
  const [newTestExpected, setNewTestExpected] = useState('');
  const [isTestHidden, setIsTestHidden] = useState(false);

  const handleAddTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestInput.trim() || !newTestExpected.trim()) return;

    setTestcases([
      ...testcases,
      {
        id: Date.now(),
        input: newTestInput.trim(),
        expectedOutput: newTestExpected.trim(),
        isHidden: isTestHidden,
        isCustom: true
      }
    ]);
    setNewTestInput('');
    setNewTestExpected('');
    setIsTestHidden(false);
  };

  const handleRemoveTestCase = (id: number) => {
    setTestcases(testcases.filter(tc => tc.id !== id));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out Title and Problem Description.');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProblem: Problem = {
      id: slug || `custom-${Date.now()}`,
      title,
      slug: slug || `custom-${Date.now()}`,
      difficulty,
      category,
      acceptanceRate: 0,
      solvedByCount: 0,
      companies: companies.split(',').map(c => c.trim()).filter(Boolean),
      description,
      examples: [
        {
          input: exampleInput,
          output: exampleOutput,
          explanation: exampleExplanation
        }
      ],
      constraints: constraints.split('\n').map(c => c.trim()).filter(Boolean),
      starterCode: {
        javascript: starterJs,
        typescript: starterJs,
        python: `class Solution:\n    def solve(self, input):\n        # Write your code here\n        pass\n`,
        cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};\n`,
        java: `class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}\n`
      },
      solutionTemplate: {
        javascript: starterJs,
        typescript: starterJs,
        python: starterJs,
        cpp: starterJs,
        java: starterJs
      },
      testcases,
      hints: hints.split('\n').map(h => h.trim()).filter(Boolean),
      editorial: {
        approach: 'Custom Community Solution Approach',
        intuition: 'Optimized algorithmic approach constructed by community challenge author.',
        complexity: {
          time: 'O(N) - Linear optimal evaluation.',
          space: 'O(1) or O(N) auxiliary space.'
        },
        codeSolution: {
          javascript: starterJs,
          typescript: starterJs,
          python: starterJs,
          cpp: starterJs,
          java: starterJs
        }
      },
      author: 'You (Pioneer)',
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    StorageService.saveCustomProblem(newProblem);
    onChallengeCreated(newProblem);
  };

  const handleExportJSON = () => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'challenge';
    const blob = new Blob([JSON.stringify({ title, difficulty, category, description, testcases }, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-package.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-modal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create Custom Challenge
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              Community Architect
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build your own algorithmic challenge, add automated test suites, and share with developers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Download problem package as JSON"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Basic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Problem Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Invert Matrix Spirals or Word Search II"
              className="w-full rounded-xl bg-[#090d16] border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full rounded-xl bg-[#090d16] border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-xl bg-[#090d16] border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Arrays & Hashing">Arrays & Hashing</option>
              <option value="Two Pointers">Two Pointers</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Stack & Queue">Stack & Queue</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Linked List">Linked List</option>
              <option value="Trees & Graphs">Trees & Graphs</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Math & Geometry">Math & Geometry</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Company Tags (Comma separated)</label>
            <input
              type="text"
              value={companies}
              onChange={(e) => setCompanies(e.target.value)}
              placeholder="AB Talk, Google, Meta, Apple"
              className="w-full rounded-xl bg-[#090d16] border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            Problem Description (Markdown supported) *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Given an array of numbers, return the unique elements satisfying..."
            className="w-full rounded-xl bg-[#090d16] border border-slate-800 p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Primary Example */}
        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Primary Example Case
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Example Input</label>
              <input
                type="text"
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs font-mono text-cyan-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Example Output</label>
              <input
                type="text"
                value={exampleOutput}
                onChange={(e) => setExampleOutput(e.target.value)}
                className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs font-mono text-emerald-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Explanation</label>
            <input
              type="text"
              value={exampleExplanation}
              onChange={(e) => setExampleExplanation(e.target.value)}
              className="w-full rounded-lg bg-[#070b14] border border-slate-700 p-2.5 text-xs text-slate-300"
            />
          </div>
        </div>

        {/* Starter Code Boilerplate */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            Starter Code (JavaScript)
          </label>
          <textarea
            value={starterJs}
            onChange={(e) => setStarterJs(e.target.value)}
            rows={5}
            className="w-full rounded-xl bg-[#070b14] border border-slate-800 p-3.5 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Test Cases Builder */}
        <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Automated Evaluation Testcases ({testcases.length})
            </h3>
            <span className="text-[11px] text-slate-400">Includes public & hidden stress tests</span>
          </div>

          <div className="space-y-2">
            {testcases.map((tc, idx) => (
              <div 
                key={tc.id}
                className="p-3 rounded-lg bg-[#070b14] border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">#{idx + 1}</span>
                  <span className="text-cyan-300">{tc.input}</span>
                  <span className="text-slate-600">=&gt;</span>
                  <span className="text-emerald-400">{tc.expectedOutput}</span>
                  {tc.isHidden && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Hidden Test
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTestCase(tc.id)}
                  className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Case Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <input
              type="text"
              value={newTestInput}
              onChange={(e) => setNewTestInput(e.target.value)}
              placeholder="Input (e.g. nums=[1,2], target=3)"
              className="rounded-lg bg-[#070b14] border border-slate-700 p-2 text-xs font-mono text-cyan-300"
            />
            <input
              type="text"
              value={newTestExpected}
              onChange={(e) => setNewTestExpected(e.target.value)}
              placeholder="Expected Output (e.g. [0,1])"
              className="rounded-lg bg-[#070b14] border border-slate-700 p-2 text-xs font-mono text-emerald-400"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTestHidden}
                  onChange={(e) => setIsTestHidden(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                />
                <span>Hidden</span>
              </label>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                + Add Test
              </button>
            </div>
          </div>
        </div>

        {/* Submit & Publish CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Discard
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Challenge to Arena</span>
          </button>
        </div>
      </form>
    </div>
  );
};
