import { apiGet } from "@/shared/lib/http";
import { directionParam } from "./invoices.model";
import type {
    DownloadUrlResponse,
    InvoiceDetail,
    InvoiceFilters,
    InvoicePage,
} from "./types";

const PAGE_SIZE = 20;

export function fetchInvoices(filters: InvoiceFilters): Promise<InvoicePage> {
    const params = new URLSearchParams({
        page: String(filters.page),
        pageSize: String(PAGE_SIZE),
    });
    if (filters.search.trim()) params.set("search", filters.search.trim());
    const direction = directionParam(filters.direction);
    if (direction) params.set("direction", direction);
    return apiGet<InvoicePage>(`/invoices?${params.toString()}`);
}

export function fetchInvoice(id: string): Promise<InvoiceDetail> {
    return apiGet<InvoiceDetail>(`/invoices/${id}`);
}

export async function downloadDocument(documentId: string): Promise<void> {
    const { url } = await apiGet<DownloadUrlResponse>(
        `/documents/${documentId}/download-url`,
    );
    window.location.assign(url);
}
