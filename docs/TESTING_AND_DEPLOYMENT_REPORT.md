# Testing & deployment report (Draft)

*Approx. three pages per student — duplicate sections with personalised reflections and attach artefacts under `evidence/`.*

## 1. Testing strategy

We combine **automated Jest tests** (fast feedback on utilities and services), **integration-style service tests** with mocks, **manual exploratory testing** on physical hardware, and **Firebase Test Lab** for repeatable device coverage. Risk-based prioritisation focused on authentication, booking persistence, and notification side-effects.

## 2. Unit testing (Jest)

Coverage includes:

- `distance.ts` — haversine distance sanity checks.  
- `validation.ts` — booking form validation.  
- `bookingStatus.ts` — role-aware transitions.  

Commands: `npm test`, `npm run test:coverage`. Store HTML coverage under `evidence/jest-results/coverage/`.

## 3. Integration testing

`src/tests/integration/bookingService.test.ts` mocks Firestore/SQLite boundaries to verify `createBooking` orchestrates persistence helpers. Extend with `@firebase/rules-unit-testing` if time permits.

## 4. End-to-end testing structure

See `src/tests/e2e/README.md` and `maestro/booking_flow.yaml` for a Maestro-ready skeleton (login → mechanic → booking). Detox is an alternative when using custom dev clients.

## 5. Firebase Test Lab

**Goal:** execute Robo or instrumentation tests against the release candidate APK.

Steps:

1. Build APK via `eas build -p android --profile preview`.  
2. Download artefact from Expo dashboard.  
3. Firebase Console → **Test Lab → Robo test** → upload APK.  
4. Select devices (example matrix):  
   - Pixel 6, API 34 (baseline)  
   - Samsung Galaxy A series, API 30 (mid-tier)  
   - Small-screen emulator API 28 (legacy coverage)  
5. Capture resulting logs/screens → `evidence/firebase-test-lab/`.

## 6. Devices used (manual)

| Device | OS | Scenarios |
| --- | --- | --- |
| (Fill) | Android 14 | Booking + notifications |
| (Fill) | Android 11 | Offline SQLite merge |
| (Fill) | iOS 17 | Navigation smoke |

## 7. Test results summary

| Area | Result | Notes |
| --- | --- | --- |
| Auth | Pass/Fail | Document defects |
| Firestore CRUD | Pass/Fail | Include screenshot of console |
| SQLite cache | Pass/Fail | Toggle airplane mode |
| Notifications | Pass/Fail | Mention channel settings |
| Ads | Pass/Fail | Only test IDs |

## 8. Issues discovered & fixes

List defects, severity, fix commit SHA, and retest outcome.

## 9. Testing limitations

- Expo Go cannot exercise every native module combination.  
- Firebase Test Lab Robo may not reach logged-in states without custom login credentials — consider instrumentation with Firebase Authentication test users.  
- Parallel booking stress tests were out of scope.

## 10. Automated testing reflection

Jest gave rapid feedback on pure functions but could not replace manual GPS verification. Future work: add Detox flows in CI triggered on `main`.

## 11. APK build / deployment process

1. `eas build:configure`  
2. `eas build -p android --profile preview`  
3. Internal distribution via QR link or Play Console internal testing track.  
4. Record version code, signing key alias (never commit keystore).  

---

### Student B addendum

Rewrite lessons learned in first person, attach personal device logs, and discuss collaboration (who authored which tests).
