# Biostasis FrontEnd — Full Technical Audit

**Date:** March 18, 2026
**Scope:** Architecture, code quality, UI, navigation, QA, performance, iOS native code
**Project:** React Native 0.76.7 / TypeScript 5.0.4 / iOS + Android

---

## A. Executive Summary

### Overall Health Score: 3.5 / 10

**Verdict:** The project is a functional MVP with serious structural, safety, and maintenance problems. For a life-safety application (biostasis emergency system), the code quality, error handling, and reliability are **unacceptable for production**. The core emergency paths — the most critical code in the entire app — have the worst error handling: swallowed exceptions, silent failures, guaranteed crash paths on corrupted data, and background tasks that terminate before async work completes.

### Biggest 5 Risks

| # | Risk | Severity |
|---|------|----------|
| 1 | **Emergency alarm can silently fail to play** — `Alert.service.ts` swallows the audio load error with a bare `return` | Critical |
| 2 | **Background tasks killed before work completes** — `BackgroundFetch.finish()` called synchronously while async BioCheck/emergency retry still runs | Critical |
| 3 | **`JSON.parse` crash paths throughout** — `helpers.ts`, `Background.service.ts`, `PushLogger.service.ts` all parse JSON with no try/catch, using `''` and `{}` object as fallbacks that throw `SyntaxError` | Critical |
| 4 | **iOS silent push notifications likely broken** — Swift `AppDelegate` (New Architecture) lacks Firebase config, push registration, and `didReceiveRemoteNotification` handler that the legacy Obj-C++ AppDelegate had | Critical |
| 5 | **`axios 0.21.x` has known SSRF vulnerability (CVE-2023-45857)** — outdated HTTP client in a production medical app | Critical |

### Biggest 5 Strengths

| # | Strength |
|---|----------|
| 1 | **Well-structured Redux layer** — clean slice/thunk/selector/extraReducer separation across all domains |
| 2 | **Good TypeScript baseline** — strict mode enabled, path aliases configured, core data models well-defined |
| 3 | **iOS native HealthKit integration** — properly uses observer queries, background delivery, and protocol-oriented architecture |
| 4 | **i18n framework in place** — translations cover all user-facing strings with proper key structure (5 languages defined) |
| 5 | **Background task architecture** — `react-native-background-fetch` is correctly configured with headless task support, retry mechanisms, and scheduled events |

---

## B. Architecture Findings

### What Is Good

- **Separation of concerns is attempted and mostly achieved.** Services, Redux slices, screens, components, hooks, and navigators each have their own directories.
- **Redux Toolkit usage is idiomatic.** Slices with typed hooks, async thunks, proper selector patterns.
- **iOS native code uses protocols and dependency injection.** `IManageHealthkit`, `IManageNetwork`, `IManagePersistentStorage` etc. allow testing and modularity.
- **Feature-based screen organization** with co-located styles and sub-components.

### What Is Problematic

1. **God components.** `Dashboard.tsx` (714 lines), `BioBasedTrigger.tsx` (653 lines), `Notification.service.ts` (429 lines), `EmergencyCountdown.tsx` (364 lines). These mix data fetching, business logic, and UI rendering in single files.

2. **Four styling solutions coexist.** NativeBase utility props, StyleSheet objects, inline styles, and NativeWind/Tailwind are all used, sometimes in the same component. No single source of truth.

3. **Two notification libraries.** `react-native-notifications` and `@notifee/react-native` both exist in dependencies. Code uses `@notifee` primarily but imports from both.

4. **No error boundaries.** A safety-critical app with zero React error boundaries. Any unhandled JS exception kills the entire UI.

5. **Side effects in Redux reducers.** `ToastService.error()` and `console.log()` are called inside extraReducers across auth, user, emergencyContacts, and automatedEmergency slices. Reducers must be pure.

6. **Fragile native/JS bridge.** `PersistentStorageManager.swift` directly accesses `RNCAsyncStorage` internals to read React Native's AsyncStorage from native Swift. Any library update can break this.

7. **Two AppDelegate files.** `ios/AppDelegate.swift` (New Architecture, active) and `ios/Biostasis/AppDelegate.mm` (legacy, likely inactive). The Swift version lacks Firebase, push handling, and splash screen setup.

### What Should Be Refactored First

1. Fix the AppDelegate — consolidate into the Swift version with full push/Firebase support
2. Wrap all `JSON.parse` calls in try/catch with fallback values
3. Await async operations in `BackgroundFetch.finish()` before calling finish
4. Add React error boundaries at screen and app level
5. Upgrade `axios` to 1.x (security fix)

---

## C. React Native Findings

| Issue | Severity | File(s) | Fix |
|-------|----------|---------|-----|
| `BackgroundFetch.finish()` called before async work completes | Critical | `Background.service.ts:108` | Await async operations before calling finish |
| `JSON.parse(data ?? '')` crashes on null/missing data | Critical | `AsyncStorage.service/helpers.ts:8` | Add try/catch with default return |
| `JSON.parse(response ?? '')` then `JSON.parse(responseParse?.user ?? {id: ''})` — second parse receives an object, not string | Critical | `Background.service.ts:180-181` | Fix to provide string fallback, add try/catch |
| `navigate()` called at notification-build time (runs immediately, not on press) | Critical | `Notification.service.ts:220,273` | Move navigation into press handler callback |
| `validateStatus: () => true` silently accepts all HTTP errors for `startEmergency` and `positiveInfo` | Critical | `API.service.ts:114,127` | Remove or add explicit status checking |
| Emergency alarm load error silently dropped | Critical | `Alert.service.ts:7` | Log error, show notification, retry |
| `state.patchLoading;` is a no-op — patchLoading never resets on rejection | Critical | `automatedEmergency/extraReducers.ts:92` | Change to `state.patchLoading = false;` |
| `error.response.data.error` crashes on network errors (no `.response`) | Critical | `user/thunks.ts:30-33`, `emergencyContacts/thunks.ts:74-76` | Add optional chaining or check |
| `updateActiveEmergencyContactStatus` returns consumed `.then()` result | Critical | `emergencyContacts/thunks.ts:29-53` | Restructure to async/await |
| `state.pending = false` in pending handler (should be `true`) | High | `emergencyContacts/extraReducers.ts:116` | Fix to `state.pending = true` |
| AbortController created but signal never passed to any operation | High | `Dashboard.tsx`, `AutomatedSystemListener.tsx` | Either use the signal or remove the controller |
| `useDidUpdateEffect` doesn't propagate cleanup functions | High | `UseDidUpdateEffect.ts` | Return func() result from effect |
| `unowned` references in Swift managers instead of `weak` | High | `HealthKitManager.swift`, `HealthKitDataHandler.swift` | Change to `weak` |
| Unbounded `@AllBioData` growth in UserDefaults | High | `HealthKitDataHandler.swift` | Add cap (e.g. last 1000 entries) |
| `URLSession.shared.configuration` modifications have no effect | High | `NetworkingManager.swift:58-60` | Create custom URLSession with proper config |
| PushLogger unbounded log growth in AsyncStorage | High | `PushLogger.service.ts` | Add max log cap |
| Logger overrides global `console` methods and stores every log in AsyncStorage with unique keys | High | `Logger.service.ts` | Add rotation, cap total keys |
| Data race in `hasRecentData` mutated from concurrent HealthKit callbacks | High | `BackgroundHealthChecker.swift` | Use serial queue or actor |
| Dev log screens visible to production users | Medium | `DrawerContent.tsx:181-203` | Gate behind `__DEV__` or `EnvConfig.DEV` |
| FCM token logged to console | Medium | `Push.service.ts:23` | Remove sensitive log |
| All notification channels named "Biostasis" | Medium | `notification.constants.ts` | Give distinct names |
| `Dimensions.get()` at module level — won't update on rotation | Medium | `AuthScreen.tsx`, `dimensions.tsx` | Use `useWindowDimensions` hook |
| Mixed `async/await` and `.then().catch()` patterns | Medium | Throughout services and thunks | Standardize on async/await |
| `isNowPaused` useMemo uses `new Date()` but only re-evaluates on state change | Medium | `AutomatedSystemListener.tsx` | Add interval-based refresh |

---

## D. Styling / CSS Findings

### What Is Clean

- Theme directory exists with color palette, font config, and NativeBase component overrides.
- `boxShadow.ts` provides a reusable shadow pattern.
- `colorOpacity.ts` utility is well-written.

### What Is Inconsistent or Weak

1. **No semantic color tokens.** Colors are referenced as `colors.gray[632]` with non-standard shade numbers (150, 350, 375, 625, 632, 642, 650). No `primary`, `danger`, `textPrimary`, `background` aliases.

2. **Magic number padding/margins everywhere.** `paddingTop: 145`, `paddingTop: 65`, `top: 100`, `marginLeft: '25%'`, `height: 100`. No spacing scale, no responsive sizing.

3. **Hardcoded hex colors outside theme.** `'#F4BB44'`, `'#4682B4'`, `'#1a1a3e'` used directly in JSX.

4. **No design system components.** No standardized `Card`, `Panel`, `Divider`, `SectionHeader`, `ExpandableSection` despite these patterns appearing in 5+ screens.

5. **Three styling paradigms mixed freely.** NativeBase props (`fontSize="xl"`, `py={5}`), `StyleSheet.create()`, and inline `style={{}}` objects — sometimes all in the same component.

6. **No typography hierarchy.** `globalTextStyles.ts` has only 2 styles (`titleMedium`, `textMedium`). No heading scale, no caption/label/body variants.

7. **No accessibility.** Zero `accessibilityLabel`, `accessibilityRole`, or `accessibilityHint` on any interactive element in the entire app.

### Priority Improvements

1. Create semantic color tokens (`primary`, `danger`, `success`, `textPrimary`, `textSecondary`, `background`, `surface`, `border`)
2. Establish a spacing scale (4, 8, 12, 16, 24, 32, 48, 64) and replace all magic numbers
3. Pick one styling approach (recommend StyleSheet + theme tokens) and migrate
4. Add accessibility labels to all buttons and interactive elements
5. Extract reusable `Panel`, `Divider`, `SectionHeader` components

---

## E. Module-by-Module Audit

### Dashboard
- **Purpose:** Main screen — emergency button, system status, sleep mode, health data display
- **Status:** Risky
- **Findings:** 714-line god component. 7 useEffects, 8 useCallbacks. Health data listener with complex filtering logic doesn't belong in a screen. ~90 lines of commented-out code. Unused AbortController. Multiple `as never` casts. Hardcoded colors.
- **Fix:** Extract health data logic to a custom hook. Extract emergency panel, sleep panel, and status panels into separate components. Remove dead code.

### Automated Emergency Settings
- **Purpose:** Configure bio-based and time-based emergency triggers
- **Status:** Risky
- **Findings:** `BioBasedTrigger.tsx` is 653 lines. Massive iOS/Android code duplication (100+ lines nearly identical). `renderDescription()`/`renderSettings()` are render-methods-as-callbacks (anti-pattern). `TimeBasedTrigger` wraps a `TouchableOpacity` inside a `<Text>` (invalid nesting on Android).
- **Fix:** Extract shared platform logic. Convert render methods to proper components.

### Authentication (Login/Register)
- **Purpose:** Email/password and social sign-in/sign-up
- **Status:** Acceptable
- **Findings:** `AuthScreen` has abandoned swiper scroll ref (dead code). Login doesn't wrap `onSignInPress` in useCallback. Register is clean. AWS Amplify 4.x is EOL.
- **Fix:** Remove dead swiper code. Plan Amplify migration.

### Emergency Countdown
- **Purpose:** Manual emergency button with hold-to-trigger and cancel flows
- **Status:** Risky
- **Findings:** 365-line component with 10+ state variables. Manual state machine with if-chains. Multiple `eslint-disable` for exhaustive-deps (stale closure risk). `resetEmergencyTimer` suppresses `reset` dependency.
- **Fix:** Extract state machine to a reducer. Reduce eslint suppressions.

### Health Condition Error Screen
- **Purpose:** "Are you OK?" prompt shown when bio check fails or push notification arrives
- **Status:** Acceptable
- **Findings:** `params.healthCheck` accessed without optional chaining (line 71) while `params?.regularCheck` uses it (line 96) — inconsistent and crash-prone.
- **Fix:** Add optional chaining consistently.

### Emergency Contacts
- **Purpose:** CRUD for emergency contacts, documents, and messages
- **Status:** Acceptable
- **Findings:** Well-decomposed into sub-components. Main risk is in the Redux thunks (crash-prone error handling, consumed `.then()` chain returning undefined).
- **Fix:** Fix thunk error handling.

### Background Service
- **Purpose:** Background fetch scheduling, emergency retry, location updates
- **Status:** Broken
- **Findings:** `BackgroundFetch.finish()` called before async work completes (kills tasks). Double `JSON.parse` guaranteed crash. Emergency retry swallows errors. Fire-and-forget schedule in timeout handler.
- **Fix:** Await all async operations before finish(). Fix JSON.parse. Add error recovery.

### Notification Service
- **Purpose:** Create and manage Android/iOS notifications
- **Status:** Broken
- **Findings:** `navigate()` called at notification-build time, not press time (lines 220, 273). 429-line function with heavy duplication. Mixed async patterns. `systemReset` not awaited.
- **Fix:** Move navigation to press handlers. Extract notification types into separate factory functions.

### Sleep Schedule Service
- **Purpose:** Manage sleep mode to prevent false alarms
- **Status:** Good
- **Findings:** Clean, well-typed, good error handling with fallbacks. Minor edge case in wake time logic.
- **Fix:** None critical.

### iOS Native Layer
- **Purpose:** HealthKit monitoring, silent push handling, background health checking
- **Status:** Risky
- **Findings:** Unbounded UserDefaults growth. `unowned` crash risk. URLSession config bug (no-op). Data race in BackgroundHealthChecker. Two AppDelegate files with critical functionality split between them.
- **Fix:** Fix AppDelegate consolidation. Cap data storage. Change `unowned` to `weak`. Fix URLSession config.

---

## F. Broken / Dead / Incomplete Items

### Dead Code
- `Dashboard.tsx`: ~90 lines of commented-out JSX (lines 598-686)
- `AuthScreen.tsx`: Swiper ref and scroll logic — abandoned tab implementation
- `Notification.service.ts`: Several commented-out notification configurations
- `AutomatedSystemListener.tsx`: Commented-out block (lines 132-137)
- `BLEManager.swift`: Stub file with no functional scanning
- `HealthKitManager.swift`: `logToFile` method never called
- `NetworkingManager.swift`: `lastHealthKitUpdate` fetched but never used in `sendPositiveUpdateToServer`
- `i18n.ts`: 4 language imports commented out (de, es, fr, it)
- `language.constants.ts`: Lists 5 languages but only English is loaded
- `redux-flipper`: In dependencies but Flipper was removed from RN 0.73+
- `react-native-splash-screen`: Doesn't support New Architecture

### TODOs and Incomplete Items
- `UseAppTranslation.hook.ts`: TODO to create bridge for iOS AsyncStorage access
- `Input.tsx`: Hack with empty fragment for InputRightElement placeholder
- `AuthInput.tsx` line 39: TODO about icon not matching mockups
- `user/thunks.ts`: `FIXME: handle catch and schedule retries`
- `AutomatedEmergencySettingsScreen`: `pointerEvents` uses deprecated React Native API

### Unused Files
- `components/Readme.md`, `services/Readme.md`, `screens/Readme.md`, `constants/ReadMe.md`, `navigators/ReadMe.md`, `hooks/Readme.md` — stub readme files with no useful content
- `ios/File.swift` — empty/placeholder file in iOS project root
- `ClearData.types.ts` — type definitions imported only from store utils

### Dead Routes / Screens
- `'Void'` screen in SignUpStack — hack to prevent content flash
- `DevLogs`, `DevHistoryLogs`, `DevPushLogs` — visible to production users (should be dev-only)

### Missing Actions
- Emergency cancellation failure has no user feedback (handlers are no-ops)
- `LostConnectionScreen` airplane mode check never refreshes after mount
- No retry mechanism for failed alarm sound loading

---

## G. QA Issues

### Likely Bugs (Confirmed)

1. **`state.patchLoading;` no-op** — `automatedEmergency/extraReducers.ts:92`. Loading state stuck forever on rejection.
2. **`state.pending = false` in pending handler** — `emergencyContacts/extraReducers.ts:116`. Should be `true`.
3. **`navigate()` at build time** — `Notification.service.ts:220,273`. Navigates immediately instead of on press.
4. **`JSON.parse('')` crash** — `helpers.ts:8`. Called from BioCheck and Push services on every cycle.
5. **`JSON.parse({id: ''})` crash** — `Background.service.ts:181`. Passes object to JSON.parse.
6. **`URLSession.shared.configuration` no-op** — `NetworkingManager.swift:58-60`. Timeout and connectivity settings never applied.
7. **Stale log in hook** — `UseGoogleFitAuthStatus.hook.ts:22`. Always logs `false` regardless of actual state.

### Edge Cases

- Sleep mode wake time doesn't account for bedtime being tomorrow
- `isPausedTime` complex weekday logic has no test coverage — midnight crossing and week wrapping are high-risk
- `CancelEmergencyPopup` polls every 15 minutes — can miss a 14-minute window
- `isNowPaused` useMemo goes stale (only recalculates on Redux state change, not time passing)

### Missing Validations

- Env vars asserted as strings but can be undefined at runtime (`Env.service.ts`)
- Push message handler receives entirely untyped `{data: any; notification?: any}`
- `Time.service.ts` `isPausedTime` has all `any` parameters — no type checking on the most critical time logic
- No validation on parsed AsyncStorage JSON data shapes
- `positiveInfoPeriod` can be undefined when passed to API

### Crash Risks

- **`error.response.data.error`** in thunk catch blocks — crashes on network errors with no `.response`
- **`unowned` references** in Swift — crash if delegate deallocated
- **Corrupted AsyncStorage** — any invalid JSON crashes the entire background flow
- **`params.healthCheck`** accessed without optional chaining on HealthConditionErrorScreen

### Missing States

- No loading states on emergency contact deletion
- No error state when alarm fails to play
- No empty state for documents list
- No offline indicator in main UI
- Emergency cancellation failure is silently ignored

---

## H. Priority Action Plan

### Critical Fixes — Do Now

1. **Fix `JSON.parse` crash paths** — Add try/catch with default returns in `helpers.ts`, `Background.service.ts`, `PushLogger.service.ts`
2. **Fix `BackgroundFetch.finish()` timing** — Await async operations before calling finish
3. **Fix iOS AppDelegate** — Consolidate Swift AppDelegate with Firebase, push notification, and splash screen setup
4. **Upgrade `axios`** to 1.x (security CVE)
5. **Fix `state.patchLoading;` no-op** — Change to `state.patchLoading = false`
6. **Fix `state.pending = false` in pending handler** — Change to `true`
7. **Fix `navigate()` in Notification.service.ts** — Move to press handler
8. **Fix emergency alarm error handling** — Log, notify, retry on load failure
9. **Fix `error.response.data.error` crash** — Add optional chaining in all thunk catch blocks
10. **Fix `URLSession.shared.configuration` no-op** in NetworkingManager.swift

### Important Fixes — Do Next

1. **Add React error boundaries** at app and screen level
2. **Cap unbounded storage growth** — `@AllBioData` in UserDefaults, PushLogger, Logger service
3. **Fix `unowned` → `weak`** in Swift managers
4. **Move side effects out of Redux reducers** — Toast calls into thunks/middleware
5. **Fix navigation types** — Align `Screens` enum values with `ParamList` types to eliminate `as never` casts
6. **Upgrade `@types/react-native`** to match RN 0.76
7. **Gate dev screens** behind `__DEV__`
8. **Remove `console.log` of FCM tokens** and sensitive data
9. **Fix data race** in `BackgroundHealthChecker.swift`
10. **Fix `updateActiveEmergencyContactStatus`** thunk — restructure consumed `.then()` chain

### Nice-to-Have Cleanup — Later

1. Break up god components (Dashboard, BioBasedTrigger, EmergencyCountdown)
2. Establish semantic design tokens and spacing scale
3. Pick one styling paradigm and migrate
4. Add accessibility labels throughout
5. Remove dead code, commented-out blocks, and unused files
6. Standardize on async/await (remove `.then()` chains)
7. Add unit tests for time/pause logic
8. Plan migration off deprecated libraries (NativeBase → gluestack, aws-amplify v4 → v6, react-native-google-fit → Health Connect)
9. Implement proper notification channel names for Android
10. Add log rotation and size caps

---

## I. Final Verdict

### Is this codebase acceptable for production?

**No.** Not in its current state for a life-safety application. The emergency system — the core value proposition — has multiple paths where errors are silently swallowed, background tasks are killed prematurely, and JSON parse failures crash the entire flow. The iOS silent push handling may be broken after the New Architecture migration. An outdated HTTP client has known security vulnerabilities.

For a normal consumer app, this would be a shippable MVP with significant tech debt. For an app that people depend on to trigger emergency protocols when they're incapacitated, the reliability bar must be much higher.

### What Would Block Release?

1. The `JSON.parse` crash paths in the background task pipeline (guaranteed crashes on null data)
2. The `BackgroundFetch.finish()` timing issue (tasks killed before emergency logic completes)
3. The iOS AppDelegate situation (silent push notifications potentially non-functional)
4. `axios 0.21.x` CVE (security vulnerability in a medical app)
5. Emergency alarm silently failing to load

### What Should Be Restructured Before Scaling?

1. **Error handling architecture** — Implement a centralized error handler with Crashlytics integration. Every catch block should report, not swallow.
2. **Background task lifecycle** — Proper async completion with timeout handling before `finish()`
3. **Native/JS bridge** — Replace direct AsyncStorage internal access with a proper native module
4. **Styling system** — Consolidate to one approach with semantic tokens before adding more screens
5. **Navigation types** — Fix the root cause (`Screens` enum values) to eliminate all `as never` casts
6. **Testing** — The time/pause logic, emergency escalation flow, and sleep schedule have zero visible test coverage for the most complex code paths

---

## Top 10 Fixes by Impact

| Rank | Fix | Impact | Effort |
|------|-----|--------|--------|
| 1 | Fix all `JSON.parse` crash paths (try/catch + defaults) | Prevents guaranteed crashes in core flow | Low |
| 2 | Fix `BackgroundFetch.finish()` to await async work | Background tasks actually complete | Low |
| 3 | Consolidate iOS AppDelegate with push/Firebase support | Silent push notifications work on iOS | Medium |
| 4 | Upgrade `axios` to 1.x | Closes security vulnerability | Low |
| 5 | Fix `navigate()` in Notification.service.ts | Notifications work correctly instead of navigating at build time | Low |
| 6 | Fix alarm error handling in Alert.service.ts | Emergency alarm reliably plays | Low |
| 7 | Fix Redux state bugs (patchLoading no-op, pending=false) | UI reflects actual state | Low |
| 8 | Add optional chaining to thunk error handlers | Prevents crashes on network errors | Low |
| 9 | Add React error boundaries | App survives JS exceptions | Low |
| 10 | Fix URLSession.shared.configuration in NetworkingManager.swift | iOS native networking timeouts actually work | Low |

---

## Quick Wins (Easy + High Value)

| Fix | Time | Value |
|-----|------|-------|
| `state.patchLoading = false;` (1 character fix) | 1 min | Fixes stuck loading state |
| `state.pending = true;` in pending handler | 1 min | Fixes wrong loading state |
| Add try/catch around `JSON.parse` in `helpers.ts` | 5 min | Prevents crash in every BioCheck cycle |
| Add `?.` to `error.response.data.error` in thunks | 5 min | Prevents crash on network errors |
| Gate dev screens behind `__DEV__` | 5 min | Hides debug tools from users |
| Remove `console.log` of FCM token | 1 min | Security improvement |
| `yarn upgrade axios` | 2 min | Closes CVE |
| Fix `BackgroundFetch.finish()` with await | 10 min | Background tasks complete reliably |
| Add `weak` instead of `unowned` in Swift | 5 min | Prevents potential crashes |
| Cap `PushLogger` array size | 5 min | Prevents unbounded storage growth |
