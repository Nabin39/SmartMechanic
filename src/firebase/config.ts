import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import {
  initializeAuth,
  getAuth,
  Auth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Android fallback when `.env` is unavailable. The native `google-services.json`
// contains enough Firebase project metadata for app startup.
const androidGoogleServices = require('../../android/app/google-services.json') as {
  project_info?: {
    project_id?: string;
    project_number?: string;
    storage_bucket?: string;
  };
  client?: Array<{
    client_info?: {
      mobilesdk_app_id?: string;
    };
    api_key?: Array<{
      current_key?: string;
    }>;
  }>;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getExpoExtra(): Record<string, unknown> | undefined {
  return (Constants.expoConfig as any)?.extra ?? (Constants.manifest as any)?.extra;
}

function getGoogleServicesConfig(): FirebaseOptions | null {
  const projectInfo = androidGoogleServices.project_info;
  const client = androidGoogleServices.client?.[0];
  const apiKey = client?.api_key?.[0]?.current_key;
  const appId = client?.client_info?.mobilesdk_app_id;
  const projectId = projectInfo?.project_id;
  const messagingSenderId = projectInfo?.project_number;
  const storageBucket = projectInfo?.storage_bucket;

  if (!apiKey || !appId || !projectId || !messagingSenderId) {
    return null;
  }

  return {
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

function getFirebaseConfig(): FirebaseOptions | null {
  const extra = getExpoExtra();
  const expoConfig: FirebaseOptions | null = extra
    ? {
        apiKey: extra.firebaseApiKey as string,
        authDomain: extra.firebaseAuthDomain as string,
        projectId: extra.firebaseProjectId as string,
        storageBucket: extra.firebaseStorageBucket as string,
        messagingSenderId: extra.firebaseMessagingSenderId as string,
        appId: extra.firebaseAppId as string,
      }
    : null;

  if (expoConfig?.apiKey && expoConfig?.authDomain && expoConfig?.projectId && expoConfig?.appId) {
    return expoConfig;
  }

  return getGoogleServicesConfig();
}

/** Returns true when Firebase initialization data is available. */
export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

/** Initializes Firebase app, Auth, and Firestore. */
export function initFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } | null {
  const firebaseConfig = getFirebaseConfig();
  if (!firebaseConfig) {
    return null;
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }

  db = getFirestore(app);
  return { app, auth, db };
}

export function getFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} | null {
  if (!isFirebaseConfigured()) return null;
  if (app && auth && db) return { app, auth, db };
  return initFirebase();
}
