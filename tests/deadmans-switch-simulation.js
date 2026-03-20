#!/usr/bin/env node

/**
 * Dead Man's Switch — Edge Case Simulation
 *
 * Standalone test runner (no Jest dependency). Extracts pure logic from the
 * production services and exercises every decision branch with time-controlled
 * scenarios. Run with: node tests/deadmans-switch-simulation.js
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let currentGroup = '';

function group(name) {
  currentGroup = name;
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  ${name}`);
  console.log(`${'═'.repeat(70)}`);
}

function assert(label, actual, expected) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅  ${label}`);
  } else {
    failed++;
    console.log(`  ❌  ${label}`);
    console.log(`       expected: ${expected}, got: ${actual}`);
  }
}

function summary() {
  console.log(`\n${'─'.repeat(70)}`);
  const total = passed + failed;
  if (failed === 0) {
    console.log(`  ALL ${total} TESTS PASSED`);
  } else {
    console.log(`  ${passed}/${total} passed, ${failed} FAILED`);
  }
  console.log(`${'─'.repeat(70)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// ─── Extracted Logic (mirrors production code exactly) ──────────────────────

// From Time.service.ts
function pseudoTime(time) {
  const date = new Date(time);
  return date.getHours() * 100 + date.getMinutes();
}

function isPausedTime(givenDate, pausedDate, specificPausedTimes) {
  const timestamp = +new Date(givenDate);

  if (timestamp < pausedDate?.timestamp) {
    return true;
  }

  return specificPausedTimes.some(pausedTime => {
    const { isActive, startTime, endTime, startDay, endDay } = pausedTime;
    const startingWeekDay = startDay[0];
    const endingWeekDay = endDay[endDay.length - 1];
    const startingHour = pseudoTime(startTime);
    const endingHour = pseudoTime(endTime);
    const givenWeekDay = givenDate.getDay();
    const givenHour = pseudoTime(timestamp);

    if (isActive) {
      let dayMatch = false;
      let hourMatch = false;

      if (startDay.length === 7) {
        dayMatch = true;
        if (givenHour >= startingHour && givenHour < endingHour) {
          hourMatch = true;
        }
      } else if (startingWeekDay === endingWeekDay) {
        if (givenWeekDay === startingWeekDay) {
          dayMatch = true;
          if (givenHour >= startingHour && givenHour < endingHour) {
            hourMatch = true;
          }
        }
      } else if (startingWeekDay < endingWeekDay) {
        if (givenWeekDay > startingWeekDay && givenWeekDay < endingWeekDay) {
          dayMatch = true;
          hourMatch = true;
        } else if (givenWeekDay === startingWeekDay) {
          dayMatch = true;
          if (givenHour >= startingHour) hourMatch = true;
        } else if (givenWeekDay === endingWeekDay) {
          dayMatch = true;
          if (givenHour < endingHour) hourMatch = true;
        }
      } else {
        // wraps around (e.g. Fri–Mon)
        if (givenWeekDay > startingWeekDay || givenWeekDay < endingWeekDay) {
          dayMatch = true;
          hourMatch = true;
        } else if (givenWeekDay === startingWeekDay) {
          dayMatch = true;
          if (givenHour >= startingHour) hourMatch = true;
        } else if (givenWeekDay === endingWeekDay) {
          dayMatch = true;
          if (givenHour < endingHour) hourMatch = true;
        }
      }

      return dayMatch && hourMatch;
    }
    return false;
  });
}

// From SleepSchedule.service.ts
function isWithinSleepWindow(schedule, fakeNow) {
  const now = fakeNow;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const bedtimeMinutes = schedule.bedtimeHour * 60 + schedule.bedtimeMinute;
  const wakeMinutes = schedule.wakeHour * 60 + schedule.wakeMinute;

  if (bedtimeMinutes < wakeMinutes) {
    return currentMinutes >= bedtimeMinutes && currentMinutes < wakeMinutes;
  }
  return currentMinutes >= bedtimeMinutes || currentMinutes < wakeMinutes;
}

function isSleepPaused(schedule, fakeNow) {
  if (!schedule.enabled) {
    return false;
  }
  return isWithinSleepWindow(schedule, fakeNow);
}

function formatTime(hour, minute) {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
}

// From Recommendation.service.ts
function findNearestGreaterValue(longestPeriod) {
  const intervalValues = [3, 6, 9, 12, 18, 24, 36, 48]; // hours from settings.constants
  let nearestValue = intervalValues[intervalValues.length - 1];
  for (const value of intervalValues) {
    if (value >= longestPeriod) {
      nearestValue = value;
      break;
    }
  }
  return nearestValue;
}

// From DeviceSignals.service.ts — smart detection logic
function isInNighttimeWindow(schedule, settings, fakeNow) {
  const current = fakeNow;
  const currentMinutes = current.getHours() * 60 + current.getMinutes();
  let startMinutes, endMinutes;

  if (schedule && schedule.enabled) {
    startMinutes = schedule.bedtimeHour * 60 + schedule.bedtimeMinute - 60;
    endMinutes = schedule.wakeHour * 60 + schedule.wakeMinute + 60;
    if (startMinutes < 0) startMinutes += 1440;
    if (endMinutes >= 1440) endMinutes -= 1440;
  } else {
    startMinutes = settings.nighttimeStartHour * 60 + settings.nighttimeStartMinute;
    endMinutes = settings.nighttimeEndHour * 60 + settings.nighttimeEndMinute;
  }

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

function shouldSmartDetectionPause(settings, signals, schedule, fakeNow) {
  if (!settings.enabled) return false;

  if (settings.useFocusDetection && signals.isFocusActive) return true;

  // Travel grace period expands nighttime to 24h (jet lag protection)
  const nighttime = signals.isInTravelGracePeriod || isInNighttimeWindow(schedule, settings, fakeNow);

  if (settings.useChargingDetection && signals.isCharging && nighttime) return true;

  if (settings.useHealthDataRecency && signals.isHealthDataStale) {
    if (signals.isFocusActive || nighttime) return true;
  }

  return false;
}

// Airplane mode hard gate — checked BEFORE any bio check logic
function isAirplaneModeGated(airplaneModeOn) {
  return !!airplaneModeOn;
}

// isSleepPaused with smart detection (schedule + smart signals)
function isSleepPausedSmart(schedule, fakeNow, smartSettings, smartSignals) {
  if (schedule.enabled && isWithinSleepWindow(schedule, fakeNow)) {
    return true;
  }
  if (smartSettings && smartSignals) {
    return shouldSmartDetectionPause(smartSettings, smartSignals, schedule, fakeNow);
  }
  return false;
}

// Full decision engine — mirrors startBioCheck + handleRemoteMessages
function shouldBioCheckRun(fakeNow, pausedDate, specificPausedTimes, sleepSchedule) {
  const timePaused = isPausedTime(fakeNow, pausedDate, specificPausedTimes);
  const sleepPaused = isSleepPaused(sleepSchedule, fakeNow);
  return !timePaused && !sleepPaused;
}

function shouldBioCheckRunSmart(fakeNow, pausedDate, specificPausedTimes, sleepSchedule, smartSettings, smartSignals) {
  const timePaused = isPausedTime(fakeNow, pausedDate, specificPausedTimes);
  const sleepPaused = isSleepPausedSmart(sleepSchedule, fakeNow, smartSettings, smartSignals);
  return !timePaused && !sleepPaused;
}

function shouldPushBeDelivered(type, fakeNow, sleepSchedule) {
  const sleepPaused = isSleepPaused(sleepSchedule, fakeNow);
  const suppressedTypes = [
    'EMERGENCY_TIME_BASED_CHECK',
    'EMERGENCY_PULSE_BASED_CHECK',
  ];
  if (sleepPaused && suppressedTypes.includes(type)) {
    return false;
  }
  return true;
}

function shouldPushBeDeliveredSmart(type, fakeNow, sleepSchedule, smartSettings, smartSignals) {
  const sleepPaused = isSleepPausedSmart(sleepSchedule, fakeNow, smartSettings, smartSignals);
  const suppressedTypes = [
    'EMERGENCY_TIME_BASED_CHECK',
    'EMERGENCY_PULSE_BASED_CHECK',
  ];
  if (sleepPaused && suppressedTypes.includes(type)) {
    return false;
  }
  return true;
}

/**
 * Simulates the full lifecycle: bio check runs → evaluates data → decides outcome.
 * Returns one of:
 *   'AIRPLANE_GATED'    — airplane mode on, entire bio check skipped
 *   'SKIPPED'           — bio check did not run (paused/sleep)
 *   'POSITIVE_SIGNAL'   — bio check ran, user is alive
 *   'NO_DATA_TRIGGER'   — bio check ran, no data → emergency
 */
function fullLifecycle(fakeNow, pausedDate, slots, schedule, smartSettings, smartSignals, bioData, airplaneMode = false) {
  if (isAirplaneModeGated(airplaneMode)) return 'AIRPLANE_GATED';
  const shouldRun = shouldBioCheckRunSmart(fakeNow, pausedDate, slots, schedule, smartSettings, smartSignals);
  if (!shouldRun) return 'SKIPPED';
  return handleBioDataDecision(bioData);
}

function handleBioDataDecision(bioData) {
  const { pulseValue, restingPulseValue, movementValue } = bioData;
  if (pulseValue || restingPulseValue || movementValue) {
    return 'POSITIVE_SIGNAL';
  }
  return 'NO_DATA_TRIGGER';
}

// ─── Date factory ───────────────────────────────────────────────────────────

function date(year, month, day, hour, min, sec = 0) {
  return new Date(year, month - 1, day, hour, min, sec);
}

function ts(year, month, day, hour, min) {
  return date(year, month, day, hour, min).getTime();
}

function slot(active, startH, startM, endH, endM, startDays, endDays) {
  return {
    isActive: active,
    startTime: new Date(2026, 0, 1, startH, startM).getTime(),
    endTime: new Date(2026, 0, 1, endH, endM).getTime(),
    startDay: startDays,
    endDay: endDays,
  };
}

const NO_PAUSE = { timestamp: 0 };
const NO_SCHEDULE = { enabled: false, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

const SMART_OFF = { enabled: false, useFocusDetection: true, useChargingDetection: true, useHealthDataRecency: true, healthDataStaleThresholdMs: 7200000, nighttimeStartHour: 22, nighttimeStartMinute: 0, nighttimeEndHour: 8, nighttimeEndMinute: 0 };
const SMART_ON = { ...SMART_OFF, enabled: true };
const SMART_FOCUS_ONLY = { ...SMART_ON, useChargingDetection: false, useHealthDataRecency: false };
const SMART_CHARGING_ONLY = { ...SMART_ON, useFocusDetection: false, useHealthDataRecency: false };
const SMART_HEALTH_ONLY = { ...SMART_ON, useFocusDetection: false, useChargingDetection: false };

const SIG_NONE = { isFocusActive: false, isCharging: false, isHealthDataStale: false, lastHealthDataAgeMs: null, isInTravelGracePeriod: false };
const SIG_FOCUS = { ...SIG_NONE, isFocusActive: true };
const SIG_CHARGING = { ...SIG_NONE, isCharging: true };
const SIG_STALE = { ...SIG_NONE, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000 };
const SIG_FOCUS_CHARGING = { ...SIG_NONE, isFocusActive: true, isCharging: true };
const SIG_FOCUS_STALE = { ...SIG_NONE, isFocusActive: true, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000 };
const SIG_CHARGING_STALE = { ...SIG_NONE, isCharging: true, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000 };
const SIG_ALL = { isFocusActive: true, isCharging: true, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000, isInTravelGracePeriod: false };

// Travel grace period signals
const SIG_TRAVEL = { ...SIG_NONE, isInTravelGracePeriod: true };
const SIG_TRAVEL_CHARGING = { ...SIG_NONE, isCharging: true, isInTravelGracePeriod: true };
const SIG_TRAVEL_STALE = { ...SIG_NONE, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000, isInTravelGracePeriod: true };
const SIG_TRAVEL_CHARGING_STALE = { ...SIG_NONE, isCharging: true, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000, isInTravelGracePeriod: true };
const SIG_TRAVEL_ALL = { isFocusActive: true, isCharging: true, isHealthDataStale: true, lastHealthDataAgeMs: 3 * 3600000, isInTravelGracePeriod: true };

// ═════════════════════════════════════════════════════════════════════════════
//  TESTS
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1. isWithinSleepWindow ─────────────────────────────────────────────────

group('1. Sleep Window — Crosses Midnight (22:00–07:00)');
{
  const s = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('11 PM → inside',  isWithinSleepWindow(s, date(2026,3,18,23,0)),  true);
  assert('10 PM → inside',  isWithinSleepWindow(s, date(2026,3,18,22,0)),  true);
  assert('Midnight → inside', isWithinSleepWindow(s, date(2026,3,19,0,0)), true);
  assert('3:30 AM → inside',  isWithinSleepWindow(s, date(2026,3,19,3,30)), true);
  assert('6:59 AM → inside',  isWithinSleepWindow(s, date(2026,3,19,6,59)), true);
  assert('7:00 AM → outside', isWithinSleepWindow(s, date(2026,3,19,7,0)),  false);
  assert('7:01 AM → outside', isWithinSleepWindow(s, date(2026,3,19,7,1)),  false);
  assert('2 PM → outside',    isWithinSleepWindow(s, date(2026,3,19,14,0)), false);
  assert('9:59 PM → outside', isWithinSleepWindow(s, date(2026,3,18,21,59)), false);
}

group('2. Sleep Window — Same Day (01:00–06:00)');
{
  const s = { enabled: true, bedtimeHour: 1, bedtimeMinute: 0, wakeHour: 6, wakeMinute: 0 };

  assert('3 AM → inside',    isWithinSleepWindow(s, date(2026,3,19,3,0)),  true);
  assert('1 AM → inside',    isWithinSleepWindow(s, date(2026,3,19,1,0)),  true);
  assert('5:59 AM → inside', isWithinSleepWindow(s, date(2026,3,19,5,59)), true);
  assert('6 AM → outside',   isWithinSleepWindow(s, date(2026,3,19,6,0)),  false);
  assert('Noon → outside',   isWithinSleepWindow(s, date(2026,3,19,12,0)), false);
  assert('11 PM → outside',  isWithinSleepWindow(s, date(2026,3,18,23,0)), false);
}

group('3. Sleep Window — Minutes Precision (22:30–06:45)');
{
  const s = { enabled: true, bedtimeHour: 22, bedtimeMinute: 30, wakeHour: 6, wakeMinute: 45 };

  assert('22:29 → outside', isWithinSleepWindow(s, date(2026,3,18,22,29)), false);
  assert('22:30 → inside',  isWithinSleepWindow(s, date(2026,3,18,22,30)), true);
  assert('6:44 → inside',   isWithinSleepWindow(s, date(2026,3,19,6,44)),  true);
  assert('6:45 → outside',  isWithinSleepWindow(s, date(2026,3,19,6,45)),  false);
}

group('4. Sleep Window — Very Short (23:55–00:05)');
{
  const s = { enabled: true, bedtimeHour: 23, bedtimeMinute: 55, wakeHour: 0, wakeMinute: 5 };

  assert('23:57 → inside', isWithinSleepWindow(s, date(2026,3,18,23,57)), true);
  assert('00:03 → inside', isWithinSleepWindow(s, date(2026,3,19,0,3)),   true);
  assert('00:05 → outside', isWithinSleepWindow(s, date(2026,3,19,0,5)),  false);
  assert('23:54 → outside', isWithinSleepWindow(s, date(2026,3,18,23,54)), false);
}

group('5. Sleep Window — Almost Full Day (00:01–00:00)');
{
  const s = { enabled: true, bedtimeHour: 0, bedtimeMinute: 1, wakeHour: 0, wakeMinute: 0 };

  assert('Noon → inside',   isWithinSleepWindow(s, date(2026,3,19,12,0)), true);
  assert('00:00 → outside', isWithinSleepWindow(s, date(2026,3,19,0,0)),  false);
}

group('6. Sleep Window — Equal (08:00–08:00)');
{
  const s = { enabled: true, bedtimeHour: 8, bedtimeMinute: 0, wakeHour: 8, wakeMinute: 0 };
  assert('8 AM → inside (zero-width = always on)', isWithinSleepWindow(s, date(2026,3,19,8,0)), true);
  assert('3 AM → inside (zero-width = always on)', isWithinSleepWindow(s, date(2026,3,19,3,0)), true);
}

// ─── 2. isSleepPaused (schedule only) ───────────────────────────────────────

group('7. isSleepPaused — Schedule');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('2 AM with schedule → paused',    isSleepPaused(schedule, date(2026,3,19,2,0)),  true);
  assert('2 PM with schedule → NOT paused', isSleepPaused(schedule, date(2026,3,19,14,0)), false);

  const disabled = { ...schedule, enabled: false };
  assert('2 AM with disabled schedule → NOT paused', isSleepPaused(disabled, date(2026,3,19,2,0)), false);
  assert('No schedule → NOT paused', isSleepPaused(NO_SCHEDULE, date(2026,3,19,2,0)), false);
}

// ─── 3. isPausedTime (Time.service) ─────────────────────────────────────────

group('8. isPausedTime — Global Pause Date');
{
  const now = date(2026, 3, 18, 12, 0);
  const futurePause = { timestamp: ts(2026, 3, 18, 13, 0) };
  const pastPause = { timestamp: ts(2026, 3, 18, 11, 0) };

  assert('Current time before pause date → paused',  isPausedTime(now, futurePause, []), true);
  assert('Current time after pause date → NOT paused', isPausedTime(now, pastPause, []),   false);
  assert('Null pause date → NOT paused',               isPausedTime(now, null, []),         false);
  assert('Zero timestamp → NOT paused',                isPausedTime(now, { timestamp: 0 }, []), false);
}

group('9. isPausedTime — Single Day Slot');
{
  const wed11am = date(2026, 3, 18, 11, 0);
  const wed13 = date(2026, 3, 18, 13, 0);
  const thu11am = date(2026, 3, 19, 11, 0);

  const wedSlot = slot(true, 10, 0, 12, 0, [3], [3]);

  assert('Wed 11 AM in Wed 10-12 → paused',       isPausedTime(wed11am, NO_PAUSE, [wedSlot]), true);
  assert('Wed 1 PM outside Wed 10-12 → NOT paused', isPausedTime(wed13, NO_PAUSE, [wedSlot]),   false);
  assert('Thu 11 AM wrong day → NOT paused',         isPausedTime(thu11am, NO_PAUSE, [wedSlot]), false);
}

group('10. isPausedTime — Every Day Slot');
{
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const everyDaySlot = slot(true, 10, 0, 12, 0, allDays, allDays);

  assert('Any day 11 AM → paused',    isPausedTime(date(2026,3,18,11,0), NO_PAUSE, [everyDaySlot]), true);
  assert('Any day 1 PM → NOT paused', isPausedTime(date(2026,3,18,13,0), NO_PAUSE, [everyDaySlot]), false);
  assert('Sunday 11 AM → paused',     isPausedTime(date(2026,3,22,11,0), NO_PAUSE, [everyDaySlot]), true);
}

group('11. isPausedTime — Multi-Day Span (Mon–Fri)');
{
  const monFriSlot = slot(true, 9, 0, 17, 0, [1], [5]);
  const wed11 = date(2026, 3, 18, 11, 0);
  const sat11 = date(2026, 3, 21, 11, 0);
  const mon8 = date(2026, 3, 16, 8, 0);
  const mon10 = date(2026, 3, 16, 10, 0);
  const fri16 = date(2026, 3, 20, 16, 0);
  const fri18 = date(2026, 3, 20, 18, 0);

  assert('Wed 11 AM (between Mon-Fri) → paused',      isPausedTime(wed11, NO_PAUSE, [monFriSlot]),  true);
  assert('Sat 11 AM (outside Mon-Fri) → NOT paused',   isPausedTime(sat11, NO_PAUSE, [monFriSlot]),  false);
  assert('Mon 8 AM (before start hour) → NOT paused',  isPausedTime(mon8, NO_PAUSE, [monFriSlot]),   false);
  assert('Mon 10 AM (start day, in hours) → paused',   isPausedTime(mon10, NO_PAUSE, [monFriSlot]),  true);
  assert('Fri 4 PM (end day, in hours) → paused',      isPausedTime(fri16, NO_PAUSE, [monFriSlot]),  true);
  assert('Fri 6 PM (end day, after hours) → NOT paused', isPausedTime(fri18, NO_PAUSE, [monFriSlot]), false);
}

group('12. isPausedTime — Week-Wrapping Span (Fri–Mon)');
{
  const friMonSlot = slot(true, 18, 0, 8, 0, [5], [1]);
  const fri19 = date(2026, 3, 20, 19, 0);
  const sat12 = date(2026, 3, 21, 12, 0);
  const sun3 = date(2026, 3, 22, 3, 0);
  const mon7 = date(2026, 3, 23, 7, 0);
  const mon9 = date(2026, 3, 23, 9, 0);
  const wed12 = date(2026, 3, 18, 12, 0);

  assert('Fri 7 PM (start day, in hours) → paused',    isPausedTime(fri19, NO_PAUSE, [friMonSlot]),  true);
  assert('Sat noon (inside span) → paused',             isPausedTime(sat12, NO_PAUSE, [friMonSlot]),  true);
  assert('Sun 3 AM (inside span) → paused',             isPausedTime(sun3, NO_PAUSE, [friMonSlot]),   true);
  assert('Mon 7 AM (end day, in hours) → paused',       isPausedTime(mon7, NO_PAUSE, [friMonSlot]),   true);
  assert('Mon 9 AM (end day, after hours) → NOT paused', isPausedTime(mon9, NO_PAUSE, [friMonSlot]),  false);
  assert('Wed noon (outside span) → NOT paused',         isPausedTime(wed12, NO_PAUSE, [friMonSlot]), false);
}

group('13. isPausedTime — Inactive Slot Is Ignored');
{
  const inactiveSlot = slot(false, 0, 0, 23, 59, [0,1,2,3,4,5,6], [0,1,2,3,4,5,6]);
  assert('Inactive all-day slot → NOT paused', isPausedTime(date(2026,3,18,12,0), NO_PAUSE, [inactiveSlot]), false);
}

group('14. isPausedTime — Multiple Slots (only one needs to match)');
{
  const morningSlot = slot(true, 8, 0, 9, 0, [0,1,2,3,4,5,6], [0,1,2,3,4,5,6]);
  const eveningSlot = slot(true, 18, 0, 19, 0, [0,1,2,3,4,5,6], [0,1,2,3,4,5,6]);

  assert('8:30 AM → matches morning slot',    isPausedTime(date(2026,3,18,8,30), NO_PAUSE, [morningSlot, eveningSlot]), true);
  assert('18:30 → matches evening slot',       isPausedTime(date(2026,3,18,18,30), NO_PAUSE, [morningSlot, eveningSlot]), true);
  assert('12:00 → matches neither → NOT paused', isPausedTime(date(2026,3,18,12,0), NO_PAUSE, [morningSlot, eveningSlot]), false);
}

// ─── 4. Full BioCheck Decision Engine ───────────────────────────────────────

group('15. BioCheck Decision — All Pauses Combined');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const globalPause = { timestamp: ts(2026, 3, 19, 10, 0) };
  const wedSlot = slot(true, 14, 0, 16, 0, [3], [3]);

  assert('2 AM + sleep schedule → SKIP',
    shouldBioCheckRun(date(2026,3,19,2,0), NO_PAUSE, [], schedule), false);

  assert('10 AM + no pauses → RUN',
    shouldBioCheckRun(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE), true);

  assert('9 AM + global pause until 10 AM → SKIP',
    shouldBioCheckRun(date(2026,3,19,9,0), globalPause, [], NO_SCHEDULE), false);

  assert('Wed 3 PM + active time slot → SKIP',
    shouldBioCheckRun(date(2026,3,18,15,0), NO_PAUSE, [wedSlot], NO_SCHEDULE), false);
}

group('16. BioCheck Decision — Both Time Pause + Sleep Active');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const globalPause = { timestamp: ts(2026, 3, 19, 10, 0) };

  assert('2 AM + global pause + sleep → SKIP',
    shouldBioCheckRun(date(2026,3,19,2,0), globalPause, [], schedule), false);
}

// ─── 5. Push Notification Suppression ───────────────────────────────────────

group('17. Push Suppression During Sleep');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const now2am = date(2026, 3, 19, 2, 0);
  const now2pm = date(2026, 3, 19, 14, 0);

  assert('RegularCheck at 2 AM (sleeping) → SUPPRESSED',
    shouldPushBeDelivered('EMERGENCY_TIME_BASED_CHECK', now2am, schedule), false);

  assert('HealthCheck at 2 AM (sleeping) → SUPPRESSED',
    shouldPushBeDelivered('EMERGENCY_PULSE_BASED_CHECK', now2am, schedule), false);

  assert('EmergencyAlert at 2 AM (sleeping) → DELIVERED (never suppress real emergency)',
    shouldPushBeDelivered('EMERGENCY_ALERT', now2am, schedule), true);

  assert('RegularCheck at 2 PM (awake) → DELIVERED',
    shouldPushBeDelivered('EMERGENCY_TIME_BASED_CHECK', now2pm, schedule), true);

  assert('HealthCheck at 2 PM (awake) → DELIVERED',
    shouldPushBeDelivered('EMERGENCY_PULSE_BASED_CHECK', now2pm, schedule), true);

  assert('TimeSlotNotification during sleep → DELIVERED (not suppressed type)',
    shouldPushBeDelivered('TIME_SLOT_NOTIFICATION', now2am, schedule), true);
}

// ─── 6. Bio Data Decision ───────────────────────────────────────────────────

group('18. Bio Data Classification');
{
  assert('Heart rate only → POSITIVE_SIGNAL',
    handleBioDataDecision({ pulseValue: 72, restingPulseValue: 0, movementValue: 0 }), 'POSITIVE_SIGNAL');

  assert('Resting heart rate only → POSITIVE_SIGNAL',
    handleBioDataDecision({ pulseValue: 0, restingPulseValue: 55, movementValue: 0 }), 'POSITIVE_SIGNAL');

  assert('Movement only → POSITIVE_SIGNAL',
    handleBioDataDecision({ pulseValue: 0, restingPulseValue: 0, movementValue: 150 }), 'POSITIVE_SIGNAL');

  assert('All data present → POSITIVE_SIGNAL',
    handleBioDataDecision({ pulseValue: 72, restingPulseValue: 55, movementValue: 150 }), 'POSITIVE_SIGNAL');

  assert('All zeros → NO_DATA_TRIGGER (emergency path)',
    handleBioDataDecision({ pulseValue: 0, restingPulseValue: 0, movementValue: 0 }), 'NO_DATA_TRIGGER');

  assert('Null-ish values → NO_DATA_TRIGGER',
    handleBioDataDecision({ pulseValue: null, restingPulseValue: undefined, movementValue: 0 }), 'NO_DATA_TRIGGER');
}

// ─── 7. Recommendation System — findNearestGreaterValue ─────────────────────

group('19. Recommendation — findNearestGreaterValue');
{
  assert('0 hours → 3 (minimum)', findNearestGreaterValue(0), 3);
  assert('2 hours → 3',           findNearestGreaterValue(2), 3);
  assert('3 hours → 3 (exact)',   findNearestGreaterValue(3), 3);
  assert('4 hours → 6',           findNearestGreaterValue(4), 6);
  assert('6 hours → 6 (exact)',   findNearestGreaterValue(6), 6);
  assert('7 hours → 9',           findNearestGreaterValue(7), 9);
  assert('10 hours → 12',         findNearestGreaterValue(10), 12);
  assert('15 hours → 18',         findNearestGreaterValue(15), 18);
  assert('20 hours → 24',         findNearestGreaterValue(20), 24);
  assert('30 hours → 36',         findNearestGreaterValue(30), 36);
  assert('40 hours → 48',         findNearestGreaterValue(40), 48);
  assert('100 hours → 48 (cap)',  findNearestGreaterValue(100), 48);
}

// ─── 8. formatTime ──────────────────────────────────────────────────────────

group('20. formatTime');
{
  assert('Midnight',    formatTime(0, 0),   '12:00 AM');
  assert('12:30 AM',    formatTime(0, 30),  '12:30 AM');
  assert('1:05 AM',     formatTime(1, 5),   '1:05 AM');
  assert('11:59 AM',    formatTime(11, 59), '11:59 AM');
  assert('Noon',        formatTime(12, 0),  '12:00 PM');
  assert('1:00 PM',     formatTime(13, 0),  '1:00 PM');
  assert('11:59 PM',    formatTime(23, 59), '11:59 PM');
  assert('Padded mins', formatTime(9, 5),   '9:05 AM');
}

// ─── 9. Real-World Scenarios ────────────────────────────────────────────────

group('21. Scenario: Original Bug — User sleeps at 8 PM, switch fires at 2 AM');
{
  const schedule = { enabled: true, bedtimeHour: 20, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('2 AM with 20:00-07:00 schedule → system paused (no false alarm)',
    shouldBioCheckRun(date(2026,3,19,2,0), NO_PAUSE, [], schedule), false);

  assert('2 AM without schedule → system RUNS (original bug behavior)',
    shouldBioCheckRun(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE), true);
}

group('22. Scenario: Phone off overnight — no health data');
{
  assert('No bio data + no sleep schedule → EMERGENCY triggered',
    handleBioDataDecision({ pulseValue: 0, restingPulseValue: 0, movementValue: 0 }), 'NO_DATA_TRIGGER');

  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  assert('3 AM with schedule → bio check skipped entirely',
    shouldBioCheckRun(date(2026,3,19,3,0), NO_PAUSE, [], schedule), false);
}

group('23. Scenario: Time zone edge — exactly at boundary');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('Exactly 22:00:00 → inside (system pauses)',
    isWithinSleepWindow(schedule, date(2026,3,18,22,0,0)), true);

  assert('Exactly 07:00:00 → outside (system resumes)',
    isWithinSleepWindow(schedule, date(2026,3,19,7,0,0)), false);

  assert('06:59 → inside (last minute before wake)',
    isWithinSleepWindow(schedule, date(2026,3,19,6,59,59)), true);
}

group('24. Scenario: Multiple pause sources stacking');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const globalPause = { timestamp: ts(2026, 3, 20, 0, 0) };
  const nightSlot = slot(true, 23, 0, 5, 0, [0,1,2,3,4,5,6], [0,1,2,3,4,5,6]);
  const now1am = date(2026, 3, 19, 1, 0);

  const timePaused = isPausedTime(now1am, globalPause, [nightSlot]);
  const sleepPaused = isSleepPaused(schedule, now1am);

  assert('Global pause active at 1 AM', timePaused, true);
  assert('Sleep schedule active at 1 AM', sleepPaused, true);
  assert('Bio check definitely skipped', shouldBioCheckRun(now1am, globalPause, [nightSlot], schedule), false);
}

group('25. Scenario: All systems off — no automation');
{
  assert('No schedule, no pauses → system RUNS',
    shouldBioCheckRun(date(2026,3,19,3,0), NO_PAUSE, [], NO_SCHEDULE), true);
}

group('26. Scenario: Edge — isPausedTime with empty arrays');
{
  assert('Empty specificPausedTimes → NOT paused',
    isPausedTime(date(2026,3,18,12,0), NO_PAUSE, []), false);

  assert('Undefined pausedDate → NOT paused',
    isPausedTime(date(2026,3,18,12,0), undefined, []), false);
}

group('27. pseudoTime verification');
{
  assert('12:30 → 1230', pseudoTime(new Date(2026, 0, 1, 12, 30).getTime()), 1230);
  assert('00:00 → 0',    pseudoTime(new Date(2026, 0, 1, 0, 0).getTime()), 0);
  assert('23:59 → 2359', pseudoTime(new Date(2026, 0, 1, 23, 59).getTime()), 2359);
  assert('09:05 → 905',  pseudoTime(new Date(2026, 0, 1, 9, 5).getTime()), 905);
}

// ═════════════════════════════════════════════════════════════════════════════
//  SMART DETECTION TESTS
// ═════════════════════════════════════════════════════════════════════════════

group('28. Smart detection — disabled has no effect');
{
  assert('Smart off + Focus active at 2 AM → NOT paused',
    shouldSmartDetectionPause(SMART_OFF, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,2,0)), false);

  assert('Smart off + all signals active → NOT paused',
    shouldSmartDetectionPause(SMART_OFF, SIG_ALL, NO_SCHEDULE, date(2026,3,19,2,0)), false);
}

group('29. Smart detection — Focus/DND as standalone signal');
{
  assert('Focus active at 2 AM → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,2,0)), true);

  assert('Focus active at 2 PM (daytime) → PAUSE (Focus alone is sufficient)',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Focus active at 10 AM → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,10,0)), true);

  assert('No Focus, no other signals at 2 AM → NOT paused (nighttime alone not enough)',
    shouldSmartDetectionPause(SMART_ON, SIG_NONE, NO_SCHEDULE, date(2026,3,19,2,0)), false);

  assert('Focus only mode + Focus active → PAUSE',
    shouldSmartDetectionPause(SMART_FOCUS_ONLY, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,2,0)), true);

  assert('Focus only mode + no Focus → NOT paused',
    shouldSmartDetectionPause(SMART_FOCUS_ONLY, SIG_NONE, NO_SCHEDULE, date(2026,3,19,2,0)), false);
}

group('30. Smart detection — Charging + nighttime');
{
  assert('Charging at 11 PM (nighttime) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,18,23,0)), true);

  assert('Charging at 3 AM (nighttime) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,3,0)), true);

  assert('Charging at 2 PM (daytime) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,14,0)), false);

  assert('Charging at 9 AM (daytime, after default 8 AM) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,9,0)), false);

  assert('Charging at 7:59 AM (just before nighttime end) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,7,59)), true);

  assert('Charging at 8:00 AM (nighttime end) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,8,0)), false);

  assert('Charging only mode + charging at night → PAUSE',
    shouldSmartDetectionPause(SMART_CHARGING_ONLY, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,1,0)), true);

  assert('Charging only mode + charging during day → NOT paused',
    shouldSmartDetectionPause(SMART_CHARGING_ONLY, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,12,0)), false);
}

group('31. Smart detection — Health data recency');
{
  assert('Stale health data at 2 AM (nighttime corroborates) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_STALE, NO_SCHEDULE, date(2026,3,19,2,0)), true);

  assert('Stale health data at 2 PM (no corroboration) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_STALE, NO_SCHEDULE, date(2026,3,19,14,0)), false);

  assert('Stale + Focus at 2 PM → PAUSE (Focus corroborates)',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS_STALE, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Stale + charging at 2 PM → NOT paused (charging during day not enough)',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING_STALE, NO_SCHEDULE, date(2026,3,19,14,0)), false);

  assert('Stale + charging at midnight → PAUSE (nighttime + charging)',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING_STALE, NO_SCHEDULE, date(2026,3,19,0,0)), true);

  assert('Health only mode + stale at 2 AM → PAUSE',
    shouldSmartDetectionPause(SMART_HEALTH_ONLY, SIG_STALE, NO_SCHEDULE, date(2026,3,19,2,0)), true);

  assert('Health only mode + stale at noon → NOT paused',
    shouldSmartDetectionPause(SMART_HEALTH_ONLY, SIG_STALE, NO_SCHEDULE, date(2026,3,19,12,0)), false);

  assert('Fresh health data at 2 AM → NOT paused (health data not stale)',
    shouldSmartDetectionPause(SMART_ON, SIG_NONE, NO_SCHEDULE, date(2026,3,19,2,0)), false);
}

group('32. Smart detection — nighttime window with sleep schedule');
{
  const schedule = { enabled: true, bedtimeHour: 23, bedtimeMinute: 0, wakeHour: 6, wakeMinute: 0 };

  assert('Charging at 22:30 (in buffered window) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, schedule, date(2026,3,18,22,30)), true);

  assert('Charging at 6:30 AM (in buffered window, after wake) → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, schedule, date(2026,3,19,6,30)), true);

  assert('Charging at 7:30 AM (outside buffered window) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, schedule, date(2026,3,19,7,30)), false);

  assert('Charging at 21:30 (before buffered start) → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, schedule, date(2026,3,18,21,30)), false);
}

group('33. Smart detection — custom nighttime window (no schedule)');
{
  const customSettings = { ...SMART_ON, nighttimeStartHour: 21, nighttimeStartMinute: 30, nighttimeEndHour: 7, nighttimeEndMinute: 30 };

  assert('Charging at 21:45 (in custom window) → PAUSE',
    shouldSmartDetectionPause(customSettings, SIG_CHARGING, NO_SCHEDULE, date(2026,3,18,21,45)), true);

  assert('Charging at 21:00 (before custom start) → NOT paused',
    shouldSmartDetectionPause(customSettings, SIG_CHARGING, NO_SCHEDULE, date(2026,3,18,21,0)), false);

  assert('Charging at 7:15 (in custom window) → PAUSE',
    shouldSmartDetectionPause(customSettings, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,7,15)), true);

  assert('Charging at 7:45 (after custom end) → NOT paused',
    shouldSmartDetectionPause(customSettings, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,7,45)), false);
}

group('34. Smart detection — all signals combined');
{
  assert('All signals at night → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_ALL, NO_SCHEDULE, date(2026,3,19,2,0)), true);

  assert('All signals during day → PAUSE (Focus alone is enough)',
    shouldSmartDetectionPause(SMART_ON, SIG_ALL, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Focus + charging at noon → PAUSE (Focus sufficient)',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS_CHARGING, NO_SCHEDULE, date(2026,3,19,12,0)), true);
}

group('35. isSleepPausedSmart — full integration');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('Within sleep schedule at midnight → PAUSE (schedule takes priority)',
    isSleepPausedSmart(schedule, date(2026,3,19,0,0), SMART_ON, SIG_NONE), true);

  assert('Outside schedule at 8 AM + Focus active → PAUSE (smart fallback)',
    isSleepPausedSmart(schedule, date(2026,3,19,8,0), SMART_ON, SIG_FOCUS), true);

  assert('Outside schedule at 8 AM + no signals → NOT paused',
    isSleepPausedSmart(schedule, date(2026,3,19,8,0), SMART_ON, SIG_NONE), false);

  assert('No schedule + Focus at 3 AM → PAUSE via smart detection',
    isSleepPausedSmart(NO_SCHEDULE, date(2026,3,19,3,0), SMART_ON, SIG_FOCUS), true);

  assert('No schedule + charging at 3 AM → PAUSE via smart (nighttime + charging)',
    isSleepPausedSmart(NO_SCHEDULE, date(2026,3,19,3,0), SMART_ON, SIG_CHARGING), true);

  assert('No schedule + charging at 3 PM → NOT paused (daytime)',
    isSleepPausedSmart(NO_SCHEDULE, date(2026,3,19,15,0), SMART_ON, SIG_CHARGING), false);
}

group('36. shouldBioCheckRunSmart — full decision engine with smart detection');
{
  assert('2 AM, no schedule, Focus active → bio check SKIPPED',
    shouldBioCheckRunSmart(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_FOCUS), false);

  assert('2 AM, no schedule, stale health data + nighttime → bio check SKIPPED',
    shouldBioCheckRunSmart(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_STALE), false);

  assert('2 PM, no schedule, no signals → bio check RUNS',
    shouldBioCheckRunSmart(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE), true);

  assert('Time-based pause overrides everything → bio check SKIPPED',
    shouldBioCheckRunSmart(date(2026,3,19,14,0), { timestamp: ts(2026,3,20,0,0) }, [], NO_SCHEDULE, SMART_ON, SIG_NONE), false);

  assert('Smart off + no schedule + 2 AM → bio check RUNS (no protection)',
    shouldBioCheckRunSmart(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_FOCUS), true);
}

group('37. isInNighttimeWindow — edge cases');
{
  const defaultSettings = { nighttimeStartHour: 22, nighttimeStartMinute: 0, nighttimeEndHour: 8, nighttimeEndMinute: 0 };

  assert('10 PM exactly → inside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,18,22,0)), true);
  assert('7:59 AM → inside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,19,7,59)), true);
  assert('8:00 AM → outside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,19,8,0)), false);
  assert('9:59 PM → outside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,18,21,59)), false);
  assert('Midnight → inside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,19,0,0)), true);
  assert('Noon → outside nighttime', isInNighttimeWindow(null, defaultSettings, date(2026,3,19,12,0)), false);

  const sched = { enabled: true, bedtimeHour: 23, bedtimeMinute: 0, wakeHour: 6, wakeMinute: 0 };
  assert('Schedule buffered: 22:00 → inside', isInNighttimeWindow(sched, defaultSettings, date(2026,3,18,22,0)), true);
  assert('Schedule buffered: 6:59 → inside', isInNighttimeWindow(sched, defaultSettings, date(2026,3,19,6,59)), true);
  assert('Schedule buffered: 7:00 → outside', isInNighttimeWindow(sched, defaultSettings, date(2026,3,19,7,0)), false);
  assert('Schedule buffered: 21:59 → outside', isInNighttimeWindow(sched, defaultSettings, date(2026,3,18,21,59)), false);
}

group('38. Signal priority — Focus evaluated before charging and health data');
{
  const focusOnlySettings = { ...SMART_ON, useChargingDetection: false, useHealthDataRecency: false };
  assert('Focus only settings + Focus signal at noon → PAUSE',
    shouldSmartDetectionPause(focusOnlySettings, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,12,0)), true);

  const chargingOnlySettings = { ...SMART_ON, useFocusDetection: false, useHealthDataRecency: false };
  assert('Charging only settings + daytime → NOT paused',
    shouldSmartDetectionPause(chargingOnlySettings, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,12,0)), false);
}

group('39. Regression — original behavior unchanged when smart detection off');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('Schedule active at 1 AM, smart off → still PAUSED',
    isSleepPausedSmart(schedule, date(2026,3,19,1,0), SMART_OFF, SIG_NONE), true);

  assert('Schedule active at 8 AM, smart off → NOT paused (outside schedule)',
    isSleepPausedSmart(schedule, date(2026,3,19,8,0), SMART_OFF, SIG_NONE), false);

  assert('No schedule at 2 AM, smart off → NOT paused (no protection)',
    isSleepPausedSmart(NO_SCHEDULE, date(2026,3,19,2,0), SMART_OFF, SIG_ALL), false);
}

// ═════════════════════════════════════════════════════════════════════════════
//  EMERGENCY MUST FIRE — CRITICAL SAFETY TESTS
// ═════════════════════════════════════════════════════════════════════════════

group('40. EMERGENCY: No data during waking hours → MUST trigger');
{
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('2 PM, no schedule, no smart, zero data → EMERGENCY',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('10 AM, no schedule, no smart, zero data → EMERGENCY',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('2 PM, smart ON, no signals, zero data → EMERGENCY',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('10 AM, smart ON, only charging (daytime), zero data → EMERGENCY',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('2 PM, heart rate present → POSITIVE (alive)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
}

group('41. EMERGENCY: Stale data during day WITHOUT Focus → MUST trigger');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('Noon, stale health + charging (day) → EMERGENCY (charging alone not enough)',
    fullLifecycle(date(2026,3,19,12,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING_STALE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('3 PM, stale health only → EMERGENCY (no corroboration)',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_STALE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('10 AM, stale health only → EMERGENCY (no corroboration)',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_STALE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('42. EMERGENCY ALERT pushes NEVER suppressed — even with every signal active');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('EmergencyAlert during schedule + all smart signals → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,2,0), schedule, SMART_ON, SIG_ALL), true);

  assert('EmergencyAlert with Focus active at 2 AM → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,2,0), NO_SCHEDULE, SMART_ON, SIG_FOCUS), true);

  assert('EmergencyAlert with all signals at 3 AM → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,3,0), NO_SCHEDULE, SMART_ON, SIG_ALL), true);

  assert('TimeBasedCheck during schedule + all signals → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_TIME_BASED_CHECK', date(2026,3,19,2,0), schedule, SMART_ON, SIG_ALL), false);

  assert('PulseBasedCheck with Focus at 2 AM → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_PULSE_BASED_CHECK', date(2026,3,19,2,0), NO_SCHEDULE, SMART_ON, SIG_FOCUS), false);
}

group('43. EMERGENCY: After wake time, system MUST resume');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('7 AM (wake time), no data → EMERGENCY',
    fullLifecycle(date(2026,3,19,7,0), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('7:01 AM, no data → EMERGENCY',
    fullLifecycle(date(2026,3,19,7,1), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('8 AM, smart ON, no signals, no data → EMERGENCY',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('8 AM, smart ON, Focus active → SKIPPED (user likely still sleeping)',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], schedule, SMART_ON, SIG_FOCUS, DEAD_DATA), 'SKIPPED');
}

group('44. EMERGENCY: Smart detection individual toggles disabled');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const allTogglesOff = { ...SMART_ON, useFocusDetection: false, useChargingDetection: false, useHealthDataRecency: false };

  assert('Smart enabled but all toggles off + all signals at 2 AM → EMERGENCY',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, allTogglesOff, SIG_ALL, DEAD_DATA), 'NO_DATA_TRIGGER');

  const noFocus = { ...SMART_ON, useFocusDetection: false };
  assert('Focus disabled + Focus signal at noon + no data → EMERGENCY (Focus ignored)',
    fullLifecycle(date(2026,3,19,12,0), NO_PAUSE, [], NO_SCHEDULE, noFocus, SIG_FOCUS, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('Focus disabled + charging at 2 AM + no data → SKIPPED (charging+nighttime works)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, noFocus, SIG_CHARGING, DEAD_DATA), 'SKIPPED');
}

// ═════════════════════════════════════════════════════════════════════════════
//  ADVERSARIAL / STRESS EDGE CASES
// ═════════════════════════════════════════════════════════════════════════════

group('45. Adversarial: midnight boundary crossings');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 65, restingPulseValue: 50, movementValue: 80 };
  const schedule = { enabled: true, bedtimeHour: 23, bedtimeMinute: 59, wakeHour: 0, wakeMinute: 1 };

  assert('23:59 (in 2-min window) → SKIPPED',
    fullLifecycle(date(2026,3,18,23,59), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('00:00 (in 2-min window) → SKIPPED',
    fullLifecycle(date(2026,3,19,0,0), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('00:01 (wake time) → no data → EMERGENCY',
    fullLifecycle(date(2026,3,19,0,1), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('00:01 (wake time) + alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,0,1), NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
}

group('46. Adversarial: smart detection at exact nighttime boundaries');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('Charging at exactly 22:00 → SKIPPED',
    fullLifecycle(date(2026,3,18,22,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'SKIPPED');

  assert('Charging at 21:59 → EMERGENCY (1 min before nighttime)',
    fullLifecycle(date(2026,3,18,21,59), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('Charging at exactly 08:00 → EMERGENCY (nighttime just ended)',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('Charging at 07:59 → SKIPPED (last minute of nighttime)',
    fullLifecycle(date(2026,3,19,7,59), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'SKIPPED');
}

group('47. Adversarial: overlapping pause sources + smart detection');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const globalPause = { timestamp: ts(2026, 3, 19, 10, 0) };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('9 AM + global pause until 10 AM → SKIPPED (time pause)',
    fullLifecycle(date(2026,3,19,9,0), globalPause, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('10:01 AM + expired global pause + no signals → EMERGENCY',
    fullLifecycle(date(2026,3,19,10,1), globalPause, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('48. Real-world: User collapses at 3 PM, no health data');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('3 PM collapse, schedule on, no signals → EMERGENCY',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('3 PM collapse, stale health data only → EMERGENCY',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], schedule, SMART_ON, SIG_STALE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('3 PM collapse, phone on charger → EMERGENCY (daytime charging ignored)',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], schedule, SMART_ON, SIG_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('3 PM, stale + charging → EMERGENCY (daytime, insufficient corroboration)',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], schedule, SMART_ON, SIG_CHARGING_STALE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('49. Real-world: User is fine at 3 PM with health data');
{
  const ALIVE_DATA = { pulseValue: 80, restingPulseValue: 60, movementValue: 200 };
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('3 PM, alive data, smart on → POSITIVE (no emergency)',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');

  assert('10 AM, alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');

  assert('7 PM, alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,19,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
}

group('50. Real-world: Overnight sleep cycle — hour by hour');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  assert('9 PM (pre-bed) + alive data → POSITIVE',
    fullLifecycle(date(2026,3,18,21,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');

  assert('10 PM (bedtime) → SKIPPED',
    fullLifecycle(date(2026,3,18,22,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('11 PM → SKIPPED', fullLifecycle(date(2026,3,18,23,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('Midnight → SKIPPED', fullLifecycle(date(2026,3,19,0,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('2 AM → SKIPPED', fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('4 AM → SKIPPED', fullLifecycle(date(2026,3,19,4,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('6 AM → SKIPPED', fullLifecycle(date(2026,3,19,6,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('6:59 AM → SKIPPED (last minute)', fullLifecycle(date(2026,3,19,6,59), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('7 AM (wake) + alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,7,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');

  assert('7 AM (wake) + no data → EMERGENCY',
    fullLifecycle(date(2026,3,19,7,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('8 AM + alive → POSITIVE', fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
  assert('Noon + alive → POSITIVE', fullLifecycle(date(2026,3,19,12,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
}

group('51. Real-world: Original bug replay WITH smart detection fix');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  assert('OLD: 2 AM, no schedule, no smart → EMERGENCY (the original bug)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('NEW: 2 AM, no schedule, smart ON + Focus → SKIPPED (false alarm prevented)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_FOCUS, DEAD_DATA), 'SKIPPED');

  assert('NEW: 2 AM, no schedule, smart ON + charging → SKIPPED (nighttime + charging)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'SKIPPED');

  assert('NEW: 2 AM, no schedule, smart ON + stale health → SKIPPED (nighttime corroborates)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_STALE, DEAD_DATA), 'SKIPPED');

  assert('8 AM, no signals → system RUNS → alive → POSITIVE',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, { pulseValue: 70, restingPulseValue: 52, movementValue: 120 }), 'POSITIVE_SIGNAL');

  assert('8 AM, no signals, no data → EMERGENCY (ring still disconnected after wake)',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('52. Real-world: Night worker — sleeps 06:00-14:00');
{
  const nightWorkerSchedule = { enabled: true, bedtimeHour: 6, bedtimeMinute: 0, wakeHour: 14, wakeMinute: 0 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 68, restingPulseValue: 48, movementValue: 90 };

  assert('7 AM (sleeping) → SKIPPED', fullLifecycle(date(2026,3,19,7,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');
  assert('Noon (sleeping) → SKIPPED', fullLifecycle(date(2026,3,19,12,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, DEAD_DATA), 'SKIPPED');

  assert('2 PM (wake time) + alive → POSITIVE', fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
  assert('2 PM (wake time) + no data → EMERGENCY', fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('3 AM (working) + alive → POSITIVE', fullLifecycle(date(2026,3,19,3,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, ALIVE_DATA), 'POSITIVE_SIGNAL');
  assert('3 AM (working) + no data → EMERGENCY', fullLifecycle(date(2026,3,19,3,0), NO_PAUSE, [], nightWorkerSchedule, SMART_ON, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('53. Adversarial: user in danger but Focus/DND is on');
{
  assert('Focus active at 3 PM → bio check SKIPPED (Focus is trusted)',
    shouldBioCheckRunSmart(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_FOCUS), false);

  assert('BUT EmergencyAlert with Focus at 3 PM → ALWAYS DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,15,0), NO_SCHEDULE, SMART_ON, SIG_FOCUS), true);
}

group('54. Push delivery matrix — smart detection combinations');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };

  assert('TimeCheck during schedule → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_TIME_BASED_CHECK', date(2026,3,19,2,0), schedule, SMART_ON, SIG_NONE), false);
  assert('PulseCheck during schedule → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_PULSE_BASED_CHECK', date(2026,3,19,2,0), schedule, SMART_ON, SIG_NONE), false);
  assert('Alert during schedule → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,2,0), schedule, SMART_ON, SIG_NONE), true);

  assert('TimeCheck with Focus only at night → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_TIME_BASED_CHECK', date(2026,3,19,2,0), NO_SCHEDULE, SMART_ON, SIG_FOCUS), false);
  assert('Alert with Focus only at night → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,2,0), NO_SCHEDULE, SMART_ON, SIG_FOCUS), true);

  assert('TimeCheck at noon, no sleep → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_TIME_BASED_CHECK', date(2026,3,19,12,0), NO_SCHEDULE, SMART_ON, SIG_NONE), true);
  assert('PulseCheck at noon, no sleep → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_PULSE_BASED_CHECK', date(2026,3,19,12,0), NO_SCHEDULE, SMART_ON, SIG_NONE), true);
  assert('Alert at noon → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,12,0), NO_SCHEDULE, SMART_ON, SIG_NONE), true);
}

group('55. Bio data edge cases — borderline values');
{
  assert('Pulse = 1 (barely alive) → POSITIVE',
    handleBioDataDecision({ pulseValue: 1, restingPulseValue: 0, movementValue: 0 }), 'POSITIVE_SIGNAL');

  assert('Movement = 0.1 (tiny motion) → POSITIVE',
    handleBioDataDecision({ pulseValue: 0, restingPulseValue: 0, movementValue: 0.1 }), 'POSITIVE_SIGNAL');

  assert('Pulse = -1 (bogus negative) → POSITIVE (truthy)',
    handleBioDataDecision({ pulseValue: -1, restingPulseValue: 0, movementValue: 0 }), 'POSITIVE_SIGNAL');

  assert('All NaN → NO_DATA_TRIGGER',
    handleBioDataDecision({ pulseValue: NaN, restingPulseValue: NaN, movementValue: NaN }), 'NO_DATA_TRIGGER');

  assert('All empty strings → NO_DATA_TRIGGER',
    handleBioDataDecision({ pulseValue: '', restingPulseValue: '', movementValue: '' }), 'NO_DATA_TRIGGER');

  assert('All false → NO_DATA_TRIGGER',
    handleBioDataDecision({ pulseValue: false, restingPulseValue: false, movementValue: false }), 'NO_DATA_TRIGGER');
}

group('56. 24-hour sweep: bio check runs/skips every hour');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const ALIVE = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  for (let h = 0; h < 24; h++) {
    const now = date(2026, 3, 19, h, 0);
    const inWindow = (h >= 22 || h < 7);
    const result = fullLifecycle(now, NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, ALIVE);
    const expected = inWindow ? 'SKIPPED' : 'POSITIVE_SIGNAL';
    assert(`${String(h).padStart(2,'0')}:00 → ${expected}`, result, expected);
  }
}

group('57. 24-hour sweep: emergency fires every waking hour with no data');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const DEAD = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  for (let h = 0; h < 24; h++) {
    const now = date(2026, 3, 19, h, 0);
    const inWindow = (h >= 22 || h < 7);
    const result = fullLifecycle(now, NO_PAUSE, [], schedule, SMART_OFF, SIG_NONE, DEAD);
    const expected = inWindow ? 'SKIPPED' : 'NO_DATA_TRIGGER';
    assert(`${String(h).padStart(2,'0')}:00 + no data → ${expected}`, result, expected);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  AIRPLANE MODE GATE TESTS
// ═════════════════════════════════════════════════════════════════════════════

group('58. Airplane Mode Gate — hard block on emergency');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  // Airplane mode ON — emergency should NEVER fire, regardless of other conditions
  assert('Airplane mode ON + no data at 2 PM → AIRPLANE_GATED (not emergency)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  assert('Airplane mode ON + no data at 3 AM → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,3,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  assert('Airplane mode ON + alive data → AIRPLANE_GATED (entire check skipped)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, ALIVE_DATA, true), 'AIRPLANE_GATED');

  assert('Airplane mode ON + schedule active + no data → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [],
      { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 },
      SMART_ON, SIG_ALL, DEAD_DATA, true), 'AIRPLANE_GATED');

  assert('Airplane mode ON + all smart signals → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,12,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_ALL, DEAD_DATA, true), 'AIRPLANE_GATED');

  // Airplane mode OFF — normal behavior
  assert('Airplane mode OFF + no data at 2 PM → EMERGENCY (normal)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA, false), 'NO_DATA_TRIGGER');

  assert('Airplane mode OFF + alive data → POSITIVE (normal)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, ALIVE_DATA, false), 'POSITIVE_SIGNAL');

  assert('Airplane mode OFF + schedule active at 2 AM → SKIPPED (schedule, not airplane)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [],
      { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 },
      SMART_OFF, SIG_NONE, DEAD_DATA, false), 'SKIPPED');
}

group('59. Airplane Mode Gate — default parameter (backward compat)');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  // fullLifecycle without airplaneMode param defaults to false
  assert('No airplane param + no data → EMERGENCY (unchanged behavior)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_NONE, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('60. Airplane Mode — gate function directly');
{
  assert('Airplane mode true → gated', isAirplaneModeGated(true), true);
  assert('Airplane mode false → not gated', isAirplaneModeGated(false), false);
  assert('Airplane mode undefined → not gated', isAirplaneModeGated(undefined), false);
  assert('Airplane mode null → not gated', isAirplaneModeGated(null), false);
}

// ═════════════════════════════════════════════════════════════════════════════
//  TRAVEL GRACE PERIOD TESTS
// ═════════════════════════════════════════════════════════════════════════════

group('61. Travel Grace Period — shouldSmartDetectionPause with travel flag');
{
  // Travel grace period makes nighttime = 24h, so charging at any hour triggers pause
  assert('Travel + charging at 2 PM (daytime) → PAUSE (travel expands nighttime)',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_CHARGING, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Travel + charging at 10 AM → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_CHARGING, NO_SCHEDULE, date(2026,3,19,10,0)), true);

  assert('Travel + charging at 3 AM → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_CHARGING, NO_SCHEDULE, date(2026,3,19,3,0)), true);

  assert('Travel + stale data at 2 PM → PAUSE (travel=nighttime, corroborates stale)',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_STALE, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Travel + stale + charging at noon → PAUSE',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_CHARGING_STALE, NO_SCHEDULE, date(2026,3,19,12,0)), true);

  // Travel alone (no charging, no stale, no focus) → NOT paused
  assert('Travel flag alone, no signals → NOT paused',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL, NO_SCHEDULE, date(2026,3,19,14,0)), false);

  // Without travel flag — normal behavior
  assert('No travel + charging at 2 PM → NOT paused (daytime, no travel)',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, NO_SCHEDULE, date(2026,3,19,14,0)), false);

  assert('No travel + stale at 2 PM → NOT paused (no corroboration)',
    shouldSmartDetectionPause(SMART_ON, SIG_STALE, NO_SCHEDULE, date(2026,3,19,14,0)), false);
}

group('62. Travel Grace Period — fullLifecycle integration');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  // User flew to new timezone, jet-lagged, phone charging at 2 PM local time
  assert('Travel + charging at 2 PM + no data → SKIPPED (jet lag protection)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA), 'SKIPPED');

  // User flew, stale health data at 11 AM
  assert('Travel + stale data at 11 AM + no data → SKIPPED',
    fullLifecycle(date(2026,3,19,11,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL_STALE, DEAD_DATA), 'SKIPPED');

  // Travel grace expired (no travel flag) — back to normal
  assert('No travel + charging at 2 PM + no data → EMERGENCY (grace expired)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');

  // Travel but no signals → system runs → alive = fine
  assert('Travel + no signals + alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, ALIVE_DATA), 'POSITIVE_SIGNAL');

  // Travel + no signals + no data → EMERGENCY (travel alone is not enough)
  assert('Travel + no signals + no data → EMERGENCY (travel alone not enough)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, DEAD_DATA), 'NO_DATA_TRIGGER');

  // Smart detection OFF — travel has no effect
  assert('Travel + charging at 2 PM + smart OFF → EMERGENCY (smart disabled)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_OFF, SIG_TRAVEL_CHARGING, DEAD_DATA), 'NO_DATA_TRIGGER');
}

group('63. Travel Grace Period — works with sleep schedule');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  // Inside sleep schedule — schedule takes priority, travel irrelevant
  assert('2 AM + schedule + travel → SKIPPED (schedule)',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], schedule, SMART_ON, SIG_TRAVEL, DEAD_DATA), 'SKIPPED');

  // Outside schedule + travel + charging
  assert('8 AM + schedule + travel + charging → SKIPPED (travel extends)',
    fullLifecycle(date(2026,3,19,8,0), NO_PAUSE, [], schedule, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA), 'SKIPPED');

  // Outside schedule + no travel + charging at 8 AM → normally nighttime buffer covers this
  // Default nighttime with schedule (22-7) is buffered to 21-08, so 8 AM is at boundary
  assert('8 AM + schedule + no travel + charging → check nighttime buffer',
    shouldSmartDetectionPause(SMART_ON, SIG_CHARGING, schedule, date(2026,3,19,8,0)), false);

  // But with travel → forced nighttime → PAUSE
  assert('8 AM + schedule + travel + charging → PAUSE (travel overrides)',
    shouldSmartDetectionPause(SMART_ON, SIG_TRAVEL_CHARGING, schedule, date(2026,3,19,8,0)), true);
}

group('64. Travel Grace Period — Focus still works independently of travel');
{
  // Focus is always a standalone signal — travel doesn't change this
  assert('Focus at 2 PM, no travel → PAUSE (Focus standalone)',
    shouldSmartDetectionPause(SMART_ON, SIG_FOCUS, NO_SCHEDULE, date(2026,3,19,14,0)), true);

  assert('Focus at 2 PM, with travel → PAUSE (Focus still works)',
    shouldSmartDetectionPause(SMART_ON, { ...SIG_FOCUS, isInTravelGracePeriod: true }, NO_SCHEDULE, date(2026,3,19,14,0)), true);
}

// ═════════════════════════════════════════════════════════════════════════════
//  COMBINED AIRPLANE + TRAVEL TESTS
// ═════════════════════════════════════════════════════════════════════════════

group('65. Combined: Airplane mode + travel grace period');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  // During flight: airplane mode ON + travel grace active
  assert('In flight: airplane ON + travel + no data → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA, true), 'AIRPLANE_GATED');

  // After landing: airplane OFF, travel grace still active
  assert('After landing: airplane OFF + travel + charging at 3 PM → SKIPPED (travel)',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA, false), 'SKIPPED');

  // After landing: airplane OFF, travel grace, no charging, no focus
  assert('After landing: airplane OFF + travel + no signals → EMERGENCY',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, DEAD_DATA, false), 'NO_DATA_TRIGGER');

  // After landing: airplane OFF, travel grace, alive data
  assert('After landing: airplane OFF + travel + alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, ALIVE_DATA, false), 'POSITIVE_SIGNAL');
}

group('66. Real-world: Full flight scenario — NYC to London');
{
  const schedule = { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 };
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 70, restingPulseValue: 50, movementValue: 90 };

  // 8 PM NYC: user at airport, system running normally
  assert('8 PM NYC, pre-flight, alive → POSITIVE',
    fullLifecycle(date(2026,3,18,20,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, ALIVE_DATA, false), 'POSITIVE_SIGNAL');

  // 9 PM NYC: boarding, airplane mode ON
  assert('9 PM, airplane mode ON → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,18,21,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  // 2 AM NYC (7 AM London): mid-flight, airplane still ON
  assert('2 AM mid-flight, airplane ON → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,2,0), NO_PAUSE, [], schedule, SMART_ON, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  // 4 AM NYC (9 AM London): landed, airplane OFF, timezone shifted (+5h), phone charging
  // Travel grace period now active, charging = sleep signal at any hour
  assert('Landed: airplane OFF + travel + charging + no data → SKIPPED (jet lag)',
    fullLifecycle(date(2026,3,19,9,0), NO_PAUSE, [], schedule, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA, false), 'SKIPPED');

  // Later in London: user wakes up, unplugs phone, ring reconnects
  assert('London afternoon: travel + alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], schedule, SMART_ON, SIG_TRAVEL, ALIVE_DATA, false), 'POSITIVE_SIGNAL');

  // London evening: no signals, no data → system catches real issue
  assert('London 6 PM: travel + no signals + no data → EMERGENCY (real concern)',
    fullLifecycle(date(2026,3,19,18,0), NO_PAUSE, [], schedule, SMART_ON, SIG_TRAVEL, DEAD_DATA, false), 'NO_DATA_TRIGGER');
}

group('67. Real-world: Short domestic flight (same timezone)');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const ALIVE_DATA = { pulseValue: 72, restingPulseValue: 55, movementValue: 100 };

  // Same timezone flight — no travel grace period (offset unchanged)
  assert('Pre-flight: alive data → POSITIVE',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, ALIVE_DATA, false), 'POSITIVE_SIGNAL');

  assert('In-flight: airplane ON → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,11,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  // After landing: same timezone, no travel grace, normal behavior
  assert('After landing: no travel, alive → POSITIVE',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, ALIVE_DATA, false), 'POSITIVE_SIGNAL');

  assert('After landing: no travel, no data → EMERGENCY (correctly catches issue)',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_NONE, DEAD_DATA, false), 'NO_DATA_TRIGGER');
}

group('68. Travel Grace Period — individual signal toggles');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };
  const chargingOnly = { ...SMART_ON, useFocusDetection: false, useHealthDataRecency: false };
  const healthOnly = { ...SMART_ON, useFocusDetection: false, useChargingDetection: false };
  const allOff = { ...SMART_ON, useFocusDetection: false, useChargingDetection: false, useHealthDataRecency: false };

  // Charging-only mode + travel
  assert('Charging only + travel + charging at noon → PAUSE',
    shouldSmartDetectionPause(chargingOnly, SIG_TRAVEL_CHARGING, NO_SCHEDULE, date(2026,3,19,12,0)), true);

  // Health-only mode + travel
  assert('Health only + travel + stale at noon → PAUSE',
    shouldSmartDetectionPause(healthOnly, SIG_TRAVEL_STALE, NO_SCHEDULE, date(2026,3,19,12,0)), true);

  // All sub-toggles off + travel → no effect
  assert('All toggles off + travel + all signals → NOT paused',
    shouldSmartDetectionPause(allOff, SIG_TRAVEL_ALL, NO_SCHEDULE, date(2026,3,19,12,0)), false);
}

group('69. Adversarial: airplane mode edge cases');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  // Airplane mode at midnight during sleep schedule
  assert('Airplane ON + sleep schedule at midnight → AIRPLANE_GATED (not just SKIPPED)',
    fullLifecycle(date(2026,3,19,0,0), NO_PAUSE, [],
      { enabled: true, bedtimeHour: 22, bedtimeMinute: 0, wakeHour: 7, wakeMinute: 0 },
      SMART_ON, SIG_FOCUS, DEAD_DATA, true), 'AIRPLANE_GATED');

  // Airplane mode with global time pause
  assert('Airplane ON + global pause → AIRPLANE_GATED (takes priority)',
    fullLifecycle(date(2026,3,19,9,0), { timestamp: ts(2026,3,20,0,0) }, [],
      NO_SCHEDULE, SMART_ON, SIG_NONE, DEAD_DATA, true), 'AIRPLANE_GATED');

  // Airplane mode during nap with Focus
  assert('Airplane ON + Focus at 3 PM → AIRPLANE_GATED',
    fullLifecycle(date(2026,3,19,15,0), NO_PAUSE, [], NO_SCHEDULE,
      SMART_ON, SIG_FOCUS, DEAD_DATA, true), 'AIRPLANE_GATED');
}

group('70. Safety: travel grace period must NOT block real emergencies');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  // Travel is active but user has no charging/focus/stale signals → emergency fires
  assert('Travel + no signals + no data at 2 PM → EMERGENCY',
    fullLifecycle(date(2026,3,19,14,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, DEAD_DATA), 'NO_DATA_TRIGGER');

  assert('Travel + no signals + no data at 10 AM → EMERGENCY',
    fullLifecycle(date(2026,3,19,10,0), NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL, DEAD_DATA), 'NO_DATA_TRIGGER');

  // EmergencyAlert pushes still always delivered
  assert('EmergencyAlert + travel + all signals → DELIVERED',
    shouldPushBeDeliveredSmart('EMERGENCY_ALERT', date(2026,3,19,14,0), NO_SCHEDULE, SMART_ON, SIG_TRAVEL_ALL), true);

  assert('TimeCheck + travel + charging at 2 PM → SUPPRESSED',
    shouldPushBeDeliveredSmart('EMERGENCY_TIME_BASED_CHECK', date(2026,3,19,14,0), NO_SCHEDULE, SMART_ON, SIG_TRAVEL_CHARGING), false);
}

group('71. 24-hour sweep with travel grace period + charging');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  // With travel grace period, charging should pause at EVERY hour (24h nighttime)
  for (let h = 0; h < 24; h++) {
    const now = date(2026, 3, 19, h, 0);
    const result = fullLifecycle(now, NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_TRAVEL_CHARGING, DEAD_DATA);
    assert(`${String(h).padStart(2,'0')}:00 + travel + charging → SKIPPED`, result, 'SKIPPED');
  }
}

group('72. 24-hour sweep WITHOUT travel — charging only pauses at night');
{
  const DEAD_DATA = { pulseValue: 0, restingPulseValue: 0, movementValue: 0 };

  for (let h = 0; h < 24; h++) {
    const now = date(2026, 3, 19, h, 0);
    // Default nighttime: 22:00 - 08:00
    const isNighttime = (h >= 22 || h < 8);
    const result = fullLifecycle(now, NO_PAUSE, [], NO_SCHEDULE, SMART_ON, SIG_CHARGING, DEAD_DATA);
    const expected = isNighttime ? 'SKIPPED' : 'NO_DATA_TRIGGER';
    assert(`${String(h).padStart(2,'0')}:00 + no travel + charging → ${expected}`, result, expected);
  }
}

// ─── Done ───────────────────────────────────────────────────────────────────

summary();
