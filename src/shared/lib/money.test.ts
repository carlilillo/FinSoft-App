import { describe, expect, it } from "vitest";
import {
    formatMoney,
    formatMoneyCompact,
    formatSignedMoney,
    negate,
    percentChange,
    toNumber,
} from "./money";

describe("formatSignedMoney", () => {
    it("signs money in and money out where the locale puts the sign", () => {
        expect(formatSignedMoney("1210.00", "EUR", "en")).toBe("+€1,210.00");
        expect(formatSignedMoney("-80.50", "EUR", "en")).toBe("-€80.50");
        expect(formatSignedMoney("1210.00", "EUR", "es-ES")).toBe(
            "+1210,00\u00a0€",
        );
    });

    it("never signs zero, negative zero included", () => {
        expect(formatSignedMoney(0, "EUR", "en")).toBe("€0");
        expect(formatSignedMoney(-0, "EUR", "en")).toBe("€0");
        expect(formatSignedMoney("0", "EUR", "en")).toBe("€0.00");
    });
});

describe("formatMoney", () => {
    it("shows exact amounts with the currency's decimals", () => {
        expect(formatMoney("106.00", "EUR", "es-ES")).toBe("106,00 €");
        expect(formatMoney("12", "GBP", "en-GB")).toBe("£12.00");
        expect(formatMoney("1234", "JPY", "en")).toBe("¥1,234");
        expect(formatMoney("1.250", "KWD", "en")).toBe("KWD 1.250");
    });

    it("keeps every decimal of sub-cent unit prices", () => {
        expect(formatMoney("0.00000023148148", "USD", "en")).toBe(
            "$0.00000023148148",
        );
        expect(formatMoney("0.00005", "USD", "en")).toBe("$0.00005");
    });

    it("rounds computed numbers to the currency, without hiding sub-cent values", () => {
        expect(formatMoney(12.3456, "EUR", "en")).toBe("€12.35");
        expect(formatMoney(0.000000280092591, "USD", "en")).toBe("$0.00000028");
    });
});

describe("amount helpers", () => {
    it("negates exactly", () => {
        expect(negate("150.00")).toBe("-150.00");
        expect(negate("-0.5")).toBe("0.5");
        expect(negate("0.00")).toBe("0.00");
    });

    it("converts to a number only for display math", () => {
        expect(toNumber("10.73")).toBe(10.73);
    });

    it("computes relative change, or null without a baseline", () => {
        expect(percentChange(150, 100)).toBe(50);
        expect(percentChange(100, 0)).toBeNull();
    });
});

describe("formatMoneyCompact", () => {
    it("keeps cents on small axis values and compacts large ones", () => {
        expect(formatMoneyCompact("0.89", "EUR", "en")).toBe("€0.89");
        expect(formatMoneyCompact(120, "EUR", "en")).toBe("€120");
        expect(formatMoneyCompact(2500, "EUR", "en")).toBe("€2.5K");
    });

    it("does not round sub-cent axis values to zero", () => {
        expect(formatMoneyCompact(0.00000023148148, "USD", "en")).toBe(
            "$0.00000023",
        );
        expect(formatMoneyCompact(0, "USD", "en")).toBe("$0");
    });
});
