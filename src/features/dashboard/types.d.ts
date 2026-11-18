import type { ReactNode } from "react";
import type { InvoiceSummary } from "@/features/invoices";
import type { Amount } from "@/shared/lib/money";

export type SpendRange = "7d" | "14d" | "30d";

export type SpendDay = { date: string; total: Amount };

/** A day as the chart plots it: a number for the y position only. */
export type SpendChartPoint = { date: string; total: number };

export type CurrencySpend = {
    currency: string;
    total: Amount;
    previousTotal: Amount;
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
          total: Amount;
          changePercent: number | null;
          invoiceCount: number;
          /** Display math, not an exact amount. */
          average: number;
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
