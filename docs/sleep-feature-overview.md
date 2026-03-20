# Sleep Protection Feature — What We Built and Why

## The Problem

The Dead Man's Switch monitors your health data (heart rate, movement) through a wearable ring. If it stops receiving data for too long, it assumes something may be wrong and triggers an emergency alert to your contacts.

The issue: **when you go to sleep and your phone is off or charging, the ring stops sending data to the app.** The switch can't tell the difference between "user is sleeping peacefully" and "user is unresponsive." This caused false alarms — for example, going to bed at 8 PM and having the emergency fire at 2 AM.

## What We Built

### Sleep Schedule (Live — Working Now)

You set your usual **bedtime** and **wake time** in the app settings (for example, 10 PM to 7 AM). During that window, the system automatically:

- **Stops checking** for health data — so no data from your ring doesn't trigger a false alarm
- **Ignores routine check-in notifications** from the server
- **Still allows real emergency alerts through** — if a genuine emergency is confirmed by the backend, it will always reach you, even during sleep hours

There's nothing to press each night. Once you set your schedule, it runs automatically every day.

### Smart Sleep Detection (Live — Working Now)

In addition to the sleep schedule, the app now automatically detects when you're sleeping using three device signals. No extra setup required — just toggle it on in settings:

1. **Focus / Do Not Disturb Detection** — The app detects when your iPhone is in Sleep Focus or Do Not Disturb mode (or Bedtime/DND on Android). If Focus is active, the system pauses. This is a strong signal — you explicitly silenced your phone.

2. **Charging Detection** — If your phone is plugged in and charging during nighttime hours, the app treats this as a sleep indicator. Charging during the day is ignored (people charge at their desk).

3. **Health Data Recency** — If your ring or watch stops sending health data for 2+ hours and it's nighttime (or Focus is active), the app recognizes this as a normal sleep pattern rather than an emergency.

These signals work together. For a detailed breakdown of exactly when the emergency fires and when it doesn't, see `docs/smart-sleep-detection.md`.

### What We Explored But Set Aside

- **Background Health Data** — On iPhones, Apple restricts how apps can access health data in the background (for privacy). We explored getting heart rate data pushed to the app automatically, but Apple's restrictions make this unreliable. This approach was set aside.

## How It Protects You

**Before the fix:**
> You go to bed → phone is off or ring disconnects → app sees no health data → app thinks you're unresponsive → emergency fires at 2 AM → your contacts get a false alarm

**After the fix:**
> You go to bed → sleep schedule is active (10 PM–7 AM) → app knows you're likely sleeping → system pauses → no false alarm → system resumes at 7 AM and checks on you normally

**If a real emergency happens during sleep:**
> Critical emergency alerts from the backend are **never blocked**, even during the sleep window. The sleep feature only suppresses routine health checks — not confirmed emergencies.

## Where to Find It in the App

**Settings → Automated Emergency Settings → Sleep Schedule**

- Toggle it on
- Set your bedtime
- Set your wake time
- Done — it works every night automatically
