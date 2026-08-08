import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User as FirebaseUser,
  type Auth 
} from 'firebase/auth';
import type { AuthUser } from '../types/index';

const FIREBASE_CONFIG_KEY = 'algopioneer_firebase_config';
const AUTH_USER_KEY = 'algopioneer_auth_user';

// Firebase client configuration for ABTalk Coding Challenge Platform
// Note: Firebase API Keys are public client identifiers used by the browser SDK to identify the project on Google servers.
// Backend security is enforced via Firebase Security Rules and Authorized Domains in the Firebase Console.
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLC9XnyRBoHGQ22Gx1qeOvfBK5WQWHr14",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "abtalk-coding-challengplatform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "abtalk-coding-challengplatform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "abtalk-coding-challengplatform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "846312613985",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:846312613985:web:aef8db0aaef55102bb6220",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZTPEY9LHRP"
};

export function getSavedFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey) return parsed;
    }
  } catch {}
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveCustomFirebaseConfig(config: typeof DEFAULT_FIREBASE_CONFIG): void {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    appInstance = null;
    authInstance = null;
  } catch {}
}

export function clearFirebaseConfig(): void {
  try {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    appInstance = null;
    authInstance = null;
    notifyAuthSubscribers(null);
  } catch {}
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

// Auth subscriber registry for synchronized updates
type AuthSubscriber = (user: AuthUser | null) => void;
const subscribers: Set<AuthSubscriber> = new Set();

function notifyAuthSubscribers(user: AuthUser | null) {
  subscribers.forEach(cb => {
    try {
      cb(user);
    } catch (err) {
      console.warn('Auth notification error:', err);
    }
  });
}

export function getFirebaseApp(): FirebaseApp | null {
  try {
    if (!appInstance) {
      const config = getSavedFirebaseConfig();
      appInstance = getApps().length > 0 ? getApp() : initializeApp(config);
    }
    return appInstance;
  } catch (err) {
    console.warn('Firebase app initialization note:', err);
    try {
      return getApps().length > 0 ? getApp() : null;
    } catch {
      return null;
    }
  }
}

export function getFirebaseAuth(): Auth | null {
  try {
    if (!authInstance) {
      const app = getFirebaseApp();
      if (app) {
        authInstance = getAuth(app);
      }
    }
    return authInstance;
  } catch (err) {
    console.warn('Firebase auth initialization note:', err);
    return null;
  }
}

export const googleProvider = new GoogleAuthProvider();
try {
  googleProvider.setCustomParameters({ 
    prompt: 'select_account' 
  });
} catch {}

/**
 * Instant Local & Demo Sign-In (100% works without Firebase domain restrictions)
 */
export function signInInstantly(username: string, avatar: string = '👨‍💻', customEmail?: string): AuthUser {
  const safeName = username.trim() || 'Pioneer Coder';
  const slug = safeName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const authUser: AuthUser = {
    uid: `local_${slug}_${Date.now().toString(36)}`,
    displayName: safeName,
    email: customEmail || `${slug || 'developer'}@pioneer.dev`,
    photoURL: (avatar.startsWith('http') || avatar.startsWith('data:')) ? avatar : null,
    isAnonymous: false,
    providerId: 'instant-local'
  };

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  } catch {}

  notifyAuthSubscribers(authUser);
  return authUser;
}

/**
 * Real Google Sign-In via Firebase Authentication Popup
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please verify internet connection or use Instant Sign-In.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const authUser: AuthUser = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Google Developer',
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    providerId: 'google.com'
  };

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  } catch {}

  notifyAuthSubscribers(authUser);
  return authUser;
}

/**
 * Sign Out (Firebase + Local Storage)
 */
export async function logoutUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      await fbSignOut(auth);
    }
  } catch {}

  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {}

  notifyAuthSubscribers(null);
}

/**
 * Get the currently cached user from storage
 */
export function getCurrentCachedUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Subscribes to Real Firebase Auth Changes & Local Instant Logins safely
 */
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  subscribers.add(callback);

  // Initial trigger with cached user
  const cached = getCurrentCachedUser();
  if (cached) {
    try {
      callback(cached);
    } catch {}
  }

  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return () => {
        subscribers.delete(callback);
      };
    }

    const unsubFirebase = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Google Developer',
          email: user.email,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          providerId: 'google.com'
        };
        try {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        } catch {}
        callback(authUser);
      } else {
        // If not in Firebase auth, check if an instant local user is logged in
        const localCached = getCurrentCachedUser();
        if (localCached && localCached.providerId === 'instant-local') {
          callback(localCached);
        } else {
          callback(null);
        }
      }
    });

    return () => {
      subscribers.delete(callback);
      try {
        unsubFirebase();
      } catch {}
    };
  } catch (err) {
    console.warn('Auth state change subscription fallback:', err);
    return () => {
      subscribers.delete(callback);
    };
  }
}

