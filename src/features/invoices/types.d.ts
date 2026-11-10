import type { UseQueryResult } from "@tanstack/react-query";
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
    subtotalCents: number;
    vatCents: number;
    withholdingCents: number | null;
    totalCents: number;
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
    unitPriceNetCents: number;
    unitPriceGrossCents: number | null;
    vatRate: number | null;
    discountCents: number | null;
    lineNetCents: number;
    lineVatCents: number | null;
    lineGrossCents: number;
};

export type InvoiceDocument = {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    source: "email" | "upload";
    createdAt: string;
};

export type InvoiceDetail = Omit<InvoiceSummary, "vendor"> & {
    paymentMethod: string | null;
    notes: string | null;
    emailId: string | null;
    createdAt: string;
    vendor: Vendor;
    lines: InvoiceLine[];
    documents: InvoiceDocument[];
};

export type InvoicePage = Page<InvoiceSummary>;

export type InvoiceFilters = { search: string; page: number };

export type UploadUrlResponse = {
    documentId: string;
    uploadUrl: string;
    method: "PUT";
    headers: Record<string, string>;
};

export type DownloadUrlResponse = { url: string; expiresInSeconds: number };

export type DetailField = { label: string; value: string };

export type InvoiceTotalsRow = {
    label: string;
    cents: number;
    isTotal: boolean;
};

export type InvoiceTableProps = { invoices: InvoiceSummary[] };
export type InvoiceRowProps = { invoice: InvoiceSummary };
export type InvoiceHeaderProps = { invoice: InvoiceDetail };
export type VendorPanelProps = { vendor: Vendor };
export type LineItemsTableProps = { lines: InvoiceLine[]; currency: string };
export type InvoiceTotalsProps = { invoice: InvoiceDetail };
export type DocumentListProps = {
    invoiceId: string;
    documents: InvoiceDocument[];
};
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
