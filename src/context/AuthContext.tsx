import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { initFirebase, isFirebaseConfigured } from '../firebase/config';
import type { AppUser } from '../firebase/types';
import { getUserProfile } from '../services/firestoreService';
import { seedAllDemoData } from '../services/seedDataService';

type AuthContextValue = {
  /** True when `.env` contains Firebase keys and SDK initialized */
  firebaseConfigured: boolean;
  firebaseUser: User | null;
  profile: AppUser | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseConfigured] = useState(() => isFirebaseConfigured());
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    try {
      const p = await getUserProfile(uid);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const fb = initFirebase();
    if (!fb) {
      setLoading(false);
      return;
    }
    
    // Safety timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    const unsub = onAuthStateChanged(fb.auth, async (u) => {
      clearTimeout(timeoutId);
      setFirebaseUser(u);
      if (u) {
        // Seed demo data after login (uses fixed IDs — safe to call repeatedly)
        // Run in background to avoid blocking the UI or increasing startup memory.
        seedAllDemoData(u.uid, u.email ?? '', u.displayName).catch((err) =>
          console.warn('[seedDataService] Background seed failed:', err)
        );
        await loadProfile(u.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, [firebaseConfigured, loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (firebaseUser) await loadProfile(firebaseUser.uid);
  }, [firebaseUser, loadProfile]);

  const value = useMemo(
    () => ({
      firebaseConfigured,
      firebaseUser,
      profile,
      loading,
      refreshProfile,
    }),
    [firebaseConfigured, firebaseUser, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
