import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  HelpCircle, 
  AlertCircle, 
  Send, 
  Bot, 
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import type { Problem, SupportedLanguage } from '../../types/index';

interface AiAssistantModalProps {
  problem: Problem;
  code: string;
  language: SupportedLanguage;
  initialMode: 'hint' | 'debug' | 'complexity';
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  problem,
  code,
  language,
  initialMode,
  onClose
}) => {
  const [mode, setMode] = useState<'hint' | 'debug' | 'complexity'>(initialMode);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: getInitialPrompt(initialMode, problem)
    }
  ]);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  function getInitialPrompt(m: string, p: Problem): string {
    if (m === 'hint') {
      return `Hello! I'm your Pioneer AI Algorithm Mentor for "${p.title}". How can I guide your problem-solving process today without giving away the full answer?`;
    } else if (m === 'debug') {
      return `I am analyzing your ${language} solution for edge-cases, null checks, off-by-one errors, and boundary limits. What specific case would you like to inspect?`;
    } else {
      return `Let's perform a time & space complexity breakdown on your solution for "${p.title}". Ask me about asymptotic big-O bounds!`;
    }
  }

  const handleSend = (userMsg: string) => {
    if (!userMsg.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMsgs);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('complexity') || mode === 'complexity') {
        aiResponse = `📊 **Complexity Analysis** for your solution:\n\n• **Time Complexity**: Optimal target is ${problem.editorial.complexity.time}. If you are using nested loops, consider how a Hash Map or Two Pointers can reduce this to linear O(N).\n• **Space Complexity**: ${problem.editorial.complexity.space}.\n\n*Pro-tip*: Storing indices in a hash table provides O(1) average lookup.`;
      } else if (lower.includes('hint') || lower.includes('stuck') || mode === 'hint') {
        const hint1 = problem.hints[0] || 'Consider breaking the problem into subproblems.';
        aiResponse = `💡 **Socratic Guidance**:\n\n${hint1}\n\nAsk yourself: What invariant remains true at each step of iteration? Can we shrink the search space?`;
      } else {
        aiResponse = `🔍 **Code Doctor Edge-Case Check**:\n\n1. Check for empty input or single-element inputs.\n2. Verify loop boundaries to avoid index out of range.\n3. Make sure you don't use the same element twice if problem constraints forbid it.`;
      }

      setMessages([...newMsgs, { role: 'ai', text: aiResponse }]);
      setIsThinking(false);
    }, 700);
  };

  // Global Escape key listener
  React.useEffect(() => {
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
        className="w-full max-w-xl rounded-3xl bg-[#0f172a] border border-indigo-500/30 shadow-2xl p-6 flex flex-col h-[560px] animate-modal relative cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pioneer AI Doctor</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AB Talk Mentor
                </span>
              </h3>
              <p className="text-xs text-slate-400">Contextual hints & algorithmic guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setMode('hint')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              mode === 'hint' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Socratic Hint</span>
          </button>

          <button
            onClick={() => setMode('debug')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              mode === 'debug' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Edge-Case Doctor</span>
          </button>

          <button
            onClick={() => setMode('complexity')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              mode === 'complexity' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Complexity Breakdown</span>
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-[#090d16] border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#090d16] border border-slate-800 text-slate-400 animate-pulse">
                Analyzing algorithm structure...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(query);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question or request a subtle hint..."
              className="flex-1 rounded-xl bg-[#090d16] border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-950"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
