import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { downloadDocument, fetchInvoice, fetchInvoices } from "./invoices.api";
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
