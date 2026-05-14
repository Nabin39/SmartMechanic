# Smart Mechanic — User Manual (Draft)

*Target length: ~3 pages per student — expand with screenshots in `evidence/screenshots/` before submission.*

## 1. Getting started

Smart Mechanic runs on Android and iOS devices. Install **Expo Go** for quick demos or use a **development build** (recommended for maps, ads, and background tasks). Ensure you grant location and notification permissions when prompted.

## 2. Installing / opening the app

1. Clone the GitHub repository (replace with your published URL).  
2. Run `npm install` then `npx expo start`.  
3. Scan the QR code with Expo Go **or** run `npx expo run:android` after `npx expo prebuild`.  

## 3. Creating an account

1. Open the app → **Sign up**.  
2. Enter full name, email, phone (optional), password (≥ 6 characters).  
3. Toggle **Register as mechanic** if you are simulating a garage admin.  
4. Submit — Firebase Authentication creates the credential and Firestore stores `users/{uid}`.

## 4. Logging in

Use **Log in** with the same email/password. If you see “Firebase is not configured”, copy `.env.example` to `.env` and add your Firebase web keys (see README).

## 5. Finding nearby mechanics

1. Go to the **Find** tab.  
2. Pull to refresh — the app requests **one** GPS fix and downloads mechanics from Firestore.  
3. Tap a card to open **Mechanic details**, or press **Map** (top-right) for the map view.

## 6. Booking a service

1. From mechanic details, tap **Book now**.  
2. Complete all fields (vehicle type/model, issue description, service type, preferred date/time).  
3. Submit — you are redirected to **Booking details** with a pending status.  
4. SQLite caches the booking for offline reference.

## 7. Uploading a car issue photo

1. Open **Booking details** for the relevant booking.  
2. Tap **Upload / capture photo**.  
3. Choose **Take photo** or **Choose from library**.  
4. Tap **Attach to booking** — the local URI is saved to Firestore (`photoPath`). Full Firebase Storage upload is optional (see developer docs).

## 8. Tracking booking status

Statuses progress through **Pending → Accepted → In progress → Completed** (or **Cancelled**). Customers can cancel while pending. Mechanics use **Mechanic dashboard** (mechanic role) or the mechanic tools section inside booking details to advance statuses.

## 9. Notifications

Local notifications confirm new bookings and announce status changes. On Android, a **Bookings** notification channel is created automatically. Remote push (FCM) is described for extension but not required for the baseline demo.

## 10. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank mechanic list | Verify `.env`, internet, and Firestore security rules. |
| Map tiles missing | Supply `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and rebuild native project. |
| Ads fail to load | Ensure development build; Expo Go may not load native ads. |
| Background sync never runs | Android battery optimisations may defer jobs — keep device charging for testing. |

## 11. FAQ

**Q:** Can I use Apple Sign-In?  
**A:** Not in this baseline; extend `authService` if required.

**Q:** Is my API key secret?  
**A:** Firebase web keys are public but must be restricted; never commit service accounts.

**Q:** Where is data stored?  
**A:** Primary source is Firestore; SQLite mirrors bookings on-device.

---

### Student B expansion ideas (second ~3 pages)

Duplicate this document’s sections in your own words, add annotated screenshots per step, and include a short “Day in the life” narrative (e.g., commuter discovers brake noise, books Riverside Auto Care, uploads photo, receives completion notification). Reference actual Firebase console screen captures (blur secrets).
