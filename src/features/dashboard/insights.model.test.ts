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
                    total: "300.00",
                    previousTotal: "200.00",
                    invoiceCount: 3,
                    days: [],
                },
                {
                    currency: "GBP",
                    total: "12.00",
                    previousTotal: "0",
                    invoiceCount: 1,
                    days: [],
                },
            ],
        });
        expect(overview).toMatchObject({
            status: "ready",
            currency: "EUR",
            total: "300.00",
            changePercent: 50,
            average: 100,
            otherCurrencies: ["GBP"],
        });
    });
});
