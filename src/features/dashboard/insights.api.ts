import { apiGet } from "@/shared/lib/http";
import type { DashboardSummary, SpendRange, SpendSeries } from "./types";

export function fetchSpend(range: SpendRange): Promise<SpendSeries> {
    return apiGet<SpendSeries>(`/insights/spend?range=${range}`);
}

export function fetchSummary(): Promise<DashboardSummary> {
    return apiGet<DashboardSummary>("/insights/summary");
}
