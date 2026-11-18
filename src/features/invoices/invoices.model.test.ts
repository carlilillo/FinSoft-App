import { describe, expect, it } from "vitest";
import {
    directionParam,
    directionSummary,
    formatVatRate,
    invoiceTitle,
    invoiceTotals,
    parseDirectionFilter,
    signedTotal,
    vendorFields,
} from "./invoices.model";
import type { InvoiceDetail } from "./types";

const invoice = {
    invoiceNumber: null,
    subtotal: "100.00",
    vat: "21.00",
    withholding: "15.00",
    total: "106.00",
    vendor: {
        id: "V",
        name: "Papelería Martínez",
        taxId: "B12345678",
        address: null,
        email: null,
        phone: null,
        website: null,
        country: "ES",
    },
} as unknown as InvoiceDetail;

describe("invoice model", () => {
    it("names receipts without a number after their vendor", () => {
        expect(invoiceTitle(invoice)).toBe("Papelería Martínez receipt");
    });

    it("shows withholding as a deduction before the total", () => {
        expect(
            invoiceTotals(invoice).map((row) => [row.label, row.amount]),
        ).toEqual([
            ["Subtotal (excl. VAT)", "100.00"],
            ["VAT", "21.00"],
            ["Withholding", "-15.00"],
            ["Total", "106.00"],
        ]);
    });

    it("shows only the vendor details printed on the invoice", () => {
        expect(
            vendorFields(invoice.vendor).map((field) => field.label),
        ).toEqual(["Tax ID", "Country"]);
    });

    it("formats VAT rates and unknown rates", () => {
        expect(formatVatRate(21)).toBe("21%");
        expect(formatVatRate(null)).toBe("—");
    });
});

describe("invoice direction", () => {
    it("adds what you issued and subtracts what providers billed you", () => {
        expect(signedTotal({ direction: "issued", total: "1210.00" })).toBe(
            "1210.00",
        );
        expect(signedTotal({ direction: "received", total: "80.50" })).toBe(
            "-80.50",
        );
    });

    it("reads the filter from the URL, falling back to the page's default", () => {
        expect(parseDirectionFilter("issued", "all")).toBe("issued");
        expect(parseDirectionFilter(null, "received")).toBe("received");
        expect(parseDirectionFilter("everything", "all")).toBe("all");
    });

    it("sends no direction for all invoices", () => {
        expect(directionParam("all")).toBeNull();
        expect(directionParam("received")).toBe("received");
    });

    it("says who billed whom", () => {
        expect(directionSummary("issued", "Acme S.L.")).toBe(
            "Issued by you to Acme S.L.",
        );
        expect(directionSummary("received", "Iberdrola")).toBe(
            "Received from Iberdrola",
        );
    });
});
