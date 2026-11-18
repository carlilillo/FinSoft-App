/**
 * Money travels as exact decimal strings ("106.00", "0.00000023148148"), never as floats, so a unit price
 * billed per MB-minute keeps every decimal. Never use `+`, `-` or `<` on these strings: format them as they
 * are, and convert with `toNumber` only for display math (chart positions, averages, percentages).
 */
export type Amount = string;

/** Approximate value for plotting and display math only; never send it back to the server. */
export function toNumber(amount: Amount): number {
    return Number(amount);
}

/** Flips the sign of an exact amount without going through floats. */
export function negate(amount: Amount): Amount {
    if (Number(amount) === 0) return amount;
    return amount.startsWith("-") ? amount.slice(1) : `-${amount}`;
}

/**
 * An exact amount (string) is shown with every decimal it has, and at least the currency's own
 * ("106.00", "$0.00000023148148"). A computed number (an average, a chart value) is rounded to the
 * currency's decimals, but a sub-cent value keeps 3 significant digits instead of collapsing to 0.
 */
export function formatMoney(
    amount: Amount | number,
    currency: string,
    locale?: string,
): string {
    return formatCurrency(amount, currency, locale, "auto");
}

/**
 * Like `formatMoney`, but always shows the sign, where the locale puts it: "+€1,210.00" for money coming in,
 * "-€80.50" for money going out. Zero has no sign.
 */
export function formatSignedMoney(
    amount: Amount | number,
    currency: string,
    locale?: string,
): string {
    return formatCurrency(amount, currency, locale, "exceptZero");
}

function formatCurrency(
    amount: Amount | number,
    currency: string,
    locale: string | undefined,
    signDisplay: "auto" | "exceptZero",
): string {
    const digits = currencyDigits(currency, locale);
    const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: digits,
        signDisplay,
    };
    if (typeof amount === "string")
        return new Intl.NumberFormat(locale, {
            ...options,
            maximumFractionDigits: 20,
        }).format(amount as Intl.StringNumericLiteral);
    return new Intl.NumberFormat(locale, {
        ...options,
        maximumFractionDigits: digits,
        maximumSignificantDigits: 3,
        roundingPriority: "morePrecision",
    }).format(amount);
}

/** Compact form for axes: €2.5K, €120, €0.89, and sub-cent rates like $0.00000023. */
export function formatMoneyCompact(
    amount: Amount | number,
    currency: string,
    locale?: string,
): string {
    const value = typeof amount === "string" ? toNumber(amount) : amount;
    const magnitude = Math.abs(value);
    const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
    };
    if (magnitude > 0 && magnitude < 0.01)
        return new Intl.NumberFormat(locale, {
            ...options,
            maximumSignificantDigits: 2,
        }).format(value);
    const isLarge = magnitude >= 1000;
    return new Intl.NumberFormat(locale, {
        ...options,
        notation: isLarge ? "compact" : "standard",
        minimumFractionDigits: 0,
        maximumFractionDigits: isLarge || magnitude >= 100 ? 1 : 2,
    }).format(value);
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

/** Decimals the currency uses: 2 for EUR, 0 for JPY, 3 for KWD. */
function currencyDigits(currency: string, locale?: string): number {
    return (
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
        }).resolvedOptions().maximumFractionDigits ?? 2
    );
}
