import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "./products.api";

export function useProducts(search: string, page: number) {
    return useQuery({
        queryKey: ["products", search, page],
        queryFn: () => fetchProducts(search, page),
        placeholderData: keepPreviousData,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id),
    });
}
