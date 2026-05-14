# Limitations & future improvements

## Current limitations

1. **Mechanic directory** — demo data seeds three garages; no verified marketplace onboarding.  
2. **Payments** — no billing or deposits; bookings are informational only.  
3. **Chat** — no real-time messaging between customer and workshop.  
4. **Live repair tracking** — statuses are discrete, not time-line granular.  
5. **Push notifications** — local notifications only; full FCM pipeline left as documentation + TODO hooks.  
6. **Offline creation** — bookings require network; SQLite mirrors successful writes but cannot queue offline creates in this baseline.  
7. **Security rules** — template rules are permissive for grading; production requires role-based enforcement.  
8. **AI diagnostics** — not implemented; issue descriptions are free text only.

## Planned future improvements

- Integrate **Stripe / PayPal** for deposits and invoices.  
- Add **in-app chat** (Firestore sub-collections or Stream layer).  
- Provide **live technician updates** with timeline UI + push notifications via FCM.  
- Expand **rating system** with verified job completion and moderation.  
- Implement **robust offline queue** using WatermelonDB or RxDB.  
- Explore **on-device ML** (TensorFlow Lite) for photo-based issue triage suggestions.  
- Harden **App Check** + domain-restricted API keys before public launch.
