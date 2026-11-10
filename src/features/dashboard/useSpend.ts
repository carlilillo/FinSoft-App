import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSpend, fetchSummary } from "./insights.api";
import { toSpendOverview } from "./insights.model";
import type { SpendRange } from "./types";

export function useSpendOverview(range: SpendRange) {
    return useQuery({
        queryKey: ["spend", range],
        queryFn: () => fetchSpend(range),
        select: toSpendOverview,
        placeholderData: keepPreviousData,
    });
}

export function useDashboardSummary() {
    return useQuery({ queryKey: ["summary"], queryFn: fetchSummary });
}
