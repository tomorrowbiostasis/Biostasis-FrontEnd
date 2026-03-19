**Subject:** Biostasis Mobile App — Technical Audit Findings & Current Status

---

Hi Emil, Fernando,

I've completed a comprehensive technical audit of the Biostasis mobile application. I want to share the findings with you so we can align on priorities and next steps.

---

### Where the app stands today

The app is **not release-ready** in its current state. After going through the entire codebase — every screen, service, API call, navigation route, and background process — I've identified **118 issues**, of which **19 are critical** and **36 are high severity**.

The most important finding is this: **the core Dead Man's Switch doesn't fully work as intended.** The emergency screen that appears when the system can't verify the user is alive has no countdown timer. If the user is incapacitated and can't press a button, nothing happens — the emergency never auto-escalates. This defeats the fundamental purpose of the app.

---

### Top critical issues

Here's a summary of what needs immediate attention:

1. **No auto-escalation timer on the emergency screen** — if the user doesn't respond, the system just sits there. The emergency is never triggered automatically.

2. **Background services crash on fresh installs** — the code that runs bio-checks in the background will crash due to unsafe JSON parsing when storage is empty. This silently kills the automated emergency system.

3. **iOS is significantly broken** — the Google Fit health module is imported unconditionally and crashes on iOS. Push notification tokens are never registered for iOS users. Emergency dispatch on iOS has no retry mechanism.

4. **The emergency API silently swallows errors** — both the "start emergency" and "I'm alive" API calls use a configuration that treats all HTTP errors (400, 401, 500) as successful responses. A failed emergency start looks like a success to the app.

5. **Android Play Store will reject the app** — the target SDK version (33) is below Google's current requirement of 34+. The Google Fit API the app relies on was shut down by Google in 2024 and replaced by Health Connect.

6. **User medical data stored without encryption** — names, phone numbers, dates of birth, and medical conditions are stored in plain unencrypted storage, while auth tokens are correctly encrypted. For a health app, this is a compliance concern.

7. **axios (HTTP library) has known security vulnerabilities** — the app uses version 0.21.x which has multiple published CVEs.

---

### What's been done so far

During my initial work on the app, I've already:

- **Added a sleep schedule system** to prevent false alarms during sleep hours — this was the original issue where the switch was firing at 2 AM while the user was asleep with their phone off. The system now supports both automatic scheduling (bedtime/wake time) and integration into the bio-check and push notification services.

- **Built a comprehensive test simulation** (131 test cases) covering all edge cases of the Dead Man's Switch logic — sleep windows, time-based pauses, manual sleep mode, push notification suppression, bio data classification, and real-world scenarios.

- **Produced detailed documentation:**
  - Technical architecture document for the Dead Man's Switch
  - Business-friendly overview of how the switch works
  - Full mobile app audit report (118 findings, prioritized)
  - Git blame analysis tracing each bug to its author and commit

---

### Who introduced what

The git history tells a clear story:

- **The initial codebase** (July 2022) contains **14 critical/high bugs** that were never addressed — unsafe JSON parsing, missing error handling, broken async patterns, unencrypted PII, and the missing countdown timer. These are foundational issues.

- **The October 2023 feature push** introduced **7 additional critical/high bugs** — including a navigation call that fires as a side-effect every time a notification is constructed, and a code change that broke the emergency contact activation flow (it now always throws a TypeError).

- Across 151 commits and 4 years, **none of the original foundational bugs were ever fixed** by any contributor.

---

### Recommended path forward

I'd suggest we tackle this in tiers:

**Tier 1 — Safety-critical fixes (must-do before any release):**
- Add countdown timer to the emergency screen
- Fix the background service crashes
- Fix iOS: health data imports, push tokens, emergency retries
- Fix the API error handling on emergency endpoints
- Upgrade Android target SDK to 34+
- Migrate from Google Fit to Health Connect

**Tier 2 — Data integrity and reliability:**
- Encrypt user PII storage
- Fix broken Redux thunks (contact status, documents)
- Add 401 token expiry handling
- Fix the time-based trigger toggle bug (always writes "true")

**Tier 3 — UX and polish:**
- Add loading/error/empty states across screens
- Complete translations for all 5 languages
- Hide dev screens from production users
- Add confirmation dialogs for destructive actions

**Tier 4 — Technical debt:**
- Upgrade critical dependencies (axios, aws-amplify, NativeBase)
- Fix navigation type safety
- Add error boundaries
- Strip debug logging from production

---

### What I need from you

1. **Alignment on priorities** — do you agree with the tier ordering above? Is there anything you'd move up or down?
2. **Timeline expectations** — when is the next target release? That will help me scope what we can realistically fix.
3. **Backend access** — some of the fixes (especially around the emergency API and Health Connect migration) may need backend changes. Who should I coordinate with?

All the detailed reports are in the `docs/` folder of the repository:
- `mobile-app-audit-report.md` — full 118-issue audit
- `git-blame-analysis.md` — contributor responsibility breakdown
- `deadmans-switch.md` — technical documentation
- `deadmans-switch-overview.md` — business-friendly overview

Happy to walk through any of this in a call if that would be helpful.

Best,
Daniel
