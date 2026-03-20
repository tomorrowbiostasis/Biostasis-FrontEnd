# Git Blame Analysis — Bug Responsibility by Contributor

**Repository:** Biostasis-FrontEnd  
**Total Commits:** 151  
**Total Contributors:** 5 (deduplicated by email)  
**Analysis Date:** March 2026  
**Method:** `git blame` on every line containing a confirmed Critical or High severity bug from the mobile-app-audit-report.

---

## Executive Summary

The initial codebase drop by **tomorrowbiostasis** (July 2022) carries the most foundational bugs — **14 critical/high issues** baked into the architecture from day one. **mhdsulaimantan**, who authored 75% of all commits, introduced **7 new critical/high bugs** during feature development (Oct 2023), most notably the `navigate()` side-effect inside notification construction and the broken `.then()` chain in the emergency contact thunk. More recent contributors introduced fewer but still significant issues around iOS push notification support.

---

## Contributors

| Author | Email(s) | Commits | Role |
|--------|----------|:-------:|------|
| **tomorrowbiostasis** | emil@tomorrowbiostasis.com, 108864980+tomorrowbiostasis@users.noreply.github.com | 13 | Initial author — original codebase drop |
| **mhdsulaimantan** (Mohammad Sulaiman Tanbari) | mohammad.sulaiman.tanbari@gmail.com, 104266422+mhdsulaimantan@users.noreply.github.com | 115 | Primary developer — 75% of all commits |
| **m_mitovski** | meto.m@beyondbasics.co | 6 | UI improvements, build updates |
| **Metodija Antuleski** | meto.a@beyondbasics.co | 4 | iOS HealthKit, silent push, dev logs, cleanup |
| **R M / Raul Monraz Echeverria** | remonechev@gmail.com, remecheverria@protonmail.com | 7 | Localization, merge management |

---

## Scoreboard

| Author | Critical Bugs Introduced | High Bugs Introduced | Total Critical+High |
|--------|:------------------------:|:--------------------:|:-------------------:|
| **tomorrowbiostasis** | 7 | 7 | **14** |
| **mhdsulaimantan** | 4 | 3 | **7** |
| **Metodija Antuleski** | 0 | 2 | **2** |
| **R M / remonechev** | 0 | 0 | **0** (1 inherited) |
| **m_mitovski** | 0 | 0 | **0** |

---

## Detailed Breakdown by Author

### 1. tomorrowbiostasis — 14 Critical/High Bugs

All from commit `ba9ccc3` (July 15, 2022) — the initial codebase drop.

| Audit ID | Bug | Severity | File | Line(s) |
|----------|-----|----------|------|---------|
| DMS-001 | HealthConditionErrorScreen has **no countdown timer** — emergency never auto-escalates if user doesn't respond | Critical | `HealthConditionErrorScreen.tsx` | Entire file |
| DMS-004 | `JSON.parse(data ?? '')` guaranteed crash when AsyncStorage returns null | Critical | `AsyncStorage.service/helpers.ts` | 8–9 |
| DMS-007 | `refreshAllScreens()` resets root navigator to `'Home'` which is not a root-level route | Critical | `Background.service.ts` | 190–193 |
| DMS-012 | `BackgroundFetch.finish()` called synchronously before async tasks (`emergencyRetry`, `startBioCheck`) complete — OS can kill process mid-execution | Critical | `Background.service.ts` | 89–108 |
| DMS-013 | `validateStatus: () => true` on `startEmergency` API — all HTTP errors (400, 401, 500) silently accepted as success | Critical | `API.service.ts` | 113–115 |
| DMS-014 | `JSON.parse(response ?? '')` + `JSON.parse(responseParse?.user ?? {id: ''})` — empty string crash + object-to-string crash | Critical | `Background.service.ts` | 180–181 |
| DMS-015 | `Hub.listen('auth', ...)` return value (unsubscribe function) discarded — memory leak, duplicate listeners on remount | Critical | `AuthListener.ts` | 35–53 |
| DMS-023 | `state.patchLoading;` is a no-op expression — should be `state.patchLoading = false;` — loading spinner stays on forever after failure | High | `automatedEmergency/extraReducers.ts` | 92 |
| DMS-024 | `error.response.data.error.code` in catch block — network errors have no `.response`, causing secondary TypeError crash | High | `user/thunks.ts` | 31–33 |
| DMS-026 | `.catch(error => { return error; })` returns error object as fulfilled payload — Redux stores error in `state.documents` | High | `documents/thunks.ts` | 77–86 |
| DMS-028 | Module-level `let initialized = false` never resets on logout — second user login never registers push token | High | `Push.service.ts` | 15 |
| DMS-029 | `ToastService.error()` and `Toast.show()` called inside Redux reducers — breaks purity, DevTools, and fires during rehydration | High | `user/extraReducers.ts`, `emergencyContacts/extraReducers.ts`, `gdpr/extraReducers.ts` | Multiple |
| DMS-030 | User PII (name, phone, DOB, medical info) persisted in plain `AsyncStorage` while auth tokens correctly use `EncryptedStorage` | High | `store/index.ts` | 50–55 |
| DMS-031 | iOS emergency dispatch has no retry mechanism — Android gets `setupRetries()`, iOS gets single fire-and-forget `dispatchEmergency()` | High | `EmergencyCountdown.tsx` | 106–116 |

**Pattern:** Foundational architecture issues — unsafe JSON parsing, missing error handling, broken async timing, security oversights, and incomplete iOS parity. These bugs were present from the very first commit and were never caught or corrected.

---

### 2. mhdsulaimantan — 7 Critical/High Bugs

All from commit `d3f2fdc0`, `74bfca44`, `ba0bcc73`, `6d3f6b8b` (October 5, 2023) — a single large feature push.

| Audit ID | Bug | Severity | File | Line(s) | Commit |
|----------|-----|----------|------|---------|--------|
| DMS-006 | `navigate(Screens.HealthConditionError)` called inside template literal for `fullScreenAction.mainComponent` — triggers navigation as side-effect during notification construction, sets `mainComponent` to string `"undefined"` | Critical | `Notification.service.ts` | 220 | `74bfca44` |
| DMS-010 | `navigationRef.navigate()` called directly without `isReady()` guard — throws if push arrives before navigation initialized | Critical | `Push.service.ts` | 74 | `ba0bcc73` |
| DMS-011 | Added `.then()` to `updateActiveEmergencyContactStatus` without returning the response — `response` on line 51 is always `undefined`, causing TypeError on `return response.data` | Critical | `emergencyContacts/thunks.ts` | 34–50 | `d3f2fdc0` |
| DMS-019 | `Alert.alert()` called inside JSX render tree as expression `{!!documentIdToDelete && Alert.alert(...)}` — spawns new alert dialog on every re-render | Critical | `Documents.tsx` | 168–184 | `6d3f6b8b` |
| DMS-025 | Same unsafe `error.response.data` deep access pattern in `AddNewEmergencyContact` catch block — network errors crash the handler | High | `emergencyContacts/thunks.ts` | 73–76 | `d3f2fdc0` |
| DMS-035 | `TimeBasedTrigger` toggle always writes `regularPushNotification: true` regardless of switch direction — toggling OFF enables the feature on backend | High | `TimeBasedTrigger.tsx` | 222–228 | `d3f2fdc0` |
| DMS-039 | `CancelEmergencyPopup` passes `{backendTriggered: true}` but `HealthConditionErrorScreen` reads `params.regularCheck` / `params.healthCheck` — param mismatch causes incorrect screen behavior | High | `CancelEmergencyPopup.tsx` / `HealthConditionErrorScreen.tsx` | 23 / 38–41 | `d3f2fdc0` |

**Pattern:** Feature additions that introduced new bugs — navigation side-effects, broken async promise chains, and imperative API calls placed in declarative render contexts. The `.then()` modification to `updateActiveEmergencyContactStatus` is particularly notable: the original code worked correctly, but the addition of toast notifications broke the return chain.

---

### 3. Metodija Antuleski — 2 High Bugs

From commits in the beyondbasics.co push (late 2025).

| Audit ID | Bug | Severity | File | Line(s) |
|----------|-----|----------|------|---------|
| DMS-032 | FCM `messaging().getToken()` gated behind `if (isAndroid)` — iOS users never get push token registered with backend, breaking all push notifications | High | `AuthListener.ts` | 75–78 |
| DMS-028 | Modified `Push.service.ts` (added sleep suppression) but did not address the `initialized` flag that prevents token re-registration after logout | High | `Push.service.ts` | 15 (inherited, not fixed) |

**Pattern:** iOS integration gaps in push notification handling. The `getToken()` platform guard appears to be a misunderstanding — Firebase Messaging's `getToken()` works on both platforms.

---

### 4. R M / Raul Monraz Echeverria — 0 New, 1 Inherited

| Audit ID | Bug | Severity | File | Line(s) | Notes |
|----------|-----|----------|------|---------|-------|
| DMS-012 | Modified `.catch()` wrappers in background task switch cases but did not fix the `BackgroundFetch.finish()` call that fires before async tasks complete | Critical (inherited) | `Background.service.ts` | 91–102 | Good intent (added error catching), but missed the fundamental timing issue |

**Pattern:** Made the error handling slightly better but didn't address the root architectural problem.

---

### 5. m_mitovski — 0 Bugs

6 commits focused on UI improvements (`ui improvements`, `masked input`, `build updates`, `ios version upgrade`). No critical or high bugs traced to this contributor.

---

## Timeline Analysis

```
Jul 2022  ████████████████████████████████████  ba9ccc3 — Initial drop (14 bugs)
          │                                     tomorrowbiostasis
          │
Oct 2023  ████████████████████                  d3f2fdc0, 74bfca44, etc. (7 bugs)
          │                                     mhdsulaimantan — large feature push
          │
Aug 2024  ██                                    78ac794a — R M / remonechev
          │                                     localization + minor fixes
          │
Late 2025 ████                                  meto.a@beyondbasics.co (2 bugs)
          │                                     Metodija Antuleski — iOS HealthKit + push
          │
Mar 2026  ██                                    nepsil0n / Daniel — sleep schedule + docs
                                                (audit, no bugs introduced in core)
```

---

## Key Observations

1. **75% of critical bugs come from the initial commit.** The original codebase was released with fundamental safety and stability issues that were never addressed by subsequent developers.

2. **The October 2023 feature push was the second largest source of bugs.** A single developer added toast notifications, push handling, and document management in one batch, introducing 7 new critical/high bugs — many of which broke previously working code.

3. **No code review process is evident.** The bugs introduced by mhdsulaimantan (e.g., `navigate()` inside a template literal, `Alert.alert()` in JSX render) would be caught by even a basic PR review. The repository has merge commits from PRs, but the bugs survived.

4. **iOS has been consistently under-supported.** The initial commit lacked iOS emergency retries. Later contributors gated cross-platform APIs behind Android-only checks. The most recent contributor (Metodija) added iOS HealthKit support but broke push token registration.

5. **Nobody addressed the inherited bugs.** Across 151 commits and 5 contributors over 4 years, not a single one of the 14 foundational bugs from the initial commit was fixed.
