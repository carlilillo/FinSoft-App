import { describe, expect, it } from "vitest";
import {
    applyScheduleChange,
    describeNextRun,
    formatHour,
    HOUR_OPTIONS,
    scheduleGmailNote,
    WEEKDAY_OPTIONS,
} from "./schedule.model";
import type { AnalysisSchedule } from "./types";

const schedule: AnalysisSchedule = {
    enabled: true,
    weekday: "friday",
    hour: 18,
    timeZone: "UTC",
    nextRunAt: "2026-11-13T18:00:00Z",
};

describe("schedule model", () => {
    it("lists the week from Monday to Sunday", () => {
        expect(WEEKDAY_OPTIONS.map((option) => option.label)).toEqual([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]);
    });

    it("offers the 24 whole hours", () => {
        expect(HOUR_OPTIONS).toHaveLength(24);
        expect(HOUR_OPTIONS[0]).toEqual({ value: "0", label: "00:00" });
        expect(HOUR_OPTIONS[23]).toEqual({ value: "23", label: "23:00" });
        expect(formatHour(9)).toBe("09:00");
    });

    it("applies a change and re-anchors it to the current time zone", () => {
        expect(
            applyScheduleChange(schedule, { hour: 7 }, "Europe/Dublin"),
        ).toEqual({
            enabled: true,
            weekday: "friday",
            hour: 7,
            timeZone: "Europe/Dublin",
        });
    });

    it("describes the next run, or that it is being worked out", () => {
        expect(describeNextRun(schedule, "en-GB")).toMatch(
            /^Next analysis on \w+day \d+ Nov at \d\d:00$/,
        );
        expect(describeNextRun({ ...schedule, nextRunAt: null })).toBe(
            "Working out the next analysis…",
        );
    });

    it("explains the switch when Gmail is not connected", () => {
        expect(scheduleGmailNote(schedule, true)).toBeNull();
        expect(scheduleGmailNote(schedule, false)).toMatch(/^Paused/);
        expect(
            scheduleGmailNote({ ...schedule, enabled: false }, false),
        ).toMatch(/^Connect Gmail/);
    });
});
