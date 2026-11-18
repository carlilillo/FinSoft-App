import { percentChange, toNumber } from "@/shared/lib/money";
import type {
    SpendChartPoint,
    SpendDay,
    SpendOverview,
    SpendRange,
    SpendSeries,
} from "./types";

export const SPEND_RANGES: ReadonlyArray<{ value: SpendRange; label: string }> =
    [
        { value: "7d", label: "Last week" },
        { value: "14d", label: "Last 2 weeks" },
        { value: "30d", label: "Last month" },
    ];

/** The dashboard headlines the currency with the most spend; totals are never mixed across currencies. */
export function toSpendOverview(series: SpendSeries): SpendOverview {
    const [primary, ...others] = series.currencies;
    if (!primary || primary.invoiceCount === 0)
        return { status: "empty", range: series.range };
    return {
        status: "ready",
        range: series.range,
        currency: primary.currency,
        total: primary.total,
        changePercent: percentChange(
            toNumber(primary.total),
            toNumber(primary.previousTotal),
        ),
        invoiceCount: primary.invoiceCount,
        average: toNumber(primary.total) / primary.invoiceCount,
        days: primary.days,
        otherCurrencies: others
            .filter((entry) => entry.invoiceCount > 0)
            .map((entry) => entry.currency),
    };
}

export function toSpendChartPoints(days: SpendDay[]): SpendChartPoint[] {
    return days.map((day) => ({ date: day.date, total: toNumber(day.total) }));
}

export function previousPeriodLabel(range: SpendRange): string {
    const labels: Record<SpendRange, string> = {
        "7d": "the week before",
        "14d": "the 2 weeks before",
        "30d": "the month before",
    };
    return labels[range];
}
