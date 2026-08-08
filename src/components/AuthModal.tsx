import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Settings, 
  Cloud, 
  Flame, 
  ShieldCheck, 
  LogOut,
  AlertCircle,
  ExternalLink,
  ClipboardPaste,
  Key
} from 'lucide-react';
import type { AuthUser } from '../types/index';
import { 
  signInWithGoogle, 
  logoutUser,
  getSavedFirebaseConfig, 
  saveCustomFirebaseConfig, 
  DEFAULT_FIREBASE_CONFIG
} from '../services/firebase';

interface AuthModalProps {
  currentUser: AuthUser | null;
  onAuthSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onAuthSuccess,
  onLogout,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'setup'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Configuration Form State
  const [apiKey, setApiKey] = useState(DEFAULT_FIREBASE_CONFIG.apiKey);
  const [authDomain, setAuthDomain] = useState(DEFAULT_FIREBASE_CONFIG.authDomain);
  const [projectId, setProjectId] = useState(DEFAULT_FIREBASE_CONFIG.projectId);
  const [appId, setAppId] = useState(DEFAULT_FIREBASE_CONFIG.appId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google popup was closed before completing. Click again to sign in.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMessage('Domain unauthorized in Firebase Console. In your Firebase Console > Authentication > Settings > Authorized domains, ensure "localhost" is listed.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMessage('Google Sign-in is not enabled in Firebase Console. Please go to Authentication > Sign-in method > Google and click Enable.');
      } else {
        setErrorMessage(err.message || 'Error communicating with Google Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: `${projectId.trim()}.firebasestorage.app`,
      messagingSenderId: '846312613985',
      appId: appId.trim(),
      measurementId: 'G-ZTPEY9LHRP'
    };

    saveCustomFirebaseConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('signin');
    }, 1200);
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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-[#0e1628] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 animate-modal relative overflow-hidden cursor-default"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Google & Firebase Auth</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </h2>
              <p className="text-xs text-slate-400">Project: <code>abtalk-coding-challengplatform</code></p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('signin')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'signin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Sign-In
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'setup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Firebase Project Settings</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-rose-300">Firebase Alert</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Tab 1: Google Sign-In */}
        {activeTab === 'signin' && (
          <div className="space-y-6">
            {currentUser ? (
              <div className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-14 h-14 rounded-2xl border-2 border-indigo-500/40 bg-slate-900 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span>{currentUser.displayName}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Authenticated Google Account" />
                    </div>
                    <div className="text-xs text-slate-300 font-mono">{currentUser.email}</div>
                    <div className="text-[10px] text-slate-500 font-mono">UID: {currentUser.uid}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-indigo-400" />
                    <span>Cloud Sync Active</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Streak Cloud Backup</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Official Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {/* Official Google Logo */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{loading ? 'Opening Google Sign-In Popup...' : 'Sign In with Google'}</span>
                </button>

                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200">Real Google Sign-In features:</div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real Google account profile name, avatar picture, and verified email</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cloud synchronization of your code solutions & practice drafts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Leaderboard ranking tied to your authenticated Firebase UID</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Firebase Project Settings */}
        {activeTab === 'setup' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">Firebase API Key</label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Project ID</label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Firebase credentials updated!</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950 cursor-pointer"
              >
                Save Firebase Project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
