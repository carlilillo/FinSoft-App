export { ProductList } from "./ProductList";
export type { ProductDetail, ProductPage, ProductSummary } from "./types";

/** Route pages are loaded on demand so the charting library stays out of the main bundle. */
export const loadProductsPage = () =>
    import("./ProductsPage").then((module) => module.ProductsPage);
export const loadProductDetailPage = () =>
    import("./ProductDetailPage").then((module) => module.ProductDetailPage);
