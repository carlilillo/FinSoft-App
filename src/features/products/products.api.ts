import { apiGet } from "@/shared/lib/http";
import type { ProductDetail, ProductPage } from "./types";

export function fetchProducts(
    search: string,
    page: number,
): Promise<ProductPage> {
    const params = new URLSearchParams({ page: String(page), pageSize: "30" });
    if (search.trim()) params.set("search", search.trim());
    return apiGet<ProductPage>(`/products?${params.toString()}`);
}

export function fetchProduct(id: string): Promise<ProductDetail> {
    return apiGet<ProductDetail>(`/products/${id}`);
}
