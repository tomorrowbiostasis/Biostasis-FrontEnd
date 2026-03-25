#!/usr/bin/env python3
"""Generate PDF documenting Jest tests for deadman switch and related services."""

from datetime import date
from pathlib import Path

from fpdf import FPDF

REPO_ROOT = Path(__file__).resolve().parent.parent


class T(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(120, 120, 120)
        self.cell(
            0,
            8,
            "Biostasis - Jest Test Coverage Report",
            align="R",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def h1(self, title):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(31, 81, 255)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

    def h2(self, title):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(50, 50, 50)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def p(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.cell(8, 5.5, "-")
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def file_line(self, path):
        self.set_font("Courier", "", 8)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 4.5, path)
        self.ln(1)


def main():
    pdf = T()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(31, 81, 255)
    pdf.cell(0, 11, "Jest Implementation & Test Coverage", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 7, "Business summary of implementation and verification", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 6, f"Date: {date.today().strftime('%B %d, %Y')}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    pdf.h1("1. What we implemented")
    pdf.bullet(
        "A safer deadman workflow: no immediate emergency on one missed reading. "
        "The system warns first, then escalates only if there is still no signal."
    )
    pdf.bullet(
        "More reliable 'alive' detection: movement (steps), heart rate, or resting "
        "heart rate can each confirm activity."
    )
    pdf.bullet(
        "Sleep-aware behavior: checks are paused during configured sleep windows, "
        "plus a post-wake buffer to reduce false alarms right after wake-up."
    )
    pdf.bullet(
        "Stronger resilience: invalid or missing stored values are handled safely "
        "instead of causing unstable behavior."
    )
    pdf.bullet(
        "Jest test infrastructure updates so React Native/native dependencies can be "
        "loaded and tested consistently in CI and local runs."
    )

    pdf.h1("2. What this test report covers")
    pdf.p(
        "This report describes Jest tests under src/services/__tests__/ and "
        "__tests__/App-test.tsx. The suites verify deadman behavior, pause/sleep "
        "timing, data-handling safeguards, and baseline test-runner stability."
    )

    pdf.h1("3. BioCheck.service.test.ts (deadman core)")
    pdf.file_line("src/services/__tests__/BioCheck.service.test.ts")
    pdf.p(
        "Tests exported handlers handleBioData and handlePositiveData with heavy mocks "
        "(AsyncStorage, Notifee, API, navigation, Google Fit, etc.)."
    )
    pdf.h2("Alive signal (OR logic)")
    pdf.bullet(
        "Steps-only, HR-only, resting HR-only, and all-three: user counted alive; "
        "counter reset; no false emergency."
    )
    pdf.bullet(
        "Steps with stale HR: simulates phone pedometer when wearable HR not synced."
    )
    pdf.h2("Two-strike warning system")
    pdf.bullet(
        "First consecutive no-data: warning notification path, no full escalation."
    )
    pdf.bullet("Second consecutive no-data: emergency / escalation path.")
    pdf.bullet("Positive data after first strike: counter reset.")
    pdf.bullet("Full multi-step cycles: warning then positive; double strike then reset.")
    pdf.h2("Morning / real-world flows")
    pdf.bullet("Steps after wake without Oura: stays alive.")
    pdf.bullet("No data: warning first; still no data: emergency; HR sync after warning: recovery.")
    pdf.h2("ConsecutiveNoDataCount safety")
    pdf.bullet("NaN, negative, empty string in storage: treated as 0; predictable warning path.")
    pdf.h2("handleDisconnection + AppState")
    pdf.bullet("Navigates to LostConnection when active; skips navigation when app inactive (headless safety).")
    pdf.p("22 tests. Business outcome: lowers false emergency triggers while preserving escalation when risk persists.")

    pdf.add_page()
    pdf.h1("4. SleepSchedule.service.test.ts")
    pdf.file_line("src/services/__tests__/SleepSchedule.service.test.ts")
    pdf.p(
        "Covers sleep window math with POST_WAKE_BUFFER_MINUTES (1 hour after wake), "
        "including midnight-crossing schedules, short windows, buffer wrapping past "
        "midnight, and the guard when the window would otherwise be almost 24h."
    )
    pdf.bullet("isWithinSleepWindow: many clock scenarios (bed 22:00 / wake 07:00, etc.).")
    pdf.bullet("formatTime: 12h display strings.")
    pdf.bullet("getSleepSchedule / saveSleepSchedule: persistence and corrupt JSON fallback.")
    pdf.bullet("isSleepPaused: integration with smart-detection mock; schedule on/off.")
    pdf.bullet("Real-world: 2 AM asleep, 7:01 AM in buffer, 8:01 AM active; night shift patterns.")
    pdf.bullet("isPausedTime sections: manual pause timestamps and specific recurring slots.")
    pdf.p("75 tests. Business outcome: avoids unnecessary alerts during normal sleep and immediate post-wake periods.")

    pdf.h1("5. Time.service.test.ts")
    pdf.file_line("src/services/__tests__/Time.service.test.ts")
    pdf.p("Focused on isPausedTime() used when checking scheduled pause windows.")
    pdf.bullet("Manual pause: before/after pausedDate; null safe.")
    pdf.bullet("Specific times: midnight-crossing ranges (e.g. 23:00-06:00), daytime ranges, inactive slots.")
    pdf.bullet("Edge: null/undefined specificPausedTimes arrays.")
    pdf.p("11 tests. Business outcome: scheduled pauses behave consistently, including midnight-crossing ranges.")

    pdf.h1("6. helpers.test.ts (AsyncStorage user settings)")
    pdf.file_line("src/services/__tests__/helpers.test.ts")
    pdf.p("Tests getUserPersistedSettings() resilience for notification and emergency settings.")
    pdf.bullet("Empty storage, empty string, invalid JSON, missing user key.")
    pdf.bullet("Valid nested user JSON; invalid inner user JSON returns {}.")
    pdf.p("6 tests. Business outcome: safer behavior even when persisted user data is empty or corrupted.")

    pdf.add_page()
    pdf.h1("7. Other Jest suites (existing, not deadman-specific)")
    pdf.bullet("Recommendation.service.test.ts (18 tests) - recommendation period / health data similarity.")
    pdf.bullet("Date.service.test.ts (21 tests) - relative time strings.")
    pdf.p("These still run in the full suite and must stay green.")

    pdf.h1("8. __tests__/App-test.tsx (Jest harness)")
    pdf.file_line("__tests__/App-test.tsx")
    pdf.p(
        "Does NOT render the full App tree (would require mocking Amplify, NetInfo, "
        "full navigation, and many native modules). A minimal sanity test documents "
        "that the runner works; real app smoke tests belong in E2E or manual QA."
    )

    pdf.h1("9. Jest configuration helpers (not tests)")
    pdf.bullet("jest.config.js: moduleNameMapper for image assets (PNG/SVG stubs).")
    pdf.bullet("jest/setupFiles.js: react-native-gesture-handler jest setup; NetInfo mock.")
    pdf.bullet("moduleNameMapper: react-native-keyboard-aware-scroll-view stub.")
    pdf.bullet(
        "transformIgnorePatterns: allows Babel to transform reanimated, vector icons, "
        "drawer, screens, safe-area, keyboard-aware, etc., so imports resolve in tests."
    )
    pdf.bullet("__mocks__/fileMock.js, keyboardAwareScrollViewMock.js.")

    pdf.h1("10. Full suite summary")
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(34, 139, 34)
    pdf.cell(0, 8, "Run all: 7 test files, 154 tests (22+75+11+6+18+21+1)", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_text_color(40, 40, 40)
    pdf.set_font("Helvetica", "", 10)
    pdf.p(
        "Deadman-related coverage is concentrated in BioCheck, SleepSchedule, Time, and "
        "helpers tests. Together they verify warning-before-escalation behavior, "
        "multiple alive signals, sleep/buffer timing, pause window calculations, and "
        "safe handling of bad stored values."
    )

    out = REPO_ROOT / "Biostasis_Jest_Tests_Report.pdf"
    pdf.output(str(out))
    print(out)


if __name__ == "__main__":
    main()
