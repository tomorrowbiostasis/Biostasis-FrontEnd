# Dead Man's Switch — What It Does

## The Problem

If someone suffers a medical emergency while alone — a heart attack, a stroke, a fall — they may not be able to call for help themselves. Every minute that passes without intervention reduces the chance of survival or recovery.

## The Solution

The Dead Man's Switch is an automated safety system built into the Biostasis app. It continuously monitors the user for signs of life. If the system detects that the user has stopped responding — no heartbeat data, no movement, no check-in — it automatically alerts their emergency contacts with a message and the user's last known location.

Think of it as a silent guardian that watches over you 24/7 and calls for help when you can't.

## How It Works (Simple Version)

The system works in three stages:

### Stage 1 — Monitoring

The app quietly checks on the user at regular intervals. There are two ways it does this:

- **Wearable monitoring (recommended):** If the user wears a smartwatch (Apple Watch, Oura Ring, Fitbit, etc.), the app reads their heart rate, resting heart rate, and step count in the background. As long as the data looks normal, the system stays quiet and sends an "all good" signal to the server automatically. The user doesn't have to do anything.

- **Timed check-ins:** If the user doesn't have a wearable, the app sends a notification every few hours (the user picks the interval) asking: "Are you OK?" The user taps "Yes" and the timer resets. No interaction needed beyond that single tap.

### Stage 2 — Escalation

If the system can't confirm the user is OK — no health data coming in, or no response to check-in notifications — it raises the alarm:

1. The phone plays a loud alarm sound and vibrates
2. A full-screen alert appears asking: "Are you OK?"
3. The user can still cancel by tapping "I'm fine"

This is the last chance to prevent the emergency from going out.

### Stage 3 — Emergency Alert

If there is still no response, the system assumes the user needs help. It:

1. Sends emergency messages (email, SMS, Telegram) to all pre-configured emergency contacts
2. Includes the user's last known GPS location
3. Includes any medical information the user has stored in the app (medical conditions, address, instructions)

The emergency contacts receive everything they need to locate the user and get them help.

## The Manual Panic Button

In addition to the automated system, the app has a manual emergency button on the main screen. If the user is conscious and needs help immediately:

1. Press and hold the button for 3 seconds
2. A 5-second countdown begins — one last chance to cancel
3. If not cancelled, the emergency alert goes out immediately

## Preventing False Alarms

The system includes several safeguards to avoid waking up emergency contacts unnecessarily:

- **Sleep Schedule:** An automatic sleep schedule (e.g., pause every night from 10pm to 7am) plus Smart Sleep Detection that reads phone signals (Focus/DND, charging, health data recency) to auto-detect sleep.
- **Manual Pause:** Users can pause the system for a specific duration (e.g., "pause for 3 hours while I'm in a meeting").
- **Scheduled Pauses:** Recurring weekly windows can be configured (e.g., every Sunday during a yoga class).
- **Final confirmation:** Even after escalation begins, the user gets an alarm and a chance to cancel before the alert goes out.

## Who Is This For?

- People who live alone
- People with medical conditions that could cause sudden incapacitation
- Elderly individuals
- Anyone signed up for cryopreservation who needs rapid response
- Anyone who wants peace of mind that someone will be notified if something happens to them

## What the User Needs to Set Up

1. **Emergency contacts** — at least one person who should be notified (email, phone, or Telegram)
2. **A wearable device** (optional but recommended) — Apple Watch, Oura Ring, Fitbit, or any device that syncs health data to Apple Health or Google Fit
3. **Monitoring mode** — choose between wearable-based (automatic) or time-based (manual check-ins)
4. **Check-in interval** — how often the system checks (e.g., every 3, 6, or 9 hours)
5. **Sleep schedule** (optional) — when the system should pause overnight

Once configured, the system runs silently in the background. The user doesn't need to think about it unless the alarm goes off.
