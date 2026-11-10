import { useDeferredValue, useState } from "react";
import {
    EmptyState,
    ErrorState,
    Icon,
    PageHeader,
    Skeleton,
} from "@/shared/ui";
import { ProductList } from "./ProductList";
import type { ProductResultsProps } from "./types";
import { useProducts } from "./useProducts";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const query = useProducts(deferredSearch, 1);

    return (
        <>
            <PageHeader
                title="Products"
                description="Everything you've bought, with the price you paid last time."
            />
            <label className={styles.search}>
                <Icon name="search" />
                <span className="visually-hidden">Search products</span>
                <input
                    type="search"
                    placeholder="Search by product, SKU or vendor"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </label>
            <ProductResults query={query} search={deferredSearch} />
        </>
    );
}

function ProductResults({ query, search }: ProductResultsProps) {
    if (query.isPending) return <Skeleton lines={8} height="2.5rem" />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.total === 0) {
        return search ? (
            <EmptyState title={`No products match “${search}”`} />
        ) : (
            <EmptyState title="No products yet">
                Products appear as FinSift extracts invoice lines.
            </EmptyState>
        );
    }
    return <ProductList products={query.data.items} />;
}
