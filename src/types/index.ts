export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'Arrays & Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack & Queue'
  | 'Binary Search'
  | 'Linked List'
  | 'Trees & Graphs'
  | 'Dynamic Programming'
  | 'Backtracking'
  | 'Greedy'
  | 'Bit Manipulation'
  | 'Math & Geometry'
  | 'System Design & Strings';

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'cpp' | 'java';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
  isCustom?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: Category;
  acceptanceRate: number; // e.g. 84.5%
  solvedByCount: number;
  companies: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  solutionTemplate: Record<SupportedLanguage, string>;
  testcases: TestCase[];
  hints: string[];
  editorial: {
    approach: string;
    intuition: string;
    complexity: {
      time: string;
      space: string;
    };
    codeSolution: Record<SupportedLanguage, string>;
  };
  author?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface TestResultItem {
  id: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  logs: string[];
  error?: string;
  executionTimeMs: number;
  isHidden?: boolean;
}

export type VerdictStatus = 
  | 'Accepted' 
  | 'Wrong Answer' 
  | 'Time Limit Exceeded' 
  | 'Runtime Error' 
  | 'Compilation Error'
  | 'Idle'
  | 'Running';

export interface ExecutionResult {
  status: VerdictStatus;
  runtimeMs: number;
  memoryMB: number;
  passedCount: number;
  totalCount: number;
  testResults: TestResultItem[];
  errorSummary?: string;
  stdoutLogs: string[];
  runtimePercentile?: number;
  memoryPercentile?: number;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: SupportedLanguage;
  code: string;
  status: VerdictStatus;
  runtimeMs: number;
  memoryMB: number;
  passedCount: number;
  totalCount: number;
  timestamp: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'solved' | 'contest' | 'speed';
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  providerId?: string;
}

export interface UserStats {
  uid?: string;
  email?: string;
  username: string;
  avatar: string;
  photoURL?: string;
  title: string;
  rank: number;
  streakDays: number;
  maxStreak: number;
  lastActiveDate: string;
  solvedCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  totalSubmissions: number;
  acceptanceRate: number;
  activityMap: Record<string, number>; // date 'YYYY-MM-DD' -> count
  bookmarks: string[]; // problem IDs
  points: number;
  badges: Badge[];
}

export interface ContestParticipant {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  penaltyTimeMinutes: number;
  solvedProblems: string[]; // problem IDs
  country: string;
  isCurrentUser?: boolean;
}

export interface Contest {
  id: string;
  title: string;
  badge: string;
  description: string;
  startTime: number; // timestamp
  durationMinutes: number;
  problemIds: string[];
  participantsCount: number;
  status: 'Upcoming' | 'Live' | 'Ended';
  leaderboard: ContestParticipant[];
}

export interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface DiscussionPost {
  id: string;
  problemId: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  comments: DiscussionComment[];
}

export const PLATFORM_VERSION = '2.5.0';
