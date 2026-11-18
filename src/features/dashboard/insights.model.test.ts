import { describe, expect, it } from "vitest";
import { toCashFlowOverview, toChartPoints } from "./insights.model";
import type { CashFlowSeries, CurrencyCashFlow } from "./types";

const totals = (
    total: string,
    previousTotal: string,
    invoiceCount: number,
) => ({
    total,
    previousTotal,
    invoiceCount,
});

const eur: CurrencyCashFlow = {
    currency: "EUR",
    issued: totals("1200.00", "800.00", 2),
    received: totals("300.00", "200.00", 3),
    days: [{ date: "2026-11-09", issued: "1200.00", received: "300.00" }],
};

const gbp: CurrencyCashFlow = {
    currency: "GBP",
    issued: totals("0", "0", 0),
    received: totals("12.00", "0", 1),
    days: [{ date: "2026-11-09", issued: "0", received: "12.00" }],
};

const series = (currencies: CurrencyCashFlow[]): CashFlowSeries => ({
    range: "14d",
    from: "2026-10-27",
    to: "2026-11-09",
    currencies,
});

describe("toCashFlowOverview", () => {
    it("is empty when there are no invoices", () => {
        expect(toCashFlowOverview(series([]), "all")).toEqual({
            status: "empty",
            range: "14d",
            filter: "all",
        });
    });

    it("headlines the balance when every invoice is shown", () => {
        expect(toCashFlowOverview(series([eur, gbp]), "all")).toMatchObject({
            status: "ready",
            currency: "EUR",
            headline: {
                kind: "balance",
                net: 900,
                invoiced: "1200.00",
                spent: "300.00",
                invoiceCount: 5,
            },
            otherCurrencies: ["GBP"],
        });
    });

    it("headlines what was invoiced when only the person's invoices are shown", () => {
        expect(toCashFlowOverview(series([eur, gbp]), "issued")).toMatchObject({
            status: "ready",
            currency: "EUR",
            headline: {
                kind: "direction",
                direction: "issued",
                total: "1200.00",
                changePercent: 50,
                average: 600,
            },
            // GBP has no invoices issued by the person.
            otherCurrencies: [],
        });
    });

    it("headlines the spend when only provider invoices are shown", () => {
        expect(
            toCashFlowOverview(series([eur, gbp]), "received"),
        ).toMatchObject({
            currency: "EUR",
            headline: {
                kind: "direction",
                direction: "received",
                total: "300.00",
            },
            otherCurrencies: ["GBP"],
        });
    });

    it("is empty when the chosen direction has no invoices", () => {
        expect(toCashFlowOverview(series([gbp]), "issued").status).toBe(
            "empty",
        );
    });
});

describe("toChartPoints", () => {
    it("puts money in above zero and money out below", () => {
        expect(toChartPoints(eur.days, "all")).toEqual([
            { date: "2026-11-09", issued: 1200, received: -300 },
        ]);
    });

    it("zeroes the direction the filter hides", () => {
        expect(toChartPoints(eur.days, "issued")[0]).toMatchObject({
            issued: 1200,
            received: 0,
        });
        expect(toChartPoints(eur.days, "received")[0]).toMatchObject({
            issued: 0,
            received: -300,
        });
    });
});
