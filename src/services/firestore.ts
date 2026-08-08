import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  limit, 
  serverTimestamp,
  increment,
  type Firestore 
} from 'firebase/firestore';
import { getFirebaseApp } from './firebase';
import type { Submission, UserStats, DiscussionPost } from '../types/index';
import { StorageService } from './storage';

let dbInstance: Firestore | null = null;

export function getFirestoreDB(): Firestore | null {
  try {
    if (!dbInstance) {
      const app = getFirebaseApp();
      if (app) {
        dbInstance = getFirestore(app);
      }
    }
    return dbInstance;
  } catch (err) {
    console.warn('Cloud Firestore initialization note:', err);
    return null;
  }
}

export const FirestoreService = {
  /**
   * Syncs real user submission to Cloud Firestore
   */
  async syncSubmission(sub: Submission, userStats?: UserStats): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      // 1. Write to 'submissions' collection
      const submissionsRef = collection(db, 'submissions');
      await addDoc(submissionsRef, {
        id: sub.id,
        problemId: sub.problemId,
        problemTitle: sub.problemTitle,
        difficulty: sub.difficulty,
        language: sub.language,
        code: sub.code,
        status: sub.status,
        runtimeMs: sub.runtimeMs,
        memoryMB: sub.memoryMB,
        passedCount: sub.passedCount,
        totalCount: sub.totalCount,
        timestamp: sub.timestamp,
        userId: userStats?.uid || 'guest-developer',
        username: userStats?.username || 'Pioneer Coder',
        createdAt: serverTimestamp()
      });

      // 2. Sync User Stats Document
      if (userStats) {
        const userDocRef = doc(db, 'users', userStats.uid || userStats.username);
        await setDoc(userDocRef, {
          username: userStats.username,
          avatar: userStats.avatar,
          title: userStats.title,
          solvedCount: userStats.solvedCount,
          easyCount: userStats.easyCount,
          mediumCount: userStats.mediumCount,
          hardCount: userStats.hardCount,
          points: userStats.points,
          streakDays: userStats.streakDays,
          maxStreak: userStats.maxStreak,
          lastActiveDate: userStats.lastActiveDate,
          totalSubmissions: userStats.totalSubmissions,
          activityMap: userStats.activityMap,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      // 3. Atomic Problem Stats Update
      const problemDocRef = doc(db, 'problem_stats', sub.problemId);
      await setDoc(problemDocRef, {
        problemId: sub.problemId,
        totalSubmissions: increment(1),
        acceptedCount: increment(sub.status === 'Accepted' ? 1 : 0),
        lastRuntimeMs: sub.runtimeMs,
        lastMemoryMB: sub.memoryMB,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Cloud Firestore auto-sync completed locally (network/rules):', err);
    }
  },

  /**
   * Loads historical submissions from Cloud Firestore for a problem to compute real percentiles
   */
  async getProblemCloudSubmissions(problemId: string): Promise<Submission[]> {
    const db = getFirestoreDB();
    if (!db) return StorageService.getSubmissions().filter(s => s.problemId === problemId);

    try {
      const q = query(
        collection(db, 'submissions'),
        where('problemId', '==', problemId),
        where('status', '==', 'Accepted'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const cloudSubs: Submission[] = [];
      snapshot.forEach(d => {
        cloudSubs.push(d.data() as Submission);
      });

      if (cloudSubs.length > 0) return cloudSubs;
    } catch (err) {
      console.warn('Firestore fetch fallback:', err);
    }

    return StorageService.getSubmissions().filter(s => s.problemId === problemId && s.status === 'Accepted');
  },

  /**
   * Syncs community discussion posts to Firestore
   */
  async saveDiscussionToCloud(post: DiscussionPost): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      const postRef = doc(db, 'discussions', post.id);
      await setDoc(postRef, {
        ...post,
        syncedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Discussion Cloud Sync fallback:', err);
    }
  },

  /**
   * Loads real users from Cloud Firestore for the live leaderboard
   */
  async getGlobalLeaderboard(): Promise<UserStats[]> {
    const db = getFirestoreDB();
    if (!db) return [];

    try {
      const q = query(collection(db, 'users'), limit(50));
      const snapshot = await getDocs(q);
      const users: UserStats[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        users.push({
          uid: docSnap.id,
          username: data.username || 'Pioneer Coder',
          avatar: data.avatar || '👨‍💻',
          photoURL: data.photoURL,
          title: data.title || 'Pioneer Coder',
          rank: 1,
          streakDays: data.streakDays || 0,
          maxStreak: data.maxStreak || 0,
          lastActiveDate: data.lastActiveDate || '',
          solvedCount: data.solvedCount || 0,
          easyCount: data.easyCount || 0,
          mediumCount: data.mediumCount || 0,
          hardCount: data.hardCount || 0,
          totalSubmissions: data.totalSubmissions || 0,
          acceptanceRate: data.acceptanceRate || 0,
          activityMap: data.activityMap || {},
          bookmarks: data.bookmarks || [],
          points: data.points || 0,
          badges: data.badges || []
        });
      });
      return users;
    } catch (err) {
      console.warn('Leaderboard Cloud fetch fallback:', err);
      return [];
    }
  }
};
