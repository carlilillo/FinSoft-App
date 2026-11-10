import { describe, expect, it } from "vitest";
import {
    centsToAmount,
    formatMoney,
    formatMoneyCompact,
    percentChange,
} from "./money";

describe("money", () => {
    it("turns cents into amounts only at the edge", () => {
        expect(centsToAmount(10600)).toBe(106);
        expect(formatMoney(10600, "EUR", "es-ES")).toBe("106,00\u00a0€");
        expect(formatMoney(1200, "GBP", "en-GB")).toBe("£12.00");
    });

    it("computes relative change, or null without a baseline", () => {
        expect(percentChange(150, 100)).toBe(50);
        expect(percentChange(100, 0)).toBeNull();
    });
});

describe("formatMoneyCompact", () => {
    it("keeps cents on small axis values and compacts large ones", () => {
        expect(formatMoneyCompact(89, "EUR", "en")).toBe("€0.89");
        expect(formatMoneyCompact(12000, "EUR", "en")).toBe("€120");
        expect(formatMoneyCompact(250000, "EUR", "en")).toBe("€2.5K");
    });
});
