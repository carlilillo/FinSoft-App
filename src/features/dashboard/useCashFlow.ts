import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DirectionFilter } from "@/features/invoices";
import { fetchCashFlow, fetchSummary } from "./insights.api";
import { toCashFlowOverview } from "./insights.model";
import type { CashFlowRange } from "./types";

/** One request per period; switching the direction filter re-reads the same data. */
export function useCashFlowOverview(
    range: CashFlowRange,
    filter: DirectionFilter,
) {
    return useQuery({
        queryKey: ["cash-flow", range],
        queryFn: () => fetchCashFlow(range),
        select: (series) => toCashFlowOverview(series, filter),
        placeholderData: keepPreviousData,
    });
}

export function useDashboardSummary(filter: DirectionFilter) {
    return useQuery({
        queryKey: ["summary", filter],
        queryFn: () => fetchSummary(filter),
        placeholderData: keepPreviousData,
    });
}
