import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirebase } from '../firebase/config';
import type { AppUser, UserRole } from '../firebase/types';
import { upsertUserProfile } from './firestoreService';

function requireAuth() {
  const fb = getFirebase();
  if (!fb) throw new Error('Firebase is not configured.');
  return fb.auth;
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  phone?: string
): Promise<AppUser> {
  const auth = requireAuth();
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(cred.user, { displayName: name.trim() });
  const user: AppUser = {
    uid: cred.user.uid,
    name: name.trim(),
    email: email.trim(),
    role,
    phone: phone?.trim(),
    createdAt: new Date().toISOString(),
  };
  await upsertUserProfile(user);
  return user;
}

export async function loginWithEmail(email: string, password: string) {
  const auth = requireAuth();
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logoutUser() {
  const auth = requireAuth();
  await signOut(auth);
}
