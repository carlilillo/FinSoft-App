import { percentChange, toNumber } from "@/shared/lib/money";
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
            net: toNumber(point.unitPriceNet),
            netAmount: point.unitPriceNet,
            gross:
                point.unitPriceGross === null
                    ? grossFromRate(point)
                    : toNumber(point.unitPriceGross),
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
    const byPrice = points.toSorted((a, b) => a.net - b.net);
    return {
        currency,
        first: first.netAmount,
        last: last.netAmount,
        min: byPrice[0]?.netAmount ?? first.netAmount,
        max: byPrice.at(-1)?.netAmount ?? last.netAmount,
        changePercent: percentChange(last.net, first.net),
    };
}

/** Gross unit price for the chart when only the VAT rate is printed (display math, not rounded). */
function grossFromRate(point: PricePoint): number | null {
    if (point.vatRate === null) return null;
    return toNumber(point.unitPriceNet) * (1 + point.vatRate / 100);
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
