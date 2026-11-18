import type { ReactNode } from "react";
import type {
    DirectionFilter,
    InvoiceDirection,
    InvoiceSummary,
} from "@/features/invoices";
import type { Amount } from "@/shared/lib/money";

export type CashFlowRange = "7d" | "14d" | "30d";

/** One direction's figures over the window: what the person invoiced (issued) or was billed (received). */
export type DirectionTotals = {
    total: Amount;
    previousTotal: Amount;
    invoiceCount: number;
};

/** Both amounts are positive, as the server sends them; the chart signs them. */
export type CashFlowDay = { date: string; issued: Amount; received: Amount };

export type CurrencyCashFlow = {
    currency: string;
    issued: DirectionTotals;
    received: DirectionTotals;
    days: CashFlowDay[];
};

export type CashFlowSeries = {
    range: CashFlowRange;
    from: string;
    to: string;
    currencies: CurrencyCashFlow[];
};

/** A day as the chart plots it: numbers for positions only; money in is above zero, money out below. */
export type CashFlowChartPoint = {
    date: string;
    issued: number;
    received: number;
};

export type DashboardSummary = {
    invoiceCount: number;
    recentInvoices: InvoiceSummary[];
};

/**
 * The headline over the chart. With every invoice shown it is the balance (invoiced minus billed); with one
 * direction, that direction's total compared with the previous period.
 */
export type CashFlowHeadline =
    | {
          kind: "balance";
          /** Display math, not an exact amount. */
          net: number;
          invoiced: Amount;
          spent: Amount;
          invoiceCount: number;
      }
    | {
          kind: "direction";
          direction: InvoiceDirection;
          total: Amount;
          changePercent: number | null;
          invoiceCount: number;
          /** Display math, not an exact amount. */
          average: number;
      };

export type CashFlowOverview =
    | { status: "empty"; range: CashFlowRange; filter: DirectionFilter }
    | {
          status: "ready";
          range: CashFlowRange;
          filter: DirectionFilter;
          currency: string;
          headline: CashFlowHeadline;
          points: CashFlowChartPoint[];
          otherCurrencies: string[];
      };

export type ReadyCashFlow = Extract<CashFlowOverview, { status: "ready" }>;

export type CashFlowChartProps = {
    points: CashFlowChartPoint[];
    currency: string;
    range: CashFlowRange;
    filter: DirectionFilter;
};
export type CashFlowHeadlineProps = { overview: ReadyCashFlow };
export type RecentInvoicesProps = { invoices: InvoiceSummary[] };

export type ChartTooltipProps = {
    active?: boolean;
    payload?: ReadonlyArray<{ payload?: Partial<CashFlowChartPoint> }>;
    currency: string;
    filter: DirectionFilter;
};

export type ChartLegendProps = { directions: readonly InvoiceDirection[] };

export type KpiProps = { label: string; children: ReactNode };
export type OtherCurrenciesProps = { currencies: string[] };

export type CashFlowSectionProps = {
    range: CashFlowRange;
    filter: DirectionFilter;
};
export type RecentSectionProps = { filter: DirectionFilter };
