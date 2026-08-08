import { initializeApp, getApps, getApp, deleteApp, type FirebaseApp } from 'firebase/app';
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
// Allows instant boot on GitHub Pages with environment overrides if present
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

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    const config = getSavedFirebaseConfig();
    if (getApps().length > 0) {
      try { deleteApp(getApp()); } catch {}
    }
    appInstance = initializeApp(config);
  }
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

/**
 * Real Google Sign-In via Firebase Authentication Popup
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
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
  const auth = getFirebaseAuth();
  if (auth) {
    await fbSignOut(auth);
  }
  try {
    localStorage.removeItem('algopioneer_auth_user');
  } catch {}
}

/**
 * Subscribes to Real Firebase Auth Changes
 */
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  const auth = getFirebaseAuth();
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
}
