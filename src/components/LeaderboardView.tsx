import React, { useState, useEffect } from 'react';
import { Trophy, Users, Award, Flame } from 'lucide-react';
import type { UserStats } from '../types/index';
import { FirestoreService } from '../services/firestore';

interface LeaderboardViewProps {
  currentUser: UserStats;
}

/** Renders avatar - handles Google photo URLs and emoji icons */
function Avatar({ src, size = 'md' }: { src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-20 h-20 text-4xl' : size === 'md' ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-lg';
  const isUrl = src && (src.startsWith('http') || src.startsWith('data:'));

  if (isUrl) {
    return (
      <img
        src={src}
        alt="Avatar"
        className={`${sizeClasses} rounded-2xl object-cover border border-slate-700 shadow-lg`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className={`${sizeClasses} rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg text-slate-200`}>
      {src || '👨‍💻'}
    </div>
  );
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const [cloudUsers, setCloudUsers] = useState<UserStats[]>([]);

  useEffect(() => {
    FirestoreService.getGlobalLeaderboard().then(users => {
      if (users.length > 0) {
        setCloudUsers(users);
      }
    });
  }, []);

  // Merge real cloud users with current local active user (deduplicating by uid/username)
  const allUsersMap = new Map<string, UserStats>();

  // Add current active user
  const currentKey = currentUser.uid || currentUser.username;
  allUsersMap.set(currentKey, currentUser);

  // Add any other cloud users
  cloudUsers.forEach(u => {
    const key = u.uid || u.username;
    if (!allUsersMap.has(key)) {
      allUsersMap.set(key, u);
    }
  });

  const participants = Array.from(allUsersMap.values())
    .map(u => ({
      name: u.username,
      avatar: u.avatar,
      rating: 1200 + (u.points || 0),
      solved: u.solvedCount || 0,
      streak: u.streakDays || 0,
      badge: u.title || 'Pioneer Coder',
      isUser: (u.uid && u.uid === currentUser.uid) || u.username === currentUser.username
    }))
    .sort((a, b) => b.rating - a.rating || b.solved - a.solved)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const topUser = participants[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-modal">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Real-Time Rankings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Pioneer Hall of Fame
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto">
          Rankings are calculated 100% dynamically from real user submissions and verified solves.
        </p>
      </div>

      {/* Top 1 Champion Podium */}
      {topUser && topUser.solved > 0 && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-[#0e1628] to-[#090d16] border border-amber-500/40 flex flex-col items-center text-center space-y-4 shadow-2xl relative">
          <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
            #1 Leader 👑
          </div>
          <Avatar src={topUser.avatar} size="lg" />
          <div>
            <h3 className="font-extrabold text-white text-xl flex items-center justify-center gap-2">
              <span>{topUser.name}</span>
              {topUser.isUser && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                  YOU
                </span>
              )}
            </h3>
            <p className="text-sm text-amber-400 font-mono font-bold">{topUser.rating} Rating</p>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            {topUser.solved} Solved • {topUser.streak}d Streak 🔥
          </div>
        </div>
      )}

      {/* Standings Table */}
      <div className="rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Rank & Developer</span>
          <span>Rating / Solved</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {participants.map((leader) => (
            <div
              key={leader.name}
              className={`p-4 flex items-center justify-between transition-colors ${
                leader.isUser ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono font-bold text-sm text-amber-400 text-center">
                  #{leader.rank}
                </span>
                <Avatar src={leader.avatar} size="sm" />
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{leader.name}</span>
                    {leader.isUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{leader.badge}</div>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-mono font-bold text-indigo-400 text-sm">
                  {leader.rating}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {leader.solved} solved • {leader.streak}d 🔥
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
