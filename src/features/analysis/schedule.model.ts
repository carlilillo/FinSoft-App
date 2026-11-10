import type { SegmentOption } from "@/shared/ui/types";
import type { AnalysisSchedule, ScheduleUpdate, Weekday } from "./types";

export const WEEKDAY_OPTIONS: ReadonlyArray<SegmentOption<Weekday>> = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
];

/** Whole hours only: the analysis always starts on the hour. */
export const HOUR_OPTIONS: ReadonlyArray<SegmentOption<string>> = Array.from(
    { length: 24 },
    (_, hour) => ({ value: String(hour), label: formatHour(hour) }),
);

export function formatHour(hour: number): string {
    return `${String(hour).padStart(2, "0")}:00`;
}

/** The person's IANA zone; the hour they pick is read in it, so 09:00 stays 09:00 after DST changes. */
export function browserTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

/** The saved schedule with a change applied, always re-anchored to the zone the person is in now. */
export function applyScheduleChange(
    schedule: AnalysisSchedule,
    patch: Partial<ScheduleUpdate>,
    timeZone: string,
): ScheduleUpdate {
    return {
        enabled: schedule.enabled,
        weekday: schedule.weekday,
        hour: schedule.hour,
        ...patch,
        timeZone,
    };
}

/** "Next analysis on Monday 17 Nov at 09:00", or what is still being worked out. */
export function describeNextRun(
    schedule: AnalysisSchedule,
    locale?: string,
): string {
    if (!schedule.nextRunAt) return "Working out the next analysis…";
    const next = new Date(schedule.nextRunAt);
    const day = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "short",
    }).format(next);
    const time = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).format(next);
    return `Next analysis on ${day} at ${time}`;
}

/** Why the switch reads the way it does when Gmail isn't connected, or null when it is. */
export function scheduleGmailNote(
    schedule: AnalysisSchedule,
    isGmailConnected: boolean,
): string | null {
    if (isGmailConnected) return null;
    return schedule.enabled
        ? "Paused: reconnect Gmail and the weekly analysis picks up again."
        : "Connect Gmail first to analyze your inbox every week.";
}
