import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemList } from './components/ProblemList';
import { ProblemDescription } from './components/workspace/ProblemDescription';
import { CodeEditor } from './components/workspace/CodeEditor';
import { TestcaseRunner } from './components/workspace/TestcaseRunner';
import { VerdictModal } from './components/workspace/VerdictModal';
import { AiAssistantModal } from './components/workspace/AiAssistantModal';
import { ChallengeCreator } from './components/ChallengeCreator';
import { FileUploaderModal } from './components/FileUploaderModal';
import { ContestArena } from './components/ContestArena';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import type { AuthUser, ExecutionResult, Problem, Submission, SupportedLanguage, UserStats } from './types/index';
import { StorageService } from './services/storage';
import { FirestoreService } from './services/firestore';
import { logoutUser, subscribeToAuthChanges, signInWithGoogle } from './services/firebase';
import { runCode } from './services/codeRunner';
import { audioService } from './services/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<'problems' | 'workspace' | 'contests' | 'create' | 'leaderboard' | 'profile'>('problems');
  
  // All Problems (including built-in and user-created custom problems)
  const [allProblems, setAllProblems] = useState<Problem[]>(() => {
    try {
      const list = StorageService.getAllProblems();
      return list && list.length > 0 ? list : INITIAL_PROBLEMS;
    } catch {
      return INITIAL_PROBLEMS;
    }
  });

  const [selectedProblem, setSelectedProblem] = useState<Problem>(() => {
    try {
      const list = StorageService.getAllProblems();
      return (list && list[0]) || INITIAL_PROBLEMS[0];
    } catch {
      return INITIAL_PROBLEMS[0];
    }
  });

  // Active Code Editor state
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState<string>(() => {
    try {
      const list = StorageService.getAllProblems();
      const prob = (list && list[0]) || INITIAL_PROBLEMS[0];
      const draft = StorageService.getDraft(prob.id, 'javascript');
      return draft || prob.starterCode?.javascript || '// Start coding here\n';
    } catch {
      return INITIAL_PROBLEMS[0].starterCode.javascript;
    }
  });

  // Runner & Submission states
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerdictModal, setShowVerdictModal] = useState(false);

  // AI Assistant Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiMode, setAiMode] = useState<'hint' | 'debug' | 'complexity'>('hint');

  // Search, Upload & Auth Modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Real Authentication State (Starts Logged Out by Default)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Submissions, User Stats, and Bookmarks
  const [submissions, setSubmissions] = useState<Submission[]>(() => StorageService.getSubmissions());
  const [userStats, setUserStats] = useState<UserStats>(() => StorageService.getUserStats());
  const [bookmarks, setBookmarks] = useState<string[]>(() => StorageService.getBookmarks());

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setAuthUser(user);
      if (user) {
        const updated = StorageService.updateUserProfile(
          user.displayName || user.email?.split('@')[0] || 'Developer',
          user.photoURL || '👨‍💻',
          'Google Verified Pioneer',
          user.uid,
          user.email,
          user.photoURL
        );
        setUserStats(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+Enter, Ctrl+Shift+Enter, Ctrl+H, Ctrl+U, Ctrl+B, Alt+1..5, ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Search Modal: Ctrl + K / Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
        return;
      }

      // 2. Upload Modal: Ctrl + U
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setShowUploadModal(prev => !prev);
        return;
      }

      // 3. AI Assistant / Hint: Ctrl + H or Alt + H
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') || (e.altKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        setShowAiModal(prev => !prev);
        return;
      }

      // 4. Bookmark toggle: Ctrl + B or Alt + B
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') || (e.altKey && e.key.toLowerCase() === 'b')) {
        if (selectedProblem) {
          e.preventDefault();
          handleToggleBookmark(selectedProblem.id);
          return;
        }
      }

      // 5. Global Tab Switchers: Alt + 1..6
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); setActiveTab('problems'); return; }
        if (e.key === '2') { e.preventDefault(); setActiveTab('workspace'); return; }
        if (e.key === '3') { e.preventDefault(); setActiveTab('contests'); return; }
        if (e.key === '4') { e.preventDefault(); setActiveTab('leaderboard'); return; }
        if (e.key === '5') { e.preventDefault(); setActiveTab('profile'); return; }
        if (e.key === '6' || e.key.toLowerCase() === 'c') { e.preventDefault(); setActiveTab('create'); return; }
      }

      // 6. Global Escape: dismiss all open modals
      if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowUploadModal(false);
        setShowAuthModal(false);
        setShowVerdictModal(false);
        setShowAiModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProblem]);

  // When problem or language changes, load code from draft or starter code
  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    const draft = StorageService.getDraft(problem.id, language);
    setCode(draft || problem.starterCode[language] || problem.starterCode.javascript);
    setExecutionResult(null);
    setActiveTab('workspace');
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const draft = StorageService.getDraft(selectedProblem.id, newLang);
    setCode(draft || selectedProblem.starterCode[newLang] || selectedProblem.starterCode.javascript);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    StorageService.saveDraft(selectedProblem.id, language, newCode);
  };

  const handleResetCode = () => {
    const initial = selectedProblem.starterCode[language] || selectedProblem.starterCode.javascript;
    setCode(initial);
    StorageService.saveDraft(selectedProblem.id, language, initial);
  };

  // Run Code against current public testcases
  const handleRunCode = async () => {
    setIsRunning(true);
    audioService.playRunStart();
    try {
      const result = await runCode(selectedProblem, language, code, selectedProblem.testcases, false);
      setExecutionResult(result);
      if (result.status === 'Accepted') {
        audioService.playTestPass();
      } else {
        audioService.playTestFail();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution against full test suite (including hidden edge cases)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    audioService.playRunStart();
    try {
      const result = await runCode(selectedProblem, language, code, selectedProblem.testcases, true);
      setExecutionResult(result);
      setShowVerdictModal(true);

      // Record Submission
      const submission: Submission = {
        id: `sub-${Date.now()}`,
        problemId: selectedProblem.id,
        problemTitle: selectedProblem.title,
        difficulty: selectedProblem.difficulty,
        language,
        code,
        status: result.status,
        runtimeMs: result.runtimeMs,
        memoryMB: result.memoryMB,
        passedCount: result.passedCount,
        totalCount: result.totalCount,
        timestamp: Date.now()
      };

      StorageService.saveSubmission(submission);
      const freshStats = StorageService.getUserStats();
      FirestoreService.syncSubmission(submission, freshStats);
      setSubmissions(StorageService.getSubmissions());
      setUserStats(freshStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Test Case Add & Delete
  const handleAddCustomTestCase = (input: string, expectedOutput: string) => {
    const newCase = {
      id: Date.now(),
      input,
      expectedOutput,
      isCustom: true
    };
    setSelectedProblem({
      ...selectedProblem,
      testcases: [...selectedProblem.testcases, newCase]
    });
  };

  const handleDeleteCustomTestCase = (id: number) => {
    setSelectedProblem({
      ...selectedProblem,
      testcases: selectedProblem.testcases.filter(tc => tc.id !== id)
    });
  };

  // Toggle Bookmark
  const handleToggleBookmark = (problemId: string = selectedProblem.id) => {
    StorageService.toggleBookmark(problemId);
    setBookmarks(StorageService.getBookmarks());
  };

  // Next Problem Navigation
  const handleNextProblem = () => {
    const currentIndex = allProblems.findIndex(p => p.id === selectedProblem.id);
    const nextProblem = allProblems[(currentIndex + 1) % allProblems.length];
    setShowVerdictModal(false);
    handleSelectProblem(nextProblem);
  };

  // Open AI Assistant
  const handleOpenAiAssistant = (mode: 'hint' | 'debug' | 'complexity') => {
    setAiMode(mode);
    setShowAiModal(true);
  };

  // When custom challenge created
  const handleChallengeCreated = (newProblem: Problem) => {
    const updated = StorageService.getAllProblems();
    setAllProblems(updated);
    handleSelectProblem(newProblem);
  };

  // When file is loaded
  const handleCodeFileLoaded = (loadedCode: string, fileName: string) => {
    setCode(loadedCode);
    StorageService.saveDraft(selectedProblem.id, language, loadedCode);
    setActiveTab('workspace');
  };

  // Real Google Auth Handlers
  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    const updated = StorageService.updateUserProfile(
      user.displayName || user.email?.split('@')[0] || 'Developer',
      user.photoURL || '👨‍💻',
      'Verified Google Developer',
      user.uid,
      user.email,
      user.photoURL
    );
    setUserStats(updated);
  };

  const handleLogout = async () => {
    await logoutUser();
    setAuthUser(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/40">
      {/* Top Navigation Bar with Real Google Sign-In */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        authUser={authUser}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenUpload={() => setShowUploadModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col">
        {/* Tab 1: Problems Arena */}
        {activeTab === 'problems' && (
          <ProblemList
            problems={allProblems}
            onSelectProblem={handleSelectProblem}
            submissions={submissions}
            userStats={userStats}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenCreateModal={() => setActiveTab('create')}
          />
        )}

        {/* Tab 2: Interactive Problem Workspace & IDE */}
        {activeTab === 'workspace' && selectedProblem && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-64px)] overflow-hidden">
            {/* Left 5 Cols: Problem Description, Hints, Editorial, and Community Discussions */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <ProblemDescription
                problem={selectedProblem}
                submissions={submissions.filter(s => s.problemId === selectedProblem.id)}
                onOpenAiHelper={handleOpenAiAssistant}
                isBookmarked={bookmarks.includes(selectedProblem.id)}
                onToggleBookmark={() => handleToggleBookmark(selectedProblem.id)}
              />
            </div>

            {/* Right 7 Cols: Code Editor & Testcase Runner */}
            <div className="lg:col-span-7 h-full flex flex-col overflow-hidden bg-[#070b14]">
              <CodeEditor
                problem={selectedProblem}
                code={code}
                onChangeCode={handleCodeChange}
                language={language}
                onChangeLanguage={handleLanguageChange}
                onRunCode={handleRunCode}
                onSubmitCode={handleSubmitCode}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                onResetCode={handleResetCode}
              />

              <TestcaseRunner
                testcases={selectedProblem.testcases}
                executionResult={executionResult}
                isRunning={isRunning}
                onAddCustomTestCase={handleAddCustomTestCase}
                onDeleteCustomTestCase={handleDeleteCustomTestCase}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Timed Contest Arena */}
        {activeTab === 'contests' && (
          <ContestArena
            onSelectProblem={handleSelectProblem}
            problems={allProblems}
          />
        )}

        {/* Tab 4: Challenge Creator Wizard */}
        {activeTab === 'create' && (
          <ChallengeCreator
            onChallengeCreated={handleChallengeCreated}
            onCancel={() => setActiveTab('problems')}
          />
        )}

        {/* Tab 5: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView currentUser={userStats} />
        )}

        {/* Tab 6: User Profile & Heatmap */}
        {activeTab === 'profile' && (
          <ProfileView
            userStats={userStats}
            submissions={submissions}
            problems={allProblems}
            onSelectProblem={handleSelectProblem}
            onUpdateStats={() => setUserStats(StorageService.getUserStats())}
          />
        )}
      </main>

      {/* Real Google & Firebase Auth Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={authUser}
          onAuthSuccess={handleAuthSuccess}
          onLogout={handleLogout}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Verdict Celebration Modal */}
      {showVerdictModal && executionResult && (
        <VerdictModal
          problem={selectedProblem}
          result={executionResult}
          onClose={() => setShowVerdictModal(false)}
          onNextProblem={handleNextProblem}
        />
      )}

      {/* Pioneer AI Assistant Modal */}
      {showAiModal && (
        <AiAssistantModal
          problem={selectedProblem}
          code={code}
          language={language}
          initialMode={aiMode}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Quick Search Dialog (Ctrl+K) */}
      {showSearchModal && (
        <SearchModal
          problems={allProblems}
          onSelectProblem={handleSelectProblem}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {/* File & Solution Uploader Modal */}
      {showUploadModal && (
        <FileUploaderModal
          onLoadCode={handleCodeFileLoaded}
          onImportProblem={handleChallengeCreated}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

export default App;
