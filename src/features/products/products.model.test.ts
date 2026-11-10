import { describe, expect, it } from "vitest";
import { computePriceStats, toPriceChartPoints } from "./products.model";

const history = [
    {
        invoiceId: "a",
        invoiceNumber: "1",
        issueDate: "2026-10-01",
        currency: "EUR",
        quantity: 1,
        unitPriceNetCents: 1000,
        unitPriceGrossCents: null,
        vatRate: 21,
    },
    {
        invoiceId: "b",
        invoiceNumber: "2",
        issueDate: "2026-10-15",
        currency: "USD",
        quantity: 1,
        unitPriceNetCents: 900,
        unitPriceGrossCents: null,
        vatRate: null,
    },
    {
        invoiceId: "c",
        invoiceNumber: "3",
        issueDate: "2026-11-01",
        currency: "EUR",
        quantity: 2,
        unitPriceNetCents: 1100,
        unitPriceGrossCents: 1331,
        vatRate: 21,
    },
];

describe("price history", () => {
    it("keeps one currency and derives gross prices from the VAT rate when missing", () => {
        expect(toPriceChartPoints(history, "EUR")).toEqual([
            { date: "2026-10-01", net: 1000, gross: 1210, invoiceNumber: "1" },
            { date: "2026-11-01", net: 1100, gross: 1331, invoiceNumber: "3" },
        ]);
    });

    it("summarizes the change since the first purchase", () => {
        const stats = computePriceStats(
            toPriceChartPoints(history, "EUR"),
            "EUR",
        );
        expect(stats).toMatchObject({
            firstCents: 1000,
            lastCents: 1100,
            minCents: 1000,
            maxCents: 1100,
        });
        expect(stats?.changePercent).toBeCloseTo(10);
        expect(computePriceStats([], "EUR")).toBeNull();
    });
});
