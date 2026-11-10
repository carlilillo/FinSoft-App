export type { DashboardSummary, SpendSeries } from "./types";

export const loadDashboardPage = () =>
    import("./DashboardPage").then((module) => module.DashboardPage);
