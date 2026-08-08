import type { Contest } from '../types/index';

export const MOCK_CONTESTS: Contest[] = [
  {
    id: 'pioneer-weekly-1',
    title: 'AlgoPioneers Weekly Contest #1',
    badge: 'Rated • Official',
    description: 'Weekly algorithmic showcase featuring 4 algorithmic challenges of increasing difficulty. Real-time ranking with penalty time.',
    startTime: Date.now() + 1000 * 60 * 60 * 24 * 2, // In 2 days
    durationMinutes: 90,
    problemIds: ['two-sum', 'valid-palindrome', 'container-with-most-water', 'trapping-rain-water'],
    participantsCount: 1,
    status: 'Live',
    leaderboard: []
  },
  {
    id: 'biweekly-speedrun-1',
    title: 'Biweekly Speedrun Arena #1',
    badge: 'Fast & Furious',
    description: 'High-octane sprint focusing on rapid problem-solving speed, clean edge-case handling, and runtime optimization.',
    startTime: Date.now() + 1000 * 60 * 60 * 72,
    durationMinutes: 60,
    problemIds: ['valid-parentheses', 'longest-substring-without-repeating-characters', 'coin-change'],
    participantsCount: 1,
    status: 'Upcoming',
    leaderboard: []
  },
  {
    id: 'pioneers-hiring-sprint',
    title: 'Pioneers Global Algorithm Sprint',
    badge: 'Industry Spotlight',
    description: 'Premier coding challenge featuring classic interview algorithms across Two Pointers, Linked Lists, and Dynamic Programming.',
    startTime: Date.now() - 1000 * 60 * 60 * 48,
    durationMinutes: 120,
    problemIds: ['two-sum', '3sum', 'trapping-rain-water', 'merge-k-sorted-lists'],
    participantsCount: 1,
    status: 'Ended',
    leaderboard: []
  }
];
