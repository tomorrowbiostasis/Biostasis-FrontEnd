# Smart Sleep Detection — Complete Logic Guide

## What This Document Covers

This explains exactly when the Biostasis app **fires an emergency** and when it **stays quiet**, in plain language. It covers all scenarios tested and verified with **402 automated test cases**.

---

## The Core Rule

The Dead Man's Switch does one simple thing: it checks if you're alive by looking at health data from your ring or watch. If there's no data and you don't respond to check-ins, it sends an emergency alert to your contacts.

The challenge: **when you're sleeping, there's no health data either.** And when you're **flying or jet-lagged**, normal patterns don't apply. The app needs to know the difference between "sleeping peacefully," "traveling safely," and "needs help."

---

## Two Layers of Sleep Protection

### Layer 1: Sleep Schedule

You set up when you usually sleep: bedtime and wake time (e.g., 10 PM to 7 AM). During that window, the system pauses automatically every night.

### Layer 2: Smart Sleep Detection (Automatic)

The app reads signals from your phone to figure out if you're sleeping — no setup required beyond turning it on. Three signals are used:

| Signal | What It Detects | When It Pauses the System |
|--------|----------------|--------------------------|
| **Focus / Do Not Disturb** | Your phone is in Sleep Focus or DND mode | Anytime Focus is active (strong signal — you explicitly silenced your phone) |
| **Charging Detection** | Your phone is plugged in and charging | Only during nighttime hours (charging during the day is ignored) |
| **Health Data Recency** | Your ring/watch stopped sending data | Only when combined with Focus or nighttime (stale data alone during the day triggers an emergency) |

---

## Automatic Travel Protection

Two invisible safety guards handle travel scenarios. They are always active — no settings, no toggles, no user action required.

### Airplane Mode Gate

When your phone is in Airplane Mode, the system skips the bio check entirely. The logic is simple: if the phone can't reach the internet, an emergency alert can't be delivered anyway. When Airplane Mode turns off, the system starts fresh with a clean slate — no stale emergencies queue up during the flight.

### Travel Grace Period (Jet Lag Protection)

The app silently tracks your device's timezone. When it detects a shift of 1+ hours (you flew to a new timezone), it activates a **24-hour grace period**. During this period, the "nighttime" window expands to cover the entire day — so charging your phone at 2 PM (when your body clock says midnight) is correctly recognized as a sleep signal.

After 24 hours, the grace period expires automatically and the system returns to normal with the new timezone as the baseline.

| What Happens | How It Works |
|-------------|-------------|
| You board a plane | Airplane Mode blocks all bio checks — nothing queues up |
| You land in a new timezone | System detects timezone shift, starts 24h grace period |
| You're jet-lagged, sleeping at 3 PM | Charging or stale health data at 3 PM triggers pause (travel makes nighttime = 24h) |
| 24 hours later | Grace period expires, system returns to normal schedule |

---

## When the Emergency FIRES (System RUNS)

These are all the scenarios where the system checks your health data and will trigger an emergency if nothing is found:

| # | Scenario | Why It Fires |
|---|----------|-------------|
| 1 | **No health data at 2 PM, no sleep protection active** | Daytime, nothing says you're sleeping — no data means possible emergency |
| 2 | **No health data at 10 AM, smart detection on but no signals** | Morning, phone not charging, Focus off — system runs normally |
| 3 | **No health data at 10 AM, phone charging but it's daytime** | Charging during the day is ignored — people charge at their desk |
| 4 | **Stale health data at noon, only charging signal** | Charging alone during the day doesn't prove sleep |
| 5 | **Stale health data at 3 PM, no other signals** | Afternoon with no corroborating sleep signal — could be a real emergency |
| 6 | **7:00 AM (wake time), no health data** | Sleep schedule just ended, system resumes — no data means check on you |
| 7 | **7:01 AM, no health data** | Definitely past wake time — emergency fires |
| 8 | **8:00 AM, smart detection on, no signals active** | Morning, no Focus/DND, not charging — you should be awake by now |
| 9 | **Smart detection enabled but all sub-toggles turned off** | Smart detection is effectively disabled — behaves like it's off |
| 10 | **Focus detection disabled, Focus is active at noon** | You turned off the Focus feature in settings — system ignores it |
| 11 | **User collapses at 3 PM, phone on charger** | Daytime — charging is not a sleep signal outside nighttime |
| 12 | **User collapses at 3 PM, stale data + charging** | Both signals present but it's daytime — not enough to assume sleep |
| 13 | **Night worker: 3 AM during their shift, no data** | Their schedule says sleep is 6 AM-2 PM, so 3 AM is a work hour |
| 14 | **Travel grace active, no signals, no data at 2 PM** | Travel alone doesn't suppress — you still need a corroborating signal |
| 15 | **After landing, no travel grace, no signals, no data** | Same timezone flight — normal behavior applies |
| 16 | **London 6 PM, travel grace active but no signals** | No Focus, not charging — the system correctly flags a potential issue |

### Key Safety Guarantees

1. **Emergency Alert push notifications are NEVER blocked.** Even if every sleep/travel signal is active, a confirmed emergency alert always reaches the user.
2. **Airplane Mode prevents stale emergencies.** No false alarms queue up during flights.
3. **Travel grace only expands nighttime — it doesn't suppress signals.** You still need charging or stale health data for the system to pause.

---

## When the Emergency DOES NOT Fire (System Pauses)

| # | Scenario | Why It Pauses |
|---|----------|--------------|
| 1 | **2 AM, sleep schedule active (10 PM - 7 AM)** | You told the app you sleep during these hours |
| 2 | **Midnight, sleep schedule active** | Within the sleep window |
| 3 | **2 AM, no schedule, but Focus/DND is on** | Your phone is explicitly in quiet mode — strong sleep signal |
| 4 | **2 AM, no schedule, phone charging** | Nighttime + charging = likely sleeping |
| 5 | **2 AM, no schedule, health data stale for 3+ hours** | Nighttime + no data from ring = ring disconnected during sleep |
| 6 | **11 PM, phone charging, smart detection on** | Nighttime + charging |
| 7 | **3 AM, Focus active, smart detection on** | Focus alone is sufficient at any time |
| 8 | **8 AM, past wake time, but Focus still active** | User is oversleeping with DND on — smart detection extends protection |
| 9 | **10 PM sharp (bedtime), sleep schedule on** | Exact start of sleep window |
| 10 | **6:59 AM (1 minute before wake), schedule active** | Still within the sleep window |
| 11 | **Charging at 7:59 AM (1 min before nighttime ends)** | Still within the default nighttime window (10 PM - 8 AM) |
| 12 | **Night worker: noon (during their sleep schedule 6 AM-2 PM)** | Their custom schedule covers their sleep time |
| 13 | **Global time pause active (e.g., paused until 10 AM)** | User manually paused the system |
| 14 | **Recurring weekly pause slot active (e.g., Wed 2-4 PM yoga)** | Scheduled recurring pause |
| 15 | **Airplane mode ON at any time** | Can't deliver emergency anyway — skipped entirely |
| 16 | **Travel grace + phone charging at 2 PM** | Jet lag — charging at any hour counts as nighttime |
| 17 | **Travel grace + stale health data at 11 AM** | Timezone shifted — stale data + expanded nighttime = pause |
| 18 | **Just landed, travel grace active, phone charging** | Post-flight — system gives 24h grace before resuming normal |

---

## How the Signals Combine

```
Is the user in airplane mode?
  → YES → Skip everything. Wait for airplane mode to turn off.

Is a sleep schedule set and are we in the window?
  → YES → System pauses

Is Smart Detection turned on?
  → NO → System runs normally

Is Focus / Do Not Disturb active?
  → YES → System pauses (strong standalone signal)

Is the phone charging AND it's nighttime (or travel grace active)?
  → YES → System pauses

Is health data stale (2+ hours) AND it's nighttime (or travel grace active)?
  → YES → System pauses

None of the above?
  → System runs → checks health data → fires emergency if no data found
```

**"Nighttime"** means:
- If you have a sleep schedule set: your bedtime to wake time, plus a 1-hour buffer on each side
- If you don't have a schedule: 10 PM to 8 AM by default (configurable in settings)
- If a timezone shift was detected in the last 24 hours: **all 24 hours** (the entire day counts as nighttime)

---

## The Original Problem — Solved

**Before:**
> User goes to bed at 8 PM. Phone charges on nightstand. Ring disconnects. At 2 AM, the app sees no health data, panics, and wakes up the user's emergency contacts with a false alarm.

**After (with sleep schedule):**
> Same situation, but the user set their sleep schedule to 8 PM - 7 AM. The system stays quiet all night. At 7 AM it resumes and checks normally.

**After (with smart detection, no schedule needed):**
> Same situation. The user's phone is in Sleep Focus mode and charging. Smart detection recognizes both signals as "sleeping" and stays quiet. At 7 AM, Focus turns off, phone is unplugged — system resumes.

**Flying (NYC to London):**
> User boards at 9 PM, turns on Airplane Mode. At 2 AM mid-flight, the system does nothing (airplane gate). User lands at 9 AM London time. Phone detects the timezone shift and starts a 24-hour grace period. User is jet-lagged, charges phone at 3 PM London time — system recognizes this as "sleep during travel" and stays quiet. Next day, grace period expires — back to normal.

---

## What's in the App Settings

**Settings → Automated Emergency Settings → Sleep Schedule**
- Toggle on/off
- Set bedtime (e.g., 10:00 PM)
- Set wake time (e.g., 7:00 AM)

**Settings → Automated Emergency Settings → Smart Sleep Detection**
- Master toggle on/off
- Use Focus / Do Not Disturb (on by default)
- Use Charging Detection (on by default)
- Use Health Data Recency (on by default)
- Nighttime window (only shown if no sleep schedule is set)

**Automatic (no settings needed):**
- Airplane Mode gate — always active
- Travel/timezone detection — always active

---

## Test Coverage

All logic has been verified with **402 automated test cases** covering:
- 24-hour sweeps for every hour of the day (with and without travel)
- Exact minute-boundary precision at bedtime and wake time
- Every combination of signals (Focus, charging, health data) at day and night
- Night worker schedules (sleep during the day)
- Emergency-must-fire scenarios (user collapses during the day)
- Emergency alerts that must NEVER be blocked
- Airplane mode gate at every combination of conditions
- Travel grace period with charging at every hour (24h sweep)
- Full flight scenario: NYC to London hour by hour
- Same-timezone domestic flights
- Individual toggle on/off combinations
- Borderline health data values
- Combined airplane + travel grace scenarios

The simulation runs in under 1 second and can be re-run anytime with:
```
node tests/deadmans-switch-simulation.js
```
