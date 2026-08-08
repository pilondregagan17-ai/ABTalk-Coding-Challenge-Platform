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
  Zap,
  User,
  Info,
  ChevronDown,
  ChevronUp,
  Globe,
  HelpCircle,
  Check
} from 'lucide-react';
import type { AuthUser } from '../types/index';
import { 
  signInWithGoogle, 
  signInInstantly,
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

const PRESET_PERSONAS = [
  {
    name: 'Alex Rivers',
    avatar: '👨‍💻',
    title: 'FullStack Pioneer',
    tag: 'Recommended'
  },
  {
    name: 'Elena Rostova',
    avatar: '👩‍💻',
    title: 'Algorithms Sage',
    tag: 'DSA Master'
  },
  {
    name: 'Kai Tanaka',
    avatar: '⚡',
    title: 'Sub-20ms Speed Coder',
    tag: 'Fast Runner'
  },
  {
    name: 'Shadow Samurai',
    avatar: '🥷',
    title: 'Competitive Prodigy',
    tag: 'Arena Champ'
  }
];

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '🚀', '⚡', '🥷', '🧙‍♂️', '🤖', '👑', '🔥', '🛡️'];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onAuthSuccess,
  onLogout,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'google' | 'info'>('instant');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'unauthorized-domain' | 'popup-closed' | 'other' | null>(null);

  // Custom instant sign in form state
  const [customName, setCustomName] = useState('Pioneer Coder');
  const [customAvatar, setCustomAvatar] = useState('👨‍💻');
  const [customTitle, setCustomTitle] = useState('Pioneer Coder');

  // Advanced developer settings collapsible
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [apiKey, setApiKey] = useState(DEFAULT_FIREBASE_CONFIG.apiKey);
  const [authDomain, setAuthDomain] = useState(DEFAULT_FIREBASE_CONFIG.authDomain);
  const [projectId, setProjectId] = useState(DEFAULT_FIREBASE_CONFIG.projectId);
  const [appId, setAppId] = useState(DEFAULT_FIREBASE_CONFIG.appId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1-Click Instant Sign-In Handler
  const handleInstantSignIn = (name: string, avatar: string, title?: string) => {
    const user = signInInstantly(name, avatar);
    onAuthSuccess(user);
    onClose();
  };

  // Google OAuth Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setErrorType(null);
    try {
      const user = await signInWithGoogle();
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorType('popup-closed');
        setErrorMessage('Google popup was closed before completing. Click again or use Instant Sign-In.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorType('unauthorized-domain');
        setErrorMessage('Domain unauthorized in Firebase Console. Google requires "localhost" or your current domain to be added in Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorType('other');
        setErrorMessage('Google Sign-in is not enabled in Firebase Console. Please go to Authentication > Sign-in method > Google and click Enable.');
      } else {
        setErrorType('other');
        setErrorMessage(err.message || 'Error communicating with Google Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save Custom Firebase Project Config (Optional Developer feature)
  const handleSaveDevConfig = (e: React.FormEvent) => {
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
      setShowDevSettings(false);
    }, 1200);
  };

  // Global Escape key listener to close modal
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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-[#0e1628] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5 animate-modal relative overflow-hidden cursor-default my-8"
      >
        {/* Glow ambient background highlights */}
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
                <span>AlgoPioneers Auth</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {currentUser ? 'Logged In' : 'Instant Ready'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Save code drafts, track streak & join the arena</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-all"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* If user is already logged in, show current profile card */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-14 h-14 rounded-2xl border-2 border-indigo-500/40 bg-slate-900 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-3xl shadow-lg">
                    {currentUser.displayName ? '👨‍💻' : '👤'}
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>{currentUser.displayName || 'Pioneer Coder'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Session" />
                  </div>
                  <div className="text-xs text-slate-300 font-mono">{currentUser.email || 'local-developer@pioneer.dev'}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Provider: {currentUser.providerId === 'google.com' ? 'Google OAuth' : 'Instant Local'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-indigo-400" />
                  <span>Cloud Sync Active</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Streak Tracking On</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setActiveTab('instant');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch Profile</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs">
              <button
                onClick={() => setActiveTab('instant')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'instant'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Sign-In</span>
              </button>

              <button
                onClick={() => setActiveTab('google')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'google'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Sign-In</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Security & Storage Info</span>
              </button>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-semibold text-rose-300">Firebase Notice</div>
                    <div>{errorMessage}</div>
                  </div>
                </div>

                {/* Direct 1-Click Fallback Button so user is never blocked */}
                {errorType === 'unauthorized-domain' && (
                  <div className="pt-2 border-t border-rose-800/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-rose-300">Bypass setup & start coding immediately:</span>
                    <button
                      onClick={() => handleInstantSignIn('Pioneer Coder', '👨‍💻')}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Continue with Instant Sign-In</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 1: Instant 1-Click Sign-In (Recommended) */}
            {activeTab === 'instant' && (
              <div className="space-y-5">
                {/* Preset Persona Quick Login Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Choose a Coder Persona (1-Click Login):</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Instant • Zero Configuration</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRESET_PERSONAS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => handleInstantSignIn(p.name, p.avatar, p.title)}
                        className="p-3 rounded-2xl bg-[#090d16] hover:bg-[#11192d] border border-slate-800 hover:border-indigo-500/60 flex items-center gap-3 text-left transition-all group cursor-pointer shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:scale-105 border border-slate-800 group-hover:border-indigo-500/40 flex items-center justify-center text-xl transition-transform">
                          {p.avatar}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{p.title}</div>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                          {p.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Profile Creator */}
                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3.5">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Or Custom Handle & Avatar</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] text-slate-400">Username / Handle</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter your nickname..."
                        className="w-full rounded-xl bg-[#070b14] border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full rounded-xl bg-[#070b14] border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400">Pick Avatar Emoji</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setCustomAvatar(av)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all cursor-pointer ${
                            customAvatar === av
                              ? 'bg-indigo-600 border border-indigo-400 scale-110 shadow-md'
                              : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleInstantSignIn(customName, customAvatar, customTitle)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Sign In Instantly as {customName || 'Pioneer Coder'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Real Google Sign-In */}
            {activeTab === 'google' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sign in with your Google account to automatically link your profile name, Google photo, and sync solutions with Cloud Firestore.
                  </p>

                  {/* Official Google Sign-In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {/* Official Google 4-Color Logo */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{loading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
                  </button>
                </div>

                {/* Google Sign-in Features */}
                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Included with Google Sign-In:</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real Google account profile name, avatar picture, and verified email</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cloud synchronization of your code solutions & practice drafts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Leaderboard ranking tied to your authenticated Google UID</span>
                  </div>
                </div>

                {/* Domain authorization notice */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Note on Domain Authorization</span>
                  </div>
                  <p>
                    Google OAuth popups require the hosting domain (e.g. <code>localhost</code>) to be in your Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains. If you are developing locally without console access, use <strong>Instant Sign-In</strong> above!
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Security, Privacy & Firebase FAQ */}
            {activeTab === 'info' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Why are Firebase keys in frontend web apps?</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    In Firebase Web applications, the <code>apiKey</code>, <code>projectId</code>, and <code>appId</code> are <strong>public client identifiers</strong>. They tell Google's SDK which cloud project to route requests to. Unlike backend server passwords, Firebase client API keys are designed by Google to be sent to browsers.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Security Rules:</strong> Real database security is strictly enforced on Google's cloud servers via Firestore & Storage Rules.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Domain Whitelist:</strong> OAuth sign-in popups are restricted only to authorized domains (e.g. your verified domain or localhost).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Local Privacy:</strong> Code drafts and practice submissions are stored locally in your browser's private storage.</span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Advanced Developer Project Config */}
                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowDevSettings(!showDevSettings)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Advanced Developer Firebase Settings</span>
                    </div>
                    {showDevSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showDevSettings && (
                    <form onSubmit={handleSaveDevConfig} className="space-y-3 pt-2 border-t border-slate-800 text-[11px]">
                      <p className="text-slate-400">
                        You can override default Firebase credentials or supply your own project via <code>.env</code> variables or the fields below:
                      </p>

                      <div className="space-y-1">
                        <label className="block font-semibold text-slate-300">Firebase API Key</label>
                        <input
                          type="text"
                          required
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2 font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block font-semibold text-slate-300">Project ID</label>
                          <input
                            type="text"
                            required
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2 font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block font-semibold text-slate-300">Auth Domain</label>
                          <input
                            type="text"
                            value={authDomain}
                            onChange={(e) => setAuthDomain(e.target.value)}
                            className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2 font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-slate-300">App ID</label>
                        <input
                          type="text"
                          value={appId}
                          onChange={(e) => setAppId(e.target.value)}
                          className="w-full rounded-xl bg-[#070b14] border border-slate-700 p-2 font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {savedSuccess && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Credentials updated!</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
                        >
                          Update Custom Firebase Config
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
