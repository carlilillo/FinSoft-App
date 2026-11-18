import { useDeferredValue, useState } from "react";
import {
    type DirectionFilter,
    DirectionFilterControl,
    useDirectionFilter,
} from "@/features/invoices";
import {
    EmptyState,
    ErrorState,
    Icon,
    PageHeader,
    Skeleton,
} from "@/shared/ui";
import { PRODUCT_PAGE_DESCRIPTIONS } from "./products.model";
import { ProductTable } from "./ProductTable";
import type { ProductResultsProps } from "./types";
import { useProducts } from "./useProducts";
import styles from "./ProductsPage.module.css";

/** Opens on what the person buys; the filter also shows what they sell, or both. */
export function ProductsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useDirectionFilter("received");
    const deferredSearch = useDeferredValue(search);
    const query = useProducts(deferredSearch, 1, filter);

    return (
        <>
            <PageHeader
                title="Products"
                description={PRODUCT_PAGE_DESCRIPTIONS[filter]}
            />
            <div className={styles.toolbar}>
                <label className={styles.search}>
                    <Icon name="search" />
                    <span className="visually-hidden">Search products</span>
                    <input
                        type="search"
                        placeholder="Search by product, SKU or company"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>
                <DirectionFilterControl value={filter} onChange={setFilter} />
            </div>
            <ProductResults
                query={query}
                search={deferredSearch}
                filter={filter}
            />
        </>
    );
}

const EMPTY_DETAILS: Record<DirectionFilter, string> = {
    all: "Products appear as FinSift extracts invoice lines.",
    issued: "Products you sell appear once you import the invoices you issued.",
    received:
        "Products appear as FinSift extracts the invoices your providers send you.",
};

function ProductResults({ query, search, filter }: ProductResultsProps) {
    if (query.isPending) return <Skeleton lines={8} height="2.25rem" />;
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
                {EMPTY_DETAILS[filter]}
            </EmptyState>
        );
    }
    return <ProductTable products={query.data.items} filter={filter} />;
}
