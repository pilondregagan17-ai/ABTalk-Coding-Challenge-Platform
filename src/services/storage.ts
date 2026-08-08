import type { Problem, Submission, UserStats, DiscussionPost } from '../types/index';
import { INITIAL_PROBLEMS } from '../data/problems';

const DRAFT_KEY_PREFIX = 'algopioneer_draft_';
const SUBMISSIONS_KEY = 'algopioneer_submissions';
const CUSTOM_PROBLEMS_KEY = 'algopioneer_custom_problems';
const USER_STATS_KEY = 'algopioneer_user_stats';
const BOOKMARKS_KEY = 'algopioneer_bookmarks';
const AUDIO_MUTED_KEY = 'algopioneer_audio_muted';
const DISCUSSIONS_KEY = 'algopioneer_discussions';

export interface ProblemMetrics {
  acceptanceRate: number;
  solvedByCount: number;
  totalSubmissions: number;
}

const INITIAL_USER_STATS: UserStats = {
  username: 'Developer',
  avatar: '👨‍💻',
  title: 'Pioneer Coder',
  rank: 1,
  streakDays: 0,
  maxStreak: 0,
  lastActiveDate: '',
  solvedCount: 0,
  easyCount: 0,
  mediumCount: 0,
  hardCount: 0,
  totalSubmissions: 0,
  acceptanceRate: 0,
  activityMap: {},
  bookmarks: [],
  points: 0,
  badges: [
    {
      id: 'first-ac',
      title: 'First Accepted',
      description: 'Solve your very first algorithm challenge.',
      icon: '🎯',
      unlocked: false,
      category: 'solved'
    },
    {
      id: 'streak-3',
      title: '3-Day Streak',
      description: 'Maintain a coding practice streak of 3 consecutive days.',
      icon: '🔥',
      unlocked: false,
      category: 'streak'
    },
    {
      id: 'streak-7',
      title: '7-Day Streak',
      description: 'Maintain a coding practice streak of 7 consecutive days.',
      icon: '⚡',
      unlocked: false,
      category: 'streak'
    },
    {
      id: 'two-pointers-master',
      title: 'Two Pointers Sage',
      description: 'Solve 3 Two Pointers problems.',
      icon: '🧠',
      unlocked: false,
      category: 'solved'
    },
    {
      id: 'contest-pioneer',
      title: 'Contest Pioneer',
      description: 'Participate and solve a challenge in a timed contest.',
      icon: '🏆',
      unlocked: false,
      category: 'contest'
    },
    {
      id: 'speed-demon',
      title: 'Sub-20ms Speed Demon',
      description: 'Submit an Accepted solution with execution under 20ms.',
      icon: '⏱️',
      unlocked: false,
      category: 'speed'
    },
    {
      id: 'custom-creator',
      title: 'Challenge Architect',
      description: 'Create and publish a custom coding challenge.',
      icon: '🛠️',
      unlocked: false,
      category: 'solved'
    }
  ]
};

export const StorageService = {
  // Code Drafts
  getDraft(problemId: string, language: string): string | null {
    try {
      return localStorage.getItem(`${DRAFT_KEY_PREFIX}${problemId}_${language}`);
    } catch {
      return null;
    }
  },

  saveDraft(problemId: string, language: string, code: string): void {
    try {
      localStorage.setItem(`${DRAFT_KEY_PREFIX}${problemId}_${language}`, code);
    } catch {}
  },

  // Submissions
  getSubmissions(): Submission[] {
    try {
      const data = localStorage.getItem(SUBMISSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSubmission(sub: Submission): void {
    try {
      const current = this.getSubmissions();
      const updated = [sub, ...current];
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));

      // Update User Stats dynamically
      if (sub.status === 'Accepted') {
        this.recordAcceptedSubmission(sub);
      } else {
        this.recordFailedSubmission();
      }
    } catch {}
  },

  // Real Dynamic Metrics per Question
  getProblemMetrics(problemId: string): ProblemMetrics {
    const submissions = this.getSubmissions().filter(s => s.problemId === problemId);
    if (submissions.length === 0) {
      return { acceptanceRate: 0, solvedByCount: 0, totalSubmissions: 0 };
    }
    const accepted = submissions.filter(s => s.status === 'Accepted');
    const rate = +((accepted.length / submissions.length) * 100).toFixed(1);
    return {
      acceptanceRate: rate,
      solvedByCount: accepted.length,
      totalSubmissions: submissions.length
    };
  },

  // Custom Problems created by user
  getCustomProblems(): Problem[] {
    try {
      const data = localStorage.getItem(CUSTOM_PROBLEMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomProblem(problem: Problem): void {
    try {
      const current = this.getCustomProblems();
      const updated = [problem, ...current.filter(p => p.id !== problem.id)];
      localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(updated));

      // Unlock badge dynamically
      this.unlockBadge('custom-creator');
    } catch {}
  },

  getAllProblems(): Problem[] {
    const custom = this.getCustomProblems();
    return [...custom, ...INITIAL_PROBLEMS];
  },

  // User Stats & Profile
  getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(USER_STATS_KEY);
      return data ? JSON.parse(data) : INITIAL_USER_STATS;
    } catch {
      return INITIAL_USER_STATS;
    }
  },

  saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    } catch {}
  },

  updateUserProfile(username: string, avatar: string, title?: string, uid?: string, email?: string, photoURL?: string): UserStats {
    const stats = this.getUserStats();
    stats.username = username.trim() || 'Developer';
    stats.avatar = avatar || '👨‍💻';
    if (title) stats.title = title;
    if (uid) stats.uid = uid;
    if (email) stats.email = email;
    if (photoURL) stats.photoURL = photoURL;
    this.saveUserStats(stats);
    return stats;
  },

  recordAcceptedSubmission(sub: Submission): void {
    const stats = this.getUserStats();
    const today = new Date().toISOString().split('T')[0];

    // Activity heatmap increment for today
    const currentDayCount = stats.activityMap[today] || 0;
    stats.activityMap[today] = currentDayCount + 1;

    // Calculate real consecutive streak
    if (stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (stats.lastActiveDate === yesterdayStr) {
        stats.streakDays += 1;
      } else {
        stats.streakDays = 1;
      }
      stats.maxStreak = Math.max(stats.maxStreak, stats.streakDays);
      stats.lastActiveDate = today;
    }

    // Check if this problem was already solved
    const submissions = this.getSubmissions();
    const priorSolved = submissions.some(
      s => s.problemId === sub.problemId && s.id !== sub.id && s.status === 'Accepted'
    );

    if (!priorSolved) {
      stats.solvedCount += 1;
      if (sub.difficulty === 'Easy') stats.easyCount += 1;
      else if (sub.difficulty === 'Medium') stats.mediumCount += 1;
      else if (sub.difficulty === 'Hard') stats.hardCount += 1;
      
      const earnedXp = sub.difficulty === 'Hard' ? 100 : sub.difficulty === 'Medium' ? 50 : 25;
      stats.points += earnedXp;

      // Update Pioneer rank
      stats.rank = Math.max(1, 2000 - Math.floor(stats.points / 15));
    }

    stats.totalSubmissions += 1;
    const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
    stats.acceptanceRate = +( (acceptedCount / stats.totalSubmissions) * 100 ).toFixed(1);

    // Check & unlock badges based on real achievements
    if (stats.solvedCount >= 1) this.unlockBadgeDirect(stats, 'first-ac');
    if (stats.streakDays >= 3) this.unlockBadgeDirect(stats, 'streak-3');
    if (stats.streakDays >= 7) this.unlockBadgeDirect(stats, 'streak-7');
    if (sub.runtimeMs > 0 && sub.runtimeMs < 20) this.unlockBadgeDirect(stats, 'speed-demon');

    this.saveUserStats(stats);
  },

  recordFailedSubmission(): void {
    const stats = this.getUserStats();
    const today = new Date().toISOString().split('T')[0];
    stats.activityMap[today] = (stats.activityMap[today] || 0) + 1;
    stats.totalSubmissions += 1;
    
    const submissions = this.getSubmissions();
    const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
    stats.acceptanceRate = +( (acceptedCount / stats.totalSubmissions) * 100 ).toFixed(1);
    
    this.saveUserStats(stats);
  },

  unlockBadge(badgeId: string): void {
    const stats = this.getUserStats();
    this.unlockBadgeDirect(stats, badgeId);
    this.saveUserStats(stats);
  },

  unlockBadgeDirect(stats: UserStats, badgeId: string): void {
    const badge = stats.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = new Date().toISOString().split('T')[0];
      stats.points += 100;
    }
  },

  // Discussions
  getDiscussions(problemId?: string): DiscussionPost[] {
    try {
      const data = localStorage.getItem(DISCUSSIONS_KEY);
      const list: DiscussionPost[] = data ? JSON.parse(data) : [];
      if (problemId) {
        return list.filter(d => d.problemId === problemId);
      }
      return list;
    } catch {
      return [];
    }
  },

  saveDiscussion(post: DiscussionPost): void {
    try {
      const current = this.getDiscussions();
      const updated = [post, ...current.filter(p => p.id !== post.id)];
      localStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(updated));
    } catch {}
  },

  // Bookmarks
  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(problemId: string): boolean {
    const bookmarks = this.getBookmarks();
    const isBookmarked = bookmarks.includes(problemId);
    const updated = isBookmarked ? bookmarks.filter(id => id !== problemId) : [...bookmarks, problemId];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch {}
    return !isBookmarked;
  },

  // Audio Preference
  isAudioMuted(): boolean {
    try {
      return localStorage.getItem(AUDIO_MUTED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setAudioMuted(muted: boolean): void {
    try {
      localStorage.setItem(AUDIO_MUTED_KEY, String(muted));
    } catch {}
  },

  // Reset all user data for fresh start
  resetAllUserData(): void {
    try {
      localStorage.removeItem(SUBMISSIONS_KEY);
      localStorage.removeItem(CUSTOM_PROBLEMS_KEY);
      localStorage.removeItem(USER_STATS_KEY);
      localStorage.removeItem(BOOKMARKS_KEY);
      localStorage.removeItem(DISCUSSIONS_KEY);
    } catch {}
  }
};
