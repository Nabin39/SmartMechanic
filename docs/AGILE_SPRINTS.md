# Agile sprint documentation — Smart Mechanic

This document satisfies the **three-sprint** coursework structure (Weeks 3–11). Replace contributor names with your team. Azure DevOps (Boards) or GitHub Projects can mirror these items — store screenshots under `evidence/azure-devops/`.

---

## Sprint 1 — Weeks 3–5

### Sprint goal

Establish the Expo + TypeScript workspace, navigation skeleton, Firebase Authentication, GitHub collaboration practices, and a welcoming home experience.

### User stories

| ID | Story | Story points |
| --- | --- | --- |
| S1-01 | As a student, I need a GitHub repository with branching rules so we can collaborate safely. | 2 |
| S1-02 | As a driver, I want to sign up and log in so my bookings are private to my account. | 5 |
| S1-03 | As a driver, I want a dashboard after login so I can reach core tasks quickly. | 3 |
| S1-04 | As a team, we need low-fidelity wireframes to align UI layout before coding. | 2 |

### Tasks

- Initialize Expo SDK 52 project with TypeScript, ESLint optional, `src/` structure.  
- Configure Firebase project, enable Email/Password auth, capture keys in `.env`.  
- Implement `AuthProvider`, login/signup screens, Firestore `users/{uid}` profile write.  
- Build tab + stack navigation (`Splash`, `Login`, `MainTabs`).  
- Draft wireframes (Figma or paper) for auth + home + bookings.  
- Add `.gitignore`, `.env.example`, `README.md` skeleton.  

### Acceptance criteria

- [ ] Fresh clone runs with `npm install` + `npx expo start`.  
- [ ] Users can register, see data in Firebase Authentication console, and see `users` document.  
- [ ] Logout returns to login flow.  
- [ ] README documents Firebase env setup.  

### Expected GitHub commits (examples)

- `chore: bootstrap expo project and tooling`  
- `feat(auth): add firebase email login`  
- `feat(nav): add splash and tab shell`  
- `docs: add env example and firebase setup`  

---

## Sprint 2 — Weeks 6–8

### Sprint goal

Deliver the mechanic discovery experience, booking creation backed by Firestore, SQLite caching, and media capture hooks.

### User stories

| ID | Story | Story points |
| --- | --- | --- |
| S2-01 | As a driver, I want to see nearby mechanics sorted by distance. | 5 |
| S2-02 | As a driver, I want to book a service with structured vehicle/issue fields. | 5 |
| S2-03 | As a driver, I want my bookings cached locally for poor connectivity. | 3 |
| S2-04 | As a driver, I want to attach a photo of the vehicle issue. | 3 |

### Tasks

- Model Firestore collections `mechanics`, `bookings`; seed demo mechanics.  
- Implement `FindMechanicsScreen` with parallel `fetchMechanics` + GPS read.  
- Integrate `react-native-maps` map screen with markers.  
- Implement `bookingService` with `Promise.all` Firestore + SQLite writes.  
- Build `sqliteService` CRUD + merge logic in `MyBookingsScreen`.  
- Add `expo-image-picker` flow + `UploadPhotoScreen`.  

### Acceptance criteria

- [ ] Mechanics appear from Firestore; distances show when permission granted.  
- [ ] Booking documents include all required assessment fields.  
- [ ] SQLite `cached_bookings` updates on create/status change.  
- [ ] Photo URI stored on booking (`photoPath`).  

### Expected GitHub commits

- `feat(firestore): add mechanics seeding utility`  
- `feat(bookings): create booking with sqlite cache`  
- `feat(map): add markers and detail navigation`  
- `feat(media): hook image picker to booking`  

---

## Sprint 3 — Weeks 9–11

### Sprint goal

Harden notifications, background synchronization, AdMob test placements, automated testing, Firebase Test Lab evidence, APK packaging, and submission-grade documentation.

### User stories

| ID | Story | Story points |
| --- | --- | --- |
| S3-01 | As a driver, I want notifications when my booking changes. | 3 |
| S3-02 | As a driver, I want background sync so statuses refresh without opening the app. | 5 |
| S3-03 | As a product owner, I need AdMob placeholders that never leak production keys. | 2 |
| S3-04 | As a QA lead, I need Jest + Test Lab evidence for the report. | 5 |

### Tasks

- Wire `expo-notifications` local alerts + channel configuration.  
- Register `expo-background-fetch` task (`backgroundSyncService`).  
- Add AdMob banner + interstitial **test** IDs only.  
- Expand Jest unit/integration suites; capture coverage under `evidence/jest-results/`.  
- Run `eas build` for Android APK; upload to Firebase Test Lab; archive logs/screens.  
- Finalise README, user manual, testing report, pitch deck notes.  

### Acceptance criteria

- [ ] Local notifications fire on booking create + status updates.  
- [ ] Background task registered (visible in dev logs) and documented.  
- [ ] AdMob surfaces test creatives only.  
- [ ] `npm test` passes in CI/local; evidence folders contain placeholders or real assets.  
- [ ] Submission zip excludes `.env` and keystores.  

### Expected GitHub commits

- `feat(notifications): schedule local alerts on booking events`  
- `chore(bg): register booking sync background fetch`  
- `test: add booking service integration harness`  
- `docs: testing report and user manual`  

---

## Collaboration & evidence guidance

### GitHub

- Default branch `main`, feature branches `feature/sprintX-short-name`.  
- Require PR reviews before merge (screenshot for evidence).  
- Use meaningful commit messages; pair programming sessions logged in README contributors section.  

### Azure DevOps Boards

1. Create **Epic**: Smart Mechanic MVP.  
2. Map each sprint user story to **Features** → **Tasks** with remaining work hours.  
3. Add testing tasks (Jest, manual device matrix, Test Lab).  
4. Capture screenshots: backlog view, sprint board, task assignment, test tab.  

### Microsoft Teams (optional)

Store meeting notes links or export chat snippets showing planning decisions; blur private data.
