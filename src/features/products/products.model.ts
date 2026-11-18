import type { DirectionFilter, InvoiceDirection } from "@/features/invoices";
import { type Amount, percentChange, toNumber } from "@/shared/lib/money";
import type {
    ProductColumnLabels,
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
            gross: toNumberOrNull(grossUnitPrice(point)),
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

/**
 * Gross unit price: the exact printed amount, or net plus VAT as a number when only the rate is printed
 * (display math, rounded only when formatted). Null when the invoice gives neither.
 */
export function grossUnitPrice(point: PricePoint): Amount | number | null {
    if (point.unitPriceGross !== null) return point.unitPriceGross;
    if (point.vatRate === null) return null;
    return toNumber(point.unitPriceNet) * (1 + point.vatRate / 100);
}

function toNumberOrNull(value: Amount | number | null): number | null {
    return typeof value === "string" ? toNumber(value) : value;
}

export function mainCurrency(product: ProductDetail): string {
    return (
        product.lastCurrency ?? product.priceHistory.at(-1)?.currency ?? "EUR"
    );
}

/** Products the person sells name their customer ("Sold to …"); products they buy, their provider. */
export function productSubtitle(
    product: Pick<ProductDetail, "direction" | "vendorName" | "sku">,
): string {
    const company =
        product.direction === "issued"
            ? `Sold to ${product.vendorName}`
            : product.vendorName;
    return product.sku ? `${company} · ${product.sku}` : company;
}

/** The invoice lines of a product: what the person bought, or what they sold. */
export function productHistoryTitle(direction: InvoiceDirection): string {
    return direction === "issued" ? "Sales" : "Purchases";
}

export const PRODUCT_PAGE_DESCRIPTIONS: Record<DirectionFilter, string> = {
    all: "Everything you buy and sell, with the price on its latest invoice.",
    issued: "Everything you've sold to your customers, with the price you charged last time.",
    received: "Everything you've bought, with the price you paid last time.",
};

export function productColumnLabels(
    filter: DirectionFilter,
): ProductColumnLabels {
    const labels: Record<DirectionFilter, ProductColumnLabels> = {
        all: { count: "Invoices", last: "Last invoiced" },
        issued: { count: "Sales", last: "Last sold" },
        received: { count: "Purchases", last: "Last bought" },
    };
    return labels[filter];
}
