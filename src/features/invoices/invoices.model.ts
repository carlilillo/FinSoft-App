import { formatDate } from "@/shared/lib/dates";
import { type Amount, negate, toNumber } from "@/shared/lib/money";
import type { SegmentOption } from "@/shared/ui/types";
import type {
    DetailField,
    DirectionFilter,
    InvoiceDirection,
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

/** The same three choices on Overview, Invoices and Products. */
export const DIRECTION_FILTERS: ReadonlyArray<SegmentOption<DirectionFilter>> =
    [
        { value: "all", label: "All invoices" },
        { value: "issued", label: "Issued by you" },
        { value: "received", label: "From providers" },
    ];

const DIRECTION_FILTER_VALUES = new Set<string>(
    DIRECTION_FILTERS.map((option) => option.value),
);

/** Reads a filter from the URL; anything unknown falls back to the page's default. */
export function parseDirectionFilter(
    value: string | null,
    fallback: DirectionFilter,
): DirectionFilter {
    return value !== null && DIRECTION_FILTER_VALUES.has(value)
        ? (value as DirectionFilter)
        : fallback;
}

/** The `direction` query parameter the server expects; "all" sends none. */
export function directionParam(
    filter: DirectionFilter,
): InvoiceDirection | null {
    return filter === "all" ? null : filter;
}

/** Money in is positive, money out is negative: what you issued adds, what providers billed you subtracts. */
export function signedTotal(invoice: {
    direction: InvoiceDirection;
    total: Amount;
}): Amount {
    return invoice.direction === "issued"
        ? invoice.total
        : negate(invoice.total);
}

/** The role the other company plays on the invoice. */
export function counterpartyRole(direction: InvoiceDirection): string {
    return direction === "issued" ? "Your customer" : "Your provider";
}

/** One sentence that says who billed whom, for the invoice detail. */
export function directionSummary(
    direction: InvoiceDirection,
    counterparty: string,
): string {
    return direction === "issued"
        ? `Issued by you to ${counterparty}`
        : `Received from ${counterparty}`;
}

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
        invoice.gmailAccount
            ? { label: "Received in", value: invoice.gmailAccount }
            : null,
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
            amount: invoice.subtotal,
            isTotal: false,
        },
        { label: "VAT", amount: invoice.vat, isTotal: false },
    ];
    if (invoice.withholding !== null && toNumber(invoice.withholding) !== 0)
        rows.push({
            label: "Withholding",
            amount: negate(invoice.withholding),
            isTotal: false,
        });
    rows.push({ label: "Total", amount: invoice.total, isTotal: true });
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
