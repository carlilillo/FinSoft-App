import type { ReactNode } from "react";
import type { InvoiceSummary } from "@/features/invoices";

export type SpendRange = "7d" | "14d" | "30d";

export type SpendDay = { date: string; totalCents: number };

export type CurrencySpend = {
    currency: string;
    totalCents: number;
    previousTotalCents: number;
    invoiceCount: number;
    days: SpendDay[];
};

export type SpendSeries = {
    range: SpendRange;
    from: string;
    to: string;
    currencies: CurrencySpend[];
};

export type DashboardSummary = {
    invoiceCount: number;
    recentInvoices: InvoiceSummary[];
};

export type SpendOverview =
    | { status: "empty"; range: SpendRange }
    | {
          status: "ready";
          range: SpendRange;
          currency: string;
          totalCents: number;
          changePercent: number | null;
          invoiceCount: number;
          averageCents: number;
          days: SpendDay[];
          otherCurrencies: string[];
      };

export type SpendChartProps = {
    days: SpendDay[];
    currency: string;
    range: SpendRange;
};
export type SpendHeadlineProps = {
    overview: Extract<SpendOverview, { status: "ready" }>;
};
export type RecentInvoicesProps = { invoices: InvoiceSummary[] };

export type ChartTooltipProps = {
    active?: boolean;
    payload?: ReadonlyArray<{
        value?: number | string | null;
        payload?: { date?: string };
    }>;
    currency: string;
};

export type KpiProps = { label: string; children: ReactNode };

export type SpendSectionProps = { range: SpendRange };
