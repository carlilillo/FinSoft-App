import { type DirectionFilter, directionParam } from "@/features/invoices";
import { apiGet } from "@/shared/lib/http";
import type { CashFlowRange, CashFlowSeries, DashboardSummary } from "./types";

export function fetchCashFlow(range: CashFlowRange): Promise<CashFlowSeries> {
    return apiGet<CashFlowSeries>(`/insights/cash-flow?range=${range}`);
}

export function fetchSummary(
    filter: DirectionFilter,
): Promise<DashboardSummary> {
    const direction = directionParam(filter);
    return apiGet<DashboardSummary>(
        direction
            ? `/insights/summary?direction=${direction}`
            : "/insights/summary",
    );
}
