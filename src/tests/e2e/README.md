# End-to-end test structure

This folder documents how to add device-level E2E tests. The template flow matches Assessment 4 expectations:

1. Launch app (development build with Maestro, Detox, or Appium).
2. Log in with a disposable Firebase test user.
3. Open **Find mechanics** → select a garage.
4. Create a booking with valid form data.
5. Open **My bookings** → verify the booking appears.
6. (Optional) Mechanic role advances status and customer receives a local notification.

## Suggested tooling

- **Maestro** (`maestro/`) — YAML flows, fast iteration on CI.
- **Detox** — requires a custom Expo dev client and Android/iOS build targets.

## Placeholder command

```bash
maestro test maestro/booking_flow.yaml
```

Add your own `maestro/` directory when running on CI. Keep Firebase test credentials outside the repository.
