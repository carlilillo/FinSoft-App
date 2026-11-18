export type { CashFlowSeries, DashboardSummary } from "./types";

export const loadDashboardPage = () =>
    import("./DashboardPage").then((module) => module.DashboardPage);
