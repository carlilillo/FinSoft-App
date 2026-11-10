/** Dates from the API are ISO strings: "2026-11-03" (calendar dates) or full timestamps. */
export function formatDate(iso: string, locale?: string): string {
    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(toDate(iso));
}

export function formatShortDate(iso: string, locale?: string): string {
    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
    }).format(toDate(iso));
}

export function formatDateTime(iso: string, locale?: string): string {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(iso));
}

/** Relative phrases are part of English copy ("active 5 minutes ago"), so they stay in English. */
export function formatRelative(
    iso: string,
    now: Date = new Date(),
    locale = "en",
): string {
    const minutes = Math.round(
        (new Date(iso).getTime() - now.getTime()) / 60_000,
    );
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
    return formatter.format(Math.round(hours / 24), "day");
}

/** Calendar dates are parsed at UTC noon so they never shift a day in any timezone. */
function toDate(iso: string): Date {
    return iso.length === 10 ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
}
