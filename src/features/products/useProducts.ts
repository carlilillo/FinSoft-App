import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DirectionFilter } from "@/features/invoices";
import { fetchProduct, fetchProducts } from "./products.api";

export function useProducts(
    search: string,
    page: number,
    filter: DirectionFilter,
) {
    return useQuery({
        queryKey: ["products", search, page, filter],
        queryFn: () => fetchProducts(search, page, filter),
        placeholderData: keepPreviousData,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id),
    });
}
