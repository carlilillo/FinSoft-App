import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    downloadDocument,
    fetchInvoice,
    fetchInvoices,
    uploadDocument,
} from "./invoices.api";
import type { InvoiceFilters } from "./types";

export function useInvoices(filters: InvoiceFilters) {
    return useQuery({
        queryKey: ["invoices", filters],
        queryFn: () => fetchInvoices(filters),
        placeholderData: keepPreviousData,
    });
}

export function useInvoice(id: string) {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: () => fetchInvoice(id),
    });
}

export function useDocumentDownload() {
    return useMutation({ mutationFn: downloadDocument });
}

export function useDocumentUpload(invoiceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => uploadDocument(invoiceId, file),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
    });
}
