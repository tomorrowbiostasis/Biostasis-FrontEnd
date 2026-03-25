#!/usr/bin/env python3
"""Generate Biostasis UI Changes PDF (Automated Emergency / deadman switch UI work)."""

from datetime import date

from fpdf import FPDF


class UIReport(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(120, 120, 120)
        self.cell(
            0,
            8,
            "Biostasis - UI Changes Report",
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

    def section_title(self, title):
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(31, 81, 255)
        self.cell(0, 9, title, new_x="LMARGIN", new_y="NEXT")
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

    def sub_title(self, title):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(60, 60, 60)
        self.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.cell(8, 5.5, "-")
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def mono_line(self, text):
        self.set_font("Courier", "", 8)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 4.5, text)
        self.ln(1)


def main():
    pdf = UIReport()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(31, 81, 255)
    pdf.cell(0, 12, "UI Changes Report", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(
        0,
        7,
        "Automated Emergency / Deadman Switch (user-visible)",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(
        0,
        6,
        f"Generated: {date.today().strftime('%B %d, %Y')}",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(6)

    pdf.body_text(
        "This document summarizes UI and UX changes shipped for the automated "
        "emergency (deadman switch) experience: main settings screen, sleep "
        "schedule, pause flows, specific times, copy, and navigation."
    )

    # --- 1 ---
    pdf.section_title("1. Automated Emergency Settings (main screen)")
    pdf.sub_title("Problems addressed")
    pdf.bullet(
        'Collapsible "Read instructions" relied on a broken or confusing external link.'
    )
    pdf.bullet(
        "Sleep schedule and pause flows were fragmented or hard to discover in the menu."
    )
    pdf.bullet(
        "Time-based description used fixed night hours (e.g. 10pm-6am) instead of the "
        "user sleep schedule."
    )
    pdf.bullet(
        "Bio and time trigger cards had no header icons; horizontal padding felt tighter "
        "than vertical padding."
    )
    pdf.sub_title("What users see now")
    pdf.bullet(
        'Inline "How it works": three steps (Connect / Monitor / Emergency) with colored '
        "icon circles, always visible (no accordion to a dead link)."
    )
    pdf.bullet(
        'Toggles at top: "I understand how it works" and "Enable automated emergency".'
    )
    pdf.bullet(
        "Bio-based trigger: heart-pulse icon; Time-based: timer-sand icon in card headers."
    )
    pdf.bullet(
        "When emergency is ON: bio and time panels show, then Sleep Schedule card directly "
        "below on the same screen."
    )
    pdf.bullet(
        "Smart Sleep Detection remains enabled in logic; no separate on/off toggle in UI."
    )
    pdf.bullet(
        "Wider horizontal padding on scroll content; panelBody and panelFooter share padding "
        "so footer rows (e.g. wearable row) align with body text."
    )
    pdf.sub_title("Key files")
    pdf.mono_line("AutomatedEmergencySettingsScreen.tsx, styles.ts")
    pdf.mono_line("BioBasedTrigger.tsx, TimeBasedTrigger.tsx")

    # --- 2 ---
    pdf.add_page()
    pdf.section_title("2. Sleep Schedule")
    pdf.bullet('Card with moon icon, title "Sleep Schedule", explanatory copy.')
    pdf.bullet(
        'Toggle "Enable sleep schedule"; bedtime and wake rows open native time pickers '
        "(react-native-modal-datetime-picker)."
    )
    pdf.bullet("Footer summarizes the active window using the user actual bed/wake times.")
    pdf.bullet(
        "First-time bottom sheet: when automated emergency is turned ON and sleep schedule "
        'is not enabled, a sheet slides up: "Set up your sleep schedule", bed/wake times, '
        '"Enable sleep schedule" / "Skip for now". Inline card refreshes via refreshKey '
        "after dismiss."
    )
    pdf.sub_title("Key files")
    pdf.mono_line("SleepSchedulePanel.tsx, SleepScheduleBottomSheet.tsx")
    pdf.mono_line("AutomatedEmergencySettingsScreen.tsx (sheet state + refreshKey)")

    # --- 3 ---
    pdf.section_title("3. Pause Emergency System")
    pdf.bullet(
        'When paused: status area (yellow-style) with "System is paused" and expiry time; '
        '"Cancel pause".'
    )
    pdf.bullet("Toast on confirm includes pause-until time.")
    pdf.bullet("Strings updated in EN, DE, FR, ES, IT.")
    pdf.sub_title("Key files")
    pdf.mono_line("PauseEmergencyPanel.tsx, PauseEmergencyPanel/styles.ts")

    # --- 4 ---
    pdf.section_title("4. Set-up Specific Times (list)")
    pdf.bullet("Calendar-clock icon in panel header.")
    pdf.bullet(
        "Each slot is a sub-card: Active/Inactive badge, edit and delete, Start and End "
        "(day + time) with arrow, toggle in footer."
    )
    pdf.bullet(
        '"Add additional time": dashed full-width button with plus icon (more visible than '
        "plain text)."
    )
    pdf.sub_title("Key files")
    pdf.mono_line("SpecificTimesPanel.tsx, SpecificDateComponent.tsx, styles")

    # --- 5 ---
    pdf.add_page()
    pdf.section_title("5. Set-up Specific Times (add / edit modal)")
    pdf.bullet(
        "Replaced masked time input and AM/PM radios with native time pickers (tap row opens "
        "iOS spinner or Android time dialog)."
    )
    pdf.bullet("Start section green accent; End section blue accent; uppercase section labels.")
    pdf.bullet("Header with close (X); Save disabled until both start and end times are set.")
    pdf.bullet(
        'Copy fix: end block uses "Set end time" (endSection.pickTime), not the start-time string.'
    )
    pdf.sub_title("Key files")
    pdf.mono_line("DayTimePickerModal.tsx, DayTimePickerModal/styles.ts")

    # --- 6-8 ---
    pdf.section_title("6. Time-based trigger copy")
    pdf.bullet(
        "Description no longer hardcodes fixed night hours; it refers to sleep schedule hours "
        "being excluded."
    )
    pdf.mono_line("i18n: en, de, fr, es, it")

    pdf.section_title("7. Interval selector (time-based frequency)")
    pdf.bullet(
        "Six-minute interval hidden in production builds (marked debug; filtered when Env "
        "is production)."
    )
    pdf.mono_line("src/constants/settings.constants.ts")

    pdf.section_title("8. Navigation")
    pdf.bullet(
        "Pause Emergency and Set-up Specific Times are embedded on Automated Emergency "
        "Settings for a single configuration surface."
    )
    pdf.mono_line("Drawer still opens Automated Emergency Settings; panels are on that screen.")

    pdf.section_title("Optional: real screenshots in repo")
    pdf.body_text(
        "If present, docs/screenshots/ may contain simulator captures (e.g. "
        "simulator-current.png). Capture more via Simulator Cmd+S or "
        "xcrun simctl io booted screenshot <path> after navigating."
    )

    out = "/Users/daniel/www/tomorrow/Biostasis-FrontEnd/Biostasis_UI_Changes_Report.pdf"
    pdf.output(out)
    print(out)


if __name__ == "__main__":
    main()
