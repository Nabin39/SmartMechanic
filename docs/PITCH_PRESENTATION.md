# Five-minute pitch — Smart Mechanic

## Slide / section outline

1. **Title & problem** — Vehicle breakdowns are stressful; finding trustworthy garages and tracking repairs is fragmented across calls and messages.  
2. **Target users** — Everyday drivers and independent garage administrators.  
3. **Key features** — Discovery, booking, photos, status tracking, notifications, offline cache.  
4. **Demo flow** — Login → find mechanic → book → attach photo → mechanic updates status → notification.  
5. **Technologies** — Expo RN, Firebase Auth/Firestore, SQLite, AdMob test ads, background fetch.  
6. **Testing** — Jest + Firebase Test Lab + manual devices; highlight evidence folders.  
7. **Lessons learned** — Async orchestration, secure env handling, native module constraints in Expo.  
8. **Future improvements** — Payments, chat, FCM, richer offline.  
9. **Anticipated Q&A** — see below.

## Speaker notes (≈5 minutes)

*(Approx. 750 spoken words — adjust pacing.)*

> **Opening (45s):**  
> “Good morning, we’re Smart Mechanic — a mobile app that turns a stressful car problem into a guided repair journey. Instead of ringing random garages, owners discover vetted workshops nearby, describe the fault once, attach photos, and track progress with notifications.”

> **Users & pain (45s):**  
> “Our primary persona is a commuter who notices a warning light mid-week. Secondary personas are small garage admins who need structured job intakes. Today they rely on ad-hoc WhatsApp threads — we centralise that workflow.”

> **Features (60s):**  
> “From the home dashboard you can jump into our map/list hybrid, inspect mechanic profiles with ratings and indicative pricing, and book with structured vehicle data. SQLite caches bookings so the list still renders with spotty signal. Mechanics can advance statuses on a dedicated admin surface.”

> **Demo script (75s):**  
> “Watch me sign in with our Firebase test user, refresh the find screen to fetch Firestore mechanics sorted by distance, open Riverside Auto Care, and submit a booking. I’ll attach a photo from the gallery, then switch to the mechanic role to push the status to in-progress and completed — notice the local notification firing each time.”

> **Tech & quality (45s):**  
> “We chose Expo for velocity but still access native capabilities: Google Maps, AdMob test placements, background fetch for sync, and expo-notifications. Firebase Authentication secures identities while Firestore stores bookings. We automated unit and integration-style tests with Jest and validated builds on Firebase Test Lab devices.”

> **Testing outcomes (30s):**  
> “Jest covers distance math, validation, and booking orchestration. Test Lab Robo runs caught layout issues on smaller screens — we tightened padding. Manual passes verified GPS permission flows on Android 11+.”

> **Lessons learned (30s):**  
> “Parallel async saves felt invisible to users but required careful error handling. Environment variables taught us discipline — no secrets in Git.”

> **Future roadmap (30s):**  
> “Next we’d add payments, FCM push, and verified mechanic onboarding.”

> **Close (15s):**  
> “Smart Mechanic demonstrates a production-minded architecture within an academic timeline — happy to take questions.”

## Anticipated Q&A

| Question | Answer direction |
| --- | --- |
| Why Expo instead of pure RN CLI? | Faster iteration + managed modules; dev client unlocks native SDKs. |
| How do you secure Firestore? | Start from `firestore.rules`, tighten per-role before launch. |
| Battery impact of GPS? | Single high-level fix per refresh, no watchPosition loop. |
| Why SQLite if Firestore exists? | Assessment requirement + offline resilience. |
| Are ads real revenue? | No — only Google test IDs to prove integration. |
