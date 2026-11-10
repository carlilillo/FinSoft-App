import { useParams } from "react-router";
import { useDesign } from "@/features/design-lab";
import { ErrorState, PageHeader, Skeleton } from "@/shared/ui";
import { PriceSection } from "./PriceSection";
import { PriceStatsList } from "./PriceStatsList";
import {
    computePriceStats,
    mainCurrency,
    productSubtitle,
    toPriceChartPoints,
} from "./products.model";
import { PurchaseTable } from "./PurchaseTable";
import type { ProductBodyProps } from "./types";
import { useProduct } from "./useProducts";
import styles from "./ProductDetailPage.module.css";

export function ProductDetailPage() {
    const { productId = "" } = useParams();
    const { design } = useDesign();
    const query = useProduct(productId);
    const back = {
        to: "/products",
        label: "Products",
        viewTransition: design.motion === "fluid",
    };

    if (query.isPending) {
        return (
            <>
                <PageHeader title="Product" back={back} />
                <Skeleton lines={8} height="2rem" />
            </>
        );
    }
    if (query.isError) {
        return (
            <>
                <PageHeader title="Product" back={back} />
                <ErrorState
                    error={query.error}
                    onRetry={() => void query.refetch()}
                />
            </>
        );
    }
    return (
        <>
            <PageHeader
                title={query.data.displayName}
                description={productSubtitle(query.data)}
                back={back}
            />
            <ProductBody product={query.data} />
        </>
    );
}

function ProductBody({ product }: ProductBodyProps) {
    const { design } = useDesign();
    const currency = mainCurrency(product);
    const points = toPriceChartPoints(product.priceHistory, currency);
    const stats = computePriceStats(points, currency);
    return (
        <>
            {design.motion === "fluid" && (
                <span
                    className="visually-hidden"
                    style={{ viewTransitionName: `product-${product.id}` }}
                >
                    {product.displayName}
                </span>
            )}
            {stats && <PriceStatsList stats={stats} />}
            <PriceSection points={points} currency={currency} />
            <section aria-labelledby="purchases-title">
                <h2 id="purchases-title" className={styles.sectionTitle}>
                    Purchases
                </h2>
                <PurchaseTable points={product.priceHistory} />
            </section>
        </>
    );
}
