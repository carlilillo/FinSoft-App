import type { UseQueryResult } from "@tanstack/react-query";
import type { Page } from "@/shared/types";

export type ProductSummary = {
    id: string;
    displayName: string;
    sku: string | null;
    unit: string | null;
    vendorId: string;
    vendorName: string;
    purchaseCount: number;
    lastUnitPriceNetCents: number | null;
    lastUnitPriceGrossCents: number | null;
    lastCurrency: string | null;
    lastPurchasedAt: string | null;
};

export type PricePoint = {
    invoiceId: string;
    invoiceNumber: string | null;
    issueDate: string;
    currency: string;
    quantity: number;
    unitPriceNetCents: number;
    unitPriceGrossCents: number | null;
    vatRate: number | null;
};

export type ProductDetail = ProductSummary & { priceHistory: PricePoint[] };

export type ProductPage = Page<ProductSummary>;

export type PriceSeries = "net" | "gross";

export type PriceChartPoint = {
    date: string;
    net: number;
    gross: number | null;
    invoiceNumber: string | null;
};

export type PriceStats = {
    currency: string;
    firstCents: number;
    lastCents: number;
    minCents: number;
    maxCents: number;
    changePercent: number | null;
};

export type ProductListProps = { products: ProductSummary[] };
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
};
export type PurchaseTableProps = { points: PricePoint[] };
export type PriceSectionProps = { points: PriceChartPoint[]; currency: string };
export type ProductBodyProps = { product: ProductDetail };
