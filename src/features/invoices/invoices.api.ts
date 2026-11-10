import { apiGet, apiPost, uploadToPresignedUrl } from "@/shared/lib/http";
import type {
    DownloadUrlResponse,
    InvoiceDetail,
    InvoiceFilters,
    InvoicePage,
    UploadUrlResponse,
} from "./types";

const PAGE_SIZE = 20;

export function fetchInvoices(filters: InvoiceFilters): Promise<InvoicePage> {
    const params = new URLSearchParams({
        page: String(filters.page),
        pageSize: String(PAGE_SIZE),
    });
    if (filters.search.trim()) params.set("search", filters.search.trim());
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

/** Presigned upload: ask for a URL, PUT the file straight to S3, then confirm. */
export async function uploadDocument(
    invoiceId: string,
    file: File,
): Promise<void> {
    const upload = await apiPost<UploadUrlResponse>("/documents/upload-url", {
        invoiceId,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        sizeBytes: file.size,
    });
    await uploadToPresignedUrl(upload.uploadUrl, file, upload.headers);
    await apiPost(`/documents/${upload.documentId}/confirm`);
}
