import { describe, expect, it } from "vitest";
import {
    formatVatRate,
    invoiceTitle,
    invoiceTotals,
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
