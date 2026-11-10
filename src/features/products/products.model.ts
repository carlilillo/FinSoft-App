import { percentChange } from "@/shared/lib/money";
import type {
    PriceChartPoint,
    PricePoint,
    PriceStats,
    ProductDetail,
} from "./types";

/** Chart rows in the product's main currency (the most recent purchase's), oldest first. */
export function toPriceChartPoints(
    history: PricePoint[],
    currency: string,
): PriceChartPoint[] {
    return history
        .filter((point) => point.currency === currency)
        .map((point) => ({
            date: point.issueDate,
            net: point.unitPriceNetCents,
            gross: point.unitPriceGrossCents ?? grossFromRate(point),
            invoiceNumber: point.invoiceNumber,
        }));
}

export function computePriceStats(
    points: PriceChartPoint[],
    currency: string,
): PriceStats | null {
    const first = points[0];
    const last = points.at(-1);
    if (!first || !last) return null;
    const nets = points.map((point) => point.net);
    return {
        currency,
        firstCents: first.net,
        lastCents: last.net,
        minCents: Math.min(...nets),
        maxCents: Math.max(...nets),
        changePercent: percentChange(last.net, first.net),
    };
}

function grossFromRate(point: PricePoint): number | null {
    if (point.vatRate === null) return null;
    return Math.round(point.unitPriceNetCents * (1 + point.vatRate / 100));
}

export function mainCurrency(product: ProductDetail): string {
    return (
        product.lastCurrency ?? product.priceHistory.at(-1)?.currency ?? "EUR"
    );
}

export function productSubtitle(
    product: Pick<ProductDetail, "vendorName" | "sku">,
): string {
    return product.sku
        ? `${product.vendorName} · ${product.sku}`
        : product.vendorName;
}
