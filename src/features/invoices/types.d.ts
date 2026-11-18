import type { UseQueryResult } from "@tanstack/react-query";
import type { Amount } from "@/shared/lib/money";
import type { Page } from "@/shared/types";

export type InvoiceLanguage = "en" | "es" | "other";

export type VendorRef = { id: string; name: string };

export type Vendor = VendorRef & {
    taxId: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    country: string | null;
};

export type InvoiceSummary = {
    id: string;
    invoiceNumber: string | null;
    issueDate: string;
    dueDate: string | null;
    currency: string;
    subtotal: Amount;
    vat: Amount;
    withholding: Amount | null;
    total: Amount;
    language: InvoiceLanguage;
    runId: string | null;
    vendor: VendorRef | null;
    lineCount: number;
};

export type InvoiceLine = {
    id: string;
    productId: string;
    productName: string;
    sku: string | null;
    unit: string | null;
    description: string;
    quantity: number;
    /** Exactly as printed, e.g. "0.00000023148148" for a per-MB-minute rate. */
    unitPriceNet: Amount;
    unitPriceGross: Amount | null;
    vatRate: number | null;
    discount: Amount | null;
    lineNet: Amount;
    lineVat: Amount | null;
    lineGross: Amount;
};

export type InvoiceDocument = {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    source: "email" | "import";
    createdAt: string;
};

export type InvoiceDetail = Omit<InvoiceSummary, "vendor"> & {
    paymentMethod: string | null;
    notes: string | null;
    emailId: string | null;
    /** The connected Gmail account the invoice arrived in; null for imported invoices. */
    gmailAccount: string | null;
    createdAt: string;
    vendor: Vendor;
    lines: InvoiceLine[];
    documents: InvoiceDocument[];
};

export type InvoicePage = Page<InvoiceSummary>;

export type InvoiceFilters = { search: string; page: number };

export type DownloadUrlResponse = { url: string; expiresInSeconds: number };

export type DetailField = { label: string; value: string };

export type InvoiceTotalsRow = {
    label: string;
    amount: Amount;
    isTotal: boolean;
};

export type InvoiceTableProps = { invoices: InvoiceSummary[] };
export type InvoiceRowProps = { invoice: InvoiceSummary };
export type InvoiceHeaderProps = { invoice: InvoiceDetail };
export type VendorPanelProps = { vendor: Vendor };
export type LineItemsTableProps = { lines: InvoiceLine[]; currency: string };
export type InvoiceTotalsProps = { invoice: InvoiceDetail };
export type DocumentListProps = { documents: InvoiceDocument[] };
export type PaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
};
export type InvoiceResultsProps = {
    query: UseQueryResult<InvoicePage>;
    search: string;
    onPageChange: (page: number) => void;
};
