import type { UseQueryResult } from "@tanstack/react-query";
import type { DirectionFilter, InvoiceDirection } from "@/features/invoices";
import type { Amount } from "@/shared/lib/money";
import type { Page } from "@/shared/types";

export type ProductSummary = {
    id: string;
    /** "received": bought from the vendor (a provider); "issued": sold to the vendor (a customer). */
    direction: InvoiceDirection;
    displayName: string;
    sku: string | null;
    unit: string | null;
    vendorId: string;
    vendorName: string;
    purchaseCount: number;
    lastUnitPriceNet: Amount | null;
    lastUnitPriceGross: Amount | null;
    lastCurrency: string | null;
    lastPurchasedAt: string | null;
};

export type PricePoint = {
    invoiceId: string;
    invoiceNumber: string | null;
    issueDate: string;
    currency: string;
    quantity: number;
    unitPriceNet: Amount;
    unitPriceGross: Amount | null;
    vatRate: number | null;
};

export type ProductDetail = ProductSummary & { priceHistory: PricePoint[] };

export type ProductPage = Page<ProductSummary>;

export type PriceSeries = "net" | "gross";

/** Chart values are numbers (positions only); `netAmount` keeps the exact price for display. */
export type PriceChartPoint = {
    date: string;
    net: number;
    netAmount: Amount;
    gross: number | null;
    invoiceNumber: string | null;
};

export type PriceStats = {
    currency: string;
    first: Amount;
    last: Amount;
    min: Amount;
    max: Amount;
    changePercent: number | null;
};

export type ProductListProps = { products: ProductSummary[] };
export type ProductTableProps = {
    products: ProductSummary[];
    filter: DirectionFilter;
};

/** Column names that follow what the table lists: purchases, sales, or both. */
export type ProductColumnLabels = { count: string; last: string };
export type ProductRowProps = { product: ProductSummary };
export type PriceHistoryChartProps = {
    points: PriceChartPoint[];
    currency: string;
    series: PriceSeries;
};
export type PriceStatsProps = { stats: PriceStats };
export type PriceTooltipProps = {
    active?: boolean;
    payload?: ReadonlyArray<{
        value?: number | string | null;
        payload?: PriceChartPoint;
    }>;
    currency: string;
};
export type ProductResultsProps = {
    query: UseQueryResult<ProductPage>;
    search: string;
    filter: DirectionFilter;
};
export type PurchaseTableProps = { points: PricePoint[] };
export type PriceSectionProps = { points: PriceChartPoint[]; currency: string };
export type ProductBodyProps = { product: ProductDetail };
