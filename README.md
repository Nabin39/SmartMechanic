# Smart Mechanic

Smart Mechanic is a React Native (Expo) mobile application for **Assessment 4 — Mobile Application Development**. It helps vehicle owners discover nearby garages, book repairs, attach vehicle issue photos, track booking status, and receive local notifications. Firebase provides authentication and cloud data; SQLite caches bookings for offline resilience.

## Features

- Firebase Authentication (email/password) with **customer** and **mechanic** roles  
- Firestore collections: `users`, `mechanics`, `bookings` (see `firestore.rules`)  
- SQLite cache table `cached_bookings` with CRUD helpers in `src/database/sqliteService.ts`  
- GPS / maps (`expo-location`, `react-native-maps`) with **single-shot** location reads  
- Booking workflow with validation, hybrid Firestore + SQLite reads  
- Camera / library photos via `expo-image-picker` and booking `photoPath` / optional Storage placeholder  
- Local notifications (`expo-notifications`) on create/update; FCM extension points documented  
- Background sync (`expo-background-fetch` + `expo-task-manager`) — see `src/services/backgroundSyncService.ts`  
- Parallel/async patterns called out in `bookingService`, `FindMechanicsScreen`, and related services  
- AdMob **test** banner + interstitial (`react-native-google-mobile-ads`, official `TestIds`)  
- Admin / mechanic dashboard for demo status management  

## Tech stack

| Area | Technology |
| --- | --- |
| App runtime | Expo SDK 52, React Native 0.76, TypeScript |
| Auth / data | Firebase Auth, Cloud Firestore |
| Local DB | `expo-sqlite` |
| Navigation | React Navigation (native stack + bottom tabs) |
| Testing | Jest (`jest-expo`), unit + integration-style tests |
| CI / device cloud | Firebase Test Lab (documented) |
| Ads | Google Mobile Ads (test IDs only) |

## Folder structure

```
src/
  assets/
  components/
  context/
  database/
  firebase/
  hooks/
  navigation/
  screens/
  services/
  tests/
  utils/
App.tsx
app.config.js
app.json
firestore.rules
firebase.json
docs/
evidence/
maestro/
```

## Prerequisites

- Node.js 18+ and npm  
- Expo CLI (`npx expo`)  
- Firebase project (Authentication + Firestore enabled)  
- Optional: Google Maps SDK key (Android/iOS) for map tiles  
- EAS account for cloud APK builds (`eas-cli`)

## Security & credentials

**Never commit** `.env`, `google-services.json`, `GoogleService-Info.plist`, keystores, or private AdMob production IDs.

1. Copy `.env.example` → `.env`  
2. Fill `EXPO_PUBLIC_*` variables from Firebase **Project settings → General → Your apps (Web)**  
3. Restrict Firebase Web API keys in Google Cloud Console (HTTP referrer / Android package + SHA-1)  
4. For EAS builds, prefer `eas secret:create` for sensitive values instead of checking them into Git  

The app reads configuration through `app.config.js` (`dotenv`) and `expo-constants` `extra` — see inline comments in `src/firebase/config.ts`.

## Firebase setup

1. Create a Firebase project.  
2. Register an **Android** app with package name **`com.smartmechanic.bookingapp`** (must match `app.json` → `android.package`). Place `google-services.json` in the project root — Expo copies it via `googleServicesFile` when you run `prebuild` / EAS builds.  
3. Add a **Web** app in Firebase Console and copy its config into `.env` as `EXPO_PUBLIC_*` values — the JavaScript Firebase SDK (`src/firebase/config.ts`) uses those; `google-services.json` alone is not enough for Auth/Firestore in Expo.  
4. Enable **Email/Password** authentication.  
5. Create a Firestore database (production mode for real deploys; test mode acceptable for class demos — **tighten rules before public release**).  
6. Deploy rules: `firebase deploy --only firestore:rules` (requires Firebase CLI). Starter rules live in `firestore.rules`.  
7. Populate `.env` using `.env.example` as a template.  
8. (Optional) Firebase Storage for real photo uploads — follow `src/services/storageService.ts` comments.  
9. (Optional) FCM: add `GoogleService-Info.plist` for iOS via the same Expo `googleServicesFile` pattern for iOS when ready.

## SQLite

SQLite opens automatically on first use. Schema is created in `sqliteService.ts`. No manual migration step is required for the coursework bundle.

## Run the app

```bash
npm install
npx expo start
```

Use the Expo Go app for quick UI iteration. **Maps, AdMob, and background tasks** typically require a **development build**:

```bash
npx expo prebuild
npx expo run:android   # or run:ios
```

## Run tests

```bash
npm test
npm run test:coverage
```

Coverage output defaults to `evidence/jest-results/coverage/`.

## Build APK (EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Download the artifact from the Expo dashboard and upload to **Firebase Test Lab** (Robo or instrumentation) as described in `docs/TESTING_AND_DEPLOYMENT_REPORT.md`.

## Firebase Test Lab (summary)

1. Produce a signed `.apk` (EAS `preview` profile emits APK).  
2. Open Firebase Console → **Quality → Test Lab**.  
3. Upload APK, pick device matrix (e.g. Pixel 6 + API 34, mid-tier Samsung).  
4. Run Robo test, download logs, store under `evidence/firebase-test-lab/`.  

## Sprint & collaboration evidence

See `docs/AGILE_SPRINTS.md` for three sprint plans and `evidence/*` for screenshot placeholders (Azure Boards, GitHub, Test Lab, Jest, APK).

## Documentation index

| Document | Purpose |
| --- | --- |
| `docs/USER_MANUAL.md` | End-user instructions |
| `docs/TESTING_AND_DEPLOYMENT_REPORT.md` | Testing strategy + Test Lab + APK |
| `docs/FIREBASE_EXPLANATION.md` | Auth, Firestore, Test Lab write-up |
| `docs/LIMITATIONS_AND_FUTURE.md` | Known gaps + roadmap |
| `docs/PITCH_PRESENTATION.md` | 5-minute pitch + speaker notes |
| `docs/FINAL_SUBMISSION_CHECKLIST.md` | Submission package checklist |

## Contributors

Replace with your team names, student IDs, and GitHub handles before submission:

- Student A — `https://github.com/your-org/smart-mechanic`  
- Student B — branch owner for notifications / background sync  

## License

Educational use for assessment submission.
