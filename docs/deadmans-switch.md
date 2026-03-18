# Dead Man's Switch — How It Works

## Overview

The Dead Man's Switch is a safety system that monitors whether the user is alive and responsive. If the system detects no signs of life (no bio data or no manual check-in) within a configured time window, it escalates an emergency — contacting the user's pre-configured emergency contacts.

There are two independent trigger modes. Only one can be active at a time.

---

## 1. Time-Based Trigger

**How it works:** The backend sends push notifications at a regular interval (the "positive info period", e.g. every 6 hours). Each notification asks: *"Are you OK?"* If the user does not respond, the system escalates.

**Flow:**

1. User enables **Time-Based** trigger in Automated Emergency Settings and selects an interval.
2. Backend sends a push notification of type `EMERGENCY_TIME_BASED_CHECK` at each interval.
3. The app receives the push and navigates to the **Health Condition Error** screen.
4. The user has two choices:
   - **"Yes, I'm fine"** → sends a positive signal to the API (`POST /api/v1/user/positive-info`), resets the timer.
   - **"Start Emergency"** → immediately triggers the emergency escalation.
5. If the user never responds (phone off, asleep, incapacitated), the backend eventually fires an `EMERGENCY_ALERT`.

---

## 2. Bio-Based Trigger (Pulse / Health Data)

**How it works:** The app periodically reads health data (heart rate, resting heart rate, step count) from Google Fit (Android) or HealthKit (iOS). If recent valid data exists, a positive signal is sent automatically — no user interaction needed. If no data is found, the system escalates.

**Flow:**

1. User enables **Bio-Based** trigger and pairs an Apple Watch or wearable.
2. A background task (`react-native-background-fetch`) runs every ~15 minutes (1 min in dev).
3. Each cycle calls `startBioCheck()`:
   - Checks if the system is **paused** (manual pause, scheduled pause times, or sleep mode).
   - If not paused, calls `checkForBioData()`.
4. `checkForBioData()` reads the last health samples from Google Fit within the configured period window.
5. If valid data exists (heart rate > 10 bpm, steps > 10):
   - Sends `POST /api/v1/user/positive-info` with the next check-in interval.
   - Backend resets its internal countdown.
6. If **no valid data** is found:
   - A local notification warns: "No data found."
   - The `HealthTrigger` flag is set to `true`.
   - The app navigates to the **Health Condition Error** screen (if in foreground/background).
7. If positive info is never sent, the backend escalates and sends an `EMERGENCY_ALERT` push.

### iOS Native Path

On iOS, there is also a native Swift layer (`NativeManagerSingleton`) that:
- Runs HealthKit observer queries for heart rate data.
- Handles silent push notifications from the backend.
- Checks if the last HealthKit update is older than 8 hours. If so, it calls `triggerEmergency` directly from native code.

---

## 3. Emergency Escalation

When the backend determines the user has not checked in, it sends an `EMERGENCY_ALERT` push notification. The app then:

1. Plays a loud alarm sound.
2. Vibrates the device continuously (iOS: repeating 1.3s on / 2s off pattern).
3. Updates the user's GPS location on the server.
4. Displays a full-screen alert.
5. The user can still cancel at this point ("I'm OK").
6. If no cancellation occurs, the backend sends the pre-configured emergency messages (email, SMS, Telegram) to all emergency contacts, including the user's last known location.

### Manual Emergency Button

The Dashboard also has a manual **Emergency** button with a two-phase countdown:
- **Phase 1 (3 seconds):** User must hold the button. Releasing cancels.
- **Phase 2 (5 seconds):** A cancel button appears. If not cancelled, the emergency triggers.

---

## 4. Pause Mechanisms

The system can be paused to prevent false alarms:

| Mechanism | Where | How |
|---|---|---|
| **Manual Pause** | Automated Emergency Settings → Pause Times | Set a specific date/time until which the system is paused |
| **Scheduled Pause** | Automated Emergency Settings → Pause Times | Recurring weekly windows (e.g. every Tuesday 10am–12pm) |
| **Sleep Mode (manual)** | Dashboard → "Going to Sleep" button | One-tap pause until the configured wake time |
| **Sleep Schedule (auto)** | Automated Emergency Settings → Sleep Schedule | Recurring nightly window (e.g. 10pm–7am) auto-pauses every night |

All pause checks happen at the start of `startBioCheck()` and in the push notification handler. When paused, bio checks are skipped and `EmergencyRegularCheck` / `EmergencyHealthCheck` pushes are suppressed. **`EmergencyAlert` is never suppressed** — if the backend has already escalated to a full emergency, the alert always gets through.

---

## 5. Data Flow Diagram

```
User wears device (Apple Watch / Oura Ring / Fitbit)
         │
         ▼
Health data syncs to HealthKit / Google Fit
         │
         ▼
┌─────────────────────────────┐
│  Background Task (~15 min)  │
│  startBioCheck()            │
│                             │
│  ┌─ Paused? ──► Skip       │
│  │                          │
│  └─ Not paused              │
│     │                       │
│     ▼                       │
│  Read health data           │
│     │                       │
│     ├─ Data found ──────────┼──► POST /positive-info ──► Backend resets timer
│     │                       │
│     └─ No data ─────────────┼──► Show Health Condition screen
│                             │        │
└─────────────────────────────┘        │
                                       ▼
                              User responds "I'm OK"?
                                 │            │
                                Yes           No
                                 │            │
                                 ▼            ▼
                           Reset timer    Backend escalates
                                              │
                                              ▼
                                    EMERGENCY_ALERT push
                                              │
                                              ▼
                                   Alarm + Vibration + GPS
                                              │
                                              ▼
                                  Notify emergency contacts
```

---

## 6. Key Files

| File | Purpose |
|---|---|
| `src/services/BioCheck.service.ts` | Core bio check loop: reads health data, sends positive info |
| `src/services/Background.service.ts` | Background fetch scheduling, emergency retry logic |
| `src/services/Push.service.ts` | Handles incoming push notifications, routes to screens |
| `src/services/GoogleFit.service.ts` | Reads heart rate, resting HR, and step data from Google Fit |
| `src/services/Time.service.ts` | Checks if current time falls within a pause window |
| `src/services/SleepSchedule.service.ts` | Sleep mode state management and schedule checks |
| `src/services/API.service.ts` | All backend API calls (positive-info, start-emergency, cancel) |
| `src/providers/EmergencyCountdown/` | Manual emergency button countdown UI |
| `src/screens/HealthConditionErrorScreen/` | "Are you OK?" screen shown on check-in failure |
| `src/constants/emergency.constants.ts` | Countdown timers (3s hold + 5s cancel window) |
| `ios/Native/Managers/NativeManagerSingleton.swift` | iOS native HealthKit observers + silent push handling |
| `ios/Native/Managers/HealthKitManager.swift` | iOS HealthKit data collection |
