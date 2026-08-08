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

// Real Firebase credentials for ABTalkCoding Challenge Website
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
    localStorage.removeItem('algopioneer_auth_user');
    appInstance = null;
    authInstance = null;
  } catch {}
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  try {
    if (!appInstance) {
      const config = getSavedFirebaseConfig();
      appInstance = getApps().length > 0 ? getApp() : initializeApp(config);
    }
    return appInstance;
  } catch (err) {
    console.warn('Firebase app initialization fallback:', err);
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
    console.warn('Firebase auth initialization fallback:', err);
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
 * Real Google Sign-In via Firebase Authentication Popup
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth is not available in this browser environment');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const authUser: AuthUser = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Google Developer',
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  };

  try {
    localStorage.setItem('algopioneer_auth_user', JSON.stringify(authUser));
  } catch {}

  return authUser;
}

/**
 * Real Firebase Sign Out
 */
export async function logoutUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      await fbSignOut(auth);
    }
  } catch {}
  try {
    localStorage.removeItem('algopioneer_auth_user');
  } catch {}
}

/**
 * Subscribes to Real Firebase Auth Changes safely
 */
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      // Check if user is cached in local storage
      try {
        const saved = localStorage.getItem('algopioneer_auth_user');
        if (saved) {
          callback(JSON.parse(saved));
        } else {
          callback(null);
        }
      } catch {
        callback(null);
      }
      return () => {};
    }

    return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Google Developer',
          email: user.email,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous
        };
        try {
          localStorage.setItem('algopioneer_auth_user', JSON.stringify(authUser));
        } catch {}
        callback(authUser);
      } else {
        try {
          localStorage.removeItem('algopioneer_auth_user');
        } catch {}
        callback(null);
      }
    });
  } catch (err) {
    console.warn('Auth state change subscription note:', err);
    return () => {};
  }
}
