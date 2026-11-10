import { describe, expect, it } from "vitest";
import { toSpendOverview } from "./insights.model";

describe("toSpendOverview", () => {
    it("is empty when nothing was spent", () => {
        expect(
            toSpendOverview({
                range: "7d",
                from: "a",
                to: "b",
                currencies: [],
            }),
        ).toEqual({ status: "empty", range: "7d" });
    });

    it("headlines the main currency and never mixes currencies", () => {
        const overview = toSpendOverview({
            range: "14d",
            from: "2026-10-27",
            to: "2026-11-09",
            currencies: [
                {
                    currency: "EUR",
                    totalCents: 30000,
                    previousTotalCents: 20000,
                    invoiceCount: 3,
                    days: [],
                },
                {
                    currency: "GBP",
                    totalCents: 1200,
                    previousTotalCents: 0,
                    invoiceCount: 1,
                    days: [],
                },
            ],
        });
        expect(overview).toMatchObject({
            status: "ready",
            currency: "EUR",
            totalCents: 30000,
            changePercent: 50,
            averageCents: 10000,
            otherCurrencies: ["GBP"],
        });
    });
});
