import { formatDate } from "@/shared/lib/dates";
import type {
    DetailField,
    InvoiceDetail,
    InvoiceLine,
    InvoiceTotalsRow,
    Vendor,
} from "./types";

const LANGUAGE_LABELS = {
    en: "English",
    es: "Spanish",
    other: "Other",
} as const;

export function invoiceTitle(invoice: {
    invoiceNumber: string | null;
    vendor: { name: string } | null;
}): string {
    return (
        invoice.invoiceNumber ??
        `${invoice.vendor?.name ?? "Unknown vendor"} receipt`
    );
}

export function invoiceFields(invoice: InvoiceDetail): DetailField[] {
    const fields: Array<DetailField | null> = [
        { label: "Issued", value: formatDate(invoice.issueDate) },
        invoice.dueDate
            ? { label: "Due", value: formatDate(invoice.dueDate) }
            : null,
        invoice.paymentMethod
            ? { label: "Payment", value: invoice.paymentMethod }
            : null,
        { label: "Language", value: LANGUAGE_LABELS[invoice.language] },
        { label: "Currency", value: invoice.currency },
    ];
    return fields.filter((field): field is DetailField => field !== null);
}

/** Only the contact details actually printed on the invoice are shown. */
export function vendorFields(vendor: Vendor): DetailField[] {
    const candidates: Array<[string, string | null]> = [
        ["Tax ID", vendor.taxId],
        ["Address", vendor.address],
        ["Email", vendor.email],
        ["Phone", vendor.phone],
        ["Website", vendor.website],
        ["Country", vendor.country],
    ];
    return candidates.flatMap(([label, value]) =>
        value ? [{ label, value }] : [],
    );
}

export function invoiceTotals(invoice: InvoiceDetail): InvoiceTotalsRow[] {
    const rows: InvoiceTotalsRow[] = [
        {
            label: "Subtotal (excl. VAT)",
            cents: invoice.subtotalCents,
            isTotal: false,
        },
        { label: "VAT", cents: invoice.vatCents, isTotal: false },
    ];
    if (invoice.withholdingCents)
        rows.push({
            label: "Withholding",
            cents: -invoice.withholdingCents,
            isTotal: false,
        });
    rows.push({ label: "Total", cents: invoice.totalCents, isTotal: true });
    return rows;
}

export function formatQuantity(line: InvoiceLine): string {
    const quantity = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 3,
    }).format(line.quantity);
    return line.unit ? `${quantity} ${line.unit}` : quantity;
}

export function formatVatRate(rate: number | null): string {
    return rate === null
        ? "—"
        : `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(rate)}%`;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
