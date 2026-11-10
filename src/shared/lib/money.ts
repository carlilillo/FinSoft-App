/** All amounts travel as integer cents; this is the only place they become decimals. */
export function centsToAmount(cents: number): number {
    return cents / 100;
}

export function formatMoney(
    cents: number,
    currency: string,
    locale?: string,
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
    }).format(centsToAmount(cents));
}

/** Compact form for axes: €2.5K, €120, €0.89 (small amounts keep their cents). */
export function formatMoneyCompact(
    cents: number,
    currency: string,
    locale?: string,
): string {
    const amount = centsToAmount(cents);
    const isLarge = Math.abs(amount) >= 1000;
    const fractionDigits = isLarge || Math.abs(amount) >= 100 ? 1 : 2;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        notation: isLarge ? "compact" : "standard",
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
    }).format(amount);
}

/** Relative change between two totals, or null when there is no previous value to compare with. */
export function percentChange(
    current: number,
    previous: number,
): number | null {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
}

export function formatPercent(value: number, locale?: string): string {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(value)}%`;
}
