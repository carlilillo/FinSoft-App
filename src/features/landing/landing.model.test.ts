import { describe, expect, it } from "vitest";
import {
    PAPER_PRICES,
    SAMPLE_EMAILS,
    SAMPLE_INVOICES,
} from "./landing.content";
import {
    emailRowState,
    grossCents,
    nearestPointIndex,
    percentChangeBetween,
    priceChart,
    siftProgress,
    siftStatus,
    stackPose,
} from "./landing.model";

describe("sample content", () => {
    it("keeps every sample invoice arithmetically consistent", () => {
        for (const invoice of SAMPLE_INVOICES) {
            const lines = invoice.lines.reduce(
                (sum, line) => sum + line.totalCents,
                0,
            );
            expect(lines).toBe(invoice.subtotalCents);
            expect(
                invoice.subtotalCents +
                    invoice.vatCents -
                    (invoice.withholdingCents ?? 0),
            ).toBe(invoice.totalCents);
        }
    });
});

describe("siftProgress", () => {
    it("collects invoices in the order their emails are reviewed", () => {
        const progress = siftProgress(SAMPLE_EMAILS, SAMPLE_INVOICES, 4);
        expect(progress.found.map((invoice) => invoice.id)).toEqual([
            "brew",
            "power",
        ]);
        expect(progress.isDone).toBe(false);
        expect(siftStatus(progress)).toBe("Reviewing 5 of 6 emails");
    });

    it("finishes with the detailed invoice on top", () => {
        const progress = siftProgress(SAMPLE_EMAILS, SAMPLE_INVOICES, 99);
        expect(progress.isDone).toBe(true);
        expect(progress.found.at(-1)?.id).toBe("stationery");
        expect(siftStatus(progress)).toBe("3 invoices in 6 emails");
    });

    it("marks the email being read as scanning", () => {
        const email = SAMPLE_EMAILS[1]!;
        expect(emailRowState(email, 1, 1)).toBe("scanning");
        expect(emailRowState(email, 1, 0)).toBe("waiting");
        expect(emailRowState(email, 1, 2)).toBe("invoice");
    });
});

describe("stackPose", () => {
    it("keeps the top card in place and lifts and shrinks the ones behind it", () => {
        expect(stackPose(0)).toEqual({ y: 0, scale: 1 });
        expect(stackPose(2)).toEqual({ y: -28, scale: 0.9 });
    });
});

describe("price chart", () => {
    it("adds VAT to the net price, rounding to the cent", () => {
        expect(grossCents(1500, 21)).toBe(1815);
        expect(grossCents(1420, 21)).toBe(1718);
    });

    it("reports the change between the first and last price", () => {
        expect(percentChangeBetween(PAPER_PRICES)).toBeCloseTo(11.11, 2);
    });

    it("draws a stepped line inside the frame, higher prices higher up", () => {
        const chart = priceChart(PAPER_PRICES, 21);
        expect(chart.path.startsWith("M ")).toBe(true);
        expect(chart.path).toContain("H ");
        const [first, , , last] = chart.points;
        expect(last!.y).toBeLessThan(first!.y);
        for (const point of chart.points) {
            expect(point.y).toBeGreaterThan(0);
            expect(point.y).toBeLessThan(chart.height);
        }
    });

    it("finds the point nearest the pointer", () => {
        expect(nearestPointIndex([10, 50, 90], 62)).toBe(1);
        expect(nearestPointIndex([10, 50, 90], 200)).toBe(2);
    });
});
