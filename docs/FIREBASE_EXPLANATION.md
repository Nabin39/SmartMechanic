# Firebase technologies — explanation

## Firebase Authentication

**What it does:** securely identifies users with email/password (extensible to OAuth providers). It issues ID tokens consumed by Firebase client SDKs.

**Why we selected it:** managed user directory, integrates natively with Firestore security rules, and removes the need to store password hashes ourselves.

**Where it is used:** `src/firebase/config.ts` initialises `initializeAuth` with `AsyncStorage` persistence. Screens `LoginScreen.tsx` / `SignupScreen.tsx` call `authService`. Successful sign-up writes `users/{uid}` via `firestoreService.upsertUserProfile`.

## Cloud Firestore

**What it does:** scalable NoSQL cloud database with real-time listeners (listeners optional in this coursework version).

**Why we selected it:** flexible schema for mechanics and bookings, straightforward security rules for per-user data, generous free tier for demos.

**Collections:**

| Collection | Key fields |
| --- | --- |
| `users` | `uid`, `name`, `email`, `role`, `phone`, `createdAt` |
| `mechanics` | `mechanicId`, `name`, `address`, `latitude`, `longitude`, `services`, `rating`, `phone`, optional `priceRange` |
| `bookings` | `bookingId`, `userId`, `mechanicId`, vehicle fields, `issueDescription`, `photoUrl`/`photoPath`, `serviceType`, `bookingDate`, `status`, timestamps |

Implementation reference: `src/services/firestoreService.ts`.

## Firebase Test Lab

**What it does:** runs Robo, instrumentation, or game loops on physical/virtual devices in Google data centres, producing logs, ANRs, and crash reports.

**Why we selected it:** satisfies coursework requirement for cloud-based device testing without maintaining a large device lab.

**How we performed testing:** build an APK (`eas build`), upload to Test Lab, choose a multi-device matrix, export artefacts to `evidence/firebase-test-lab/`. Include screenshots of the console summary table in the final PDF/ZIP.

### Optional Firebase modules (extension points)

- **Cloud Storage** — swap placeholder in `storageService.ts` for real uploads.  
- **Cloud Messaging** — store Expo push tokens on user documents for remote alerts.
