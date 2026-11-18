import { describe, expect, it } from "vitest";
import {
    computePriceStats,
    grossUnitPrice,
    productColumnLabels,
    productSubtitle,
    toPriceChartPoints,
} from "./products.model";

const history = [
    {
        invoiceId: "a",
        invoiceNumber: "1",
        issueDate: "2026-10-01",
        currency: "EUR",
        quantity: 1,
        unitPriceNet: "10.00",
        unitPriceGross: null,
        vatRate: 21,
    },
    {
        invoiceId: "b",
        invoiceNumber: "2",
        issueDate: "2026-10-15",
        currency: "USD",
        quantity: 1,
        unitPriceNet: "9.00",
        unitPriceGross: null,
        vatRate: null,
    },
    {
        invoiceId: "c",
        invoiceNumber: "3",
        issueDate: "2026-11-01",
        currency: "EUR",
        quantity: 2,
        unitPriceNet: "11.00",
        unitPriceGross: "13.31",
        vatRate: 21,
    },
];

describe("price history", () => {
    it("keeps one currency and derives gross prices from the VAT rate when missing", () => {
        const [first, second] = toPriceChartPoints(history, "EUR");
        expect(first).toMatchObject({
            date: "2026-10-01",
            net: 10,
            netAmount: "10.00",
            invoiceNumber: "1",
        });
        expect(first?.gross).toBeCloseTo(12.1);
        expect(second).toEqual({
            date: "2026-11-01",
            net: 11,
            netAmount: "11.00",
            gross: 13.31,
            invoiceNumber: "3",
        });
    });

    it("prefers the printed gross price and derives it from the VAT rate otherwise", () => {
        const [fromRate, noVat, printed] = history;
        expect(grossUnitPrice(fromRate!)).toBeCloseTo(12.1);
        expect(grossUnitPrice(noVat!)).toBeNull();
        expect(grossUnitPrice(printed!)).toBe("13.31");
    });

    it("summarizes the change since the first purchase", () => {
        const stats = computePriceStats(
            toPriceChartPoints(history, "EUR"),
            "EUR",
        );
        expect(stats).toMatchObject({
            first: "10.00",
            last: "11.00",
            min: "10.00",
            max: "11.00",
        });
        expect(stats?.changePercent).toBeCloseTo(10);
        expect(computePriceStats([], "EUR")).toBeNull();
    });

    it("keeps sub-cent usage rates exact for display", () => {
        const usage = [
            {
                ...history[0]!,
                unitPriceNet: "0.00000023148148",
                vatRate: null,
            },
        ];
        const stats = computePriceStats(
            toPriceChartPoints(usage, "EUR"),
            "EUR",
        );
        expect(stats?.last).toBe("0.00000023148148");
    });
});

describe("products you sell and products you buy", () => {
    it("names the customer of a product you sell", () => {
        expect(
            productSubtitle({
                direction: "issued",
                vendorName: "Acme S.L.",
                sku: null,
            }),
        ).toBe("Sold to Acme S.L.");
        expect(
            productSubtitle({
                direction: "received",
                vendorName: "Makro",
                sku: "A-1",
            }),
        ).toBe("Makro · A-1");
    });

    it("names the columns after what the table lists", () => {
        expect(productColumnLabels("received").count).toBe("Purchases");
        expect(productColumnLabels("issued").last).toBe("Last sold");
        expect(productColumnLabels("all").count).toBe("Invoices");
    });
});
