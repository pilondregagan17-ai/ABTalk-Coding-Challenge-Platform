import React, { useState } from 'react';
import { 
  Code2, 
  Trophy, 
  Flame, 
  PlusCircle, 
  Upload, 
  Volume2, 
  VolumeX, 
  Search, 
  User, 
  Terminal, 
  Sparkles,
  Award,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { StorageService } from '../services/storage';
import type { UserStats, AuthUser } from '../types/index';

interface NavbarProps {
  activeTab: 'problems' | 'workspace' | 'contests' | 'create' | 'leaderboard' | 'profile';
  setActiveTab: (tab: 'problems' | 'workspace' | 'contests' | 'create' | 'leaderboard' | 'profile') => void;
  userStats: UserStats;
  authUser: AuthUser | null;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  authUser,
  onOpenSearch,
  onOpenUpload,
  onOpenAuth,
  onLogout
}) => {
  const [isMuted, setIsMuted] = useState(StorageService.isAudioMuted());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    StorageService.setAudioMuted(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('problems')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  AlgoPioneers
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AB Talk
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">CodeGuys Practice & Arena</p>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('problems')}
              title="Problems List (Alt+1)"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'problems' || activeTab === 'workspace'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
            </button>

            <button
              onClick={() => setActiveTab('contests')}
              title="Contest Arena (Alt+3)"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                activeTab === 'contests'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Contests</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              title="Create Custom Challenge (Alt+6)"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Create Challenge</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              title="Hall of Fame Leaderboard (Alt+4)"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Leaderboard</span>
            </button>
          </nav>
        </div>

        {/* Right Action Icons, Profile & Google Auth */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 text-xs transition-all shadow-inner"
            title="Search Problems (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search problems...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
              {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl+'}K
            </kbd>
          </button>

          {/* Upload Solution / Package */}
          <button
            onClick={onOpenUpload}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 text-xs font-medium transition-all"
            title="Upload Solution / Import Problem Package (Ctrl+U)"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload</span>
            <kbd className="px-1 py-0.2 bg-slate-900 rounded text-[9px] text-slate-400 border border-slate-800">
              ^U
            </kbd>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-indigo-950/40 border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/50'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Daily Streak Flame */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shadow-sm cursor-pointer hover:bg-amber-500/15 transition-all"
            title={`${userStats.streakDays} Day Coding Streak!`}
            onClick={() => setActiveTab('profile')}
          >
            <Flame className={`w-4 h-4 ${userStats.streakDays > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-600'}`} />
            <span>{userStats.streakDays}d</span>
          </div>

          {/* Google Auth Button or User Profile Dropdown */}
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border transition-all ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {authUser.photoURL ? (
                  <img 
                    src={authUser.photoURL} 
                    alt={authUser.displayName || 'User'} 
                    className="w-6 h-6 rounded-lg object-cover border border-indigo-500/30"
                  />
                ) : (
                  <span className="text-sm">{userStats.avatar}</span>
                )}
                <span className="text-xs font-semibold hidden lg:inline max-w-[100px] truncate">
                  {authUser.displayName || userStats.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-2 z-50 space-y-1 animate-modal">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white truncate">{authUser.displayName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{authUser.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800/60 flex items-center gap-2 transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Profile & Heatmap</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuth();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800/60 flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Firebase Cloud Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {/* Google 4-Color Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
