import type { DirectionFilter, InvoiceDirection } from "@/features/invoices";
import { percentChange, toNumber } from "@/shared/lib/money";
import type {
    CashFlowChartPoint,
    CashFlowDay,
    CashFlowHeadline,
    CashFlowOverview,
    CashFlowRange,
    CashFlowSeries,
    CurrencyCashFlow,
} from "./types";

export const CASH_FLOW_RANGES: ReadonlyArray<{
    value: CashFlowRange;
    label: string;
}> = [
    { value: "7d", label: "Last week" },
    { value: "14d", label: "Last 2 weeks" },
    { value: "30d", label: "Last month" },
];

/** What each direction is called next to its colour, in the chart legend and tooltip. */
export const DIRECTION_SERIES_LABELS: Record<InvoiceDirection, string> = {
    issued: "Issued by you",
    received: "From providers",
};

/** The section's title names what the chart shows. */
export const CASH_FLOW_TITLES: Record<DirectionFilter, string> = {
    all: "Cash flow",
    issued: "Invoiced",
    received: "Spending",
};

/** The directions a filter shows, money in first. */
export function visibleDirections(
    filter: DirectionFilter,
): readonly InvoiceDirection[] {
    return filter === "all" ? ["issued", "received"] : [filter];
}

/**
 * The dashboard headlines the currency with the most activity in the directions shown; totals are never mixed
 * across currencies, and income is never netted against spend in another currency.
 */
export function toCashFlowOverview(
    series: CashFlowSeries,
    filter: DirectionFilter,
): CashFlowOverview {
    const directions = visibleDirections(filter);
    const active = series.currencies
        .filter((entry) => invoiceCount(entry, directions) > 0)
        .toSorted((a, b) => activity(b, directions) - activity(a, directions));
    const [primary, ...others] = active;
    if (!primary) return { status: "empty", range: series.range, filter };
    return {
        status: "ready",
        range: series.range,
        filter,
        currency: primary.currency,
        headline: toHeadline(primary, filter),
        points: toChartPoints(primary.days, filter),
        otherCurrencies: others.map((entry) => entry.currency),
    };
}

function toHeadline(
    entry: CurrencyCashFlow,
    filter: DirectionFilter,
): CashFlowHeadline {
    if (filter === "all") {
        return {
            kind: "balance",
            net: toNumber(entry.issued.total) - toNumber(entry.received.total),
            invoiced: entry.issued.total,
            spent: entry.received.total,
            invoiceCount:
                entry.issued.invoiceCount + entry.received.invoiceCount,
        };
    }
    const totals = entry[filter];
    return {
        kind: "direction",
        direction: filter,
        total: totals.total,
        changePercent: percentChange(
            toNumber(totals.total),
            toNumber(totals.previousTotal),
        ),
        invoiceCount: totals.invoiceCount,
        average: toNumber(totals.total) / totals.invoiceCount,
    };
}

/** Money in goes up, money out goes down; a direction the filter hides is 0 so no bar is drawn for it. */
export function toChartPoints(
    days: CashFlowDay[],
    filter: DirectionFilter,
): CashFlowChartPoint[] {
    const shows = new Set(visibleDirections(filter));
    return days.map((day) => ({
        date: day.date,
        issued: shows.has("issued") ? toNumber(day.issued) : 0,
        // `|| 0` turns -0 (a day without spend) into 0, which formats without a sign.
        received: shows.has("received") ? -toNumber(day.received) || 0 : 0,
    }));
}

/** What the chart shows, for screen readers. */
export function chartCaption(
    filter: DirectionFilter,
    currency: string,
): string {
    const captions: Record<DirectionFilter, string> = {
        all: `Daily totals in ${currency}: invoices you issued above zero, invoices from providers below zero.`,
        issued: `Daily totals in ${currency} of the invoices you issued.`,
        received: `Daily totals in ${currency} of the invoices your providers sent you, below zero.`,
    };
    return captions[filter];
}

export function previousPeriodLabel(range: CashFlowRange): string {
    const labels: Record<CashFlowRange, string> = {
        "7d": "the week before",
        "14d": "the 2 weeks before",
        "30d": "the month before",
    };
    return labels[range];
}

function invoiceCount(
    entry: CurrencyCashFlow,
    directions: readonly InvoiceDirection[],
): number {
    return directions.reduce(
        (count, direction) => count + entry[direction].invoiceCount,
        0,
    );
}

function activity(
    entry: CurrencyCashFlow,
    directions: readonly InvoiceDirection[],
): number {
    return directions.reduce(
        (sum, direction) => sum + toNumber(entry[direction].total),
        0,
    );
}
