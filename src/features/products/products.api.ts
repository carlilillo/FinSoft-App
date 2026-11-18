import { type DirectionFilter, directionParam } from "@/features/invoices";
import { apiGet } from "@/shared/lib/http";
import type { ProductDetail, ProductPage } from "./types";

export function fetchProducts(
    search: string,
    page: number,
    filter: DirectionFilter,
): Promise<ProductPage> {
    const params = new URLSearchParams({ page: String(page), pageSize: "30" });
    if (search.trim()) params.set("search", search.trim());
    const direction = directionParam(filter);
    if (direction) params.set("direction", direction);
    return apiGet<ProductPage>(`/products?${params.toString()}`);
}

export function fetchProduct(id: string): Promise<ProductDetail> {
    return apiGet<ProductDetail>(`/products/${id}`);
}
